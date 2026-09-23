import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JewelryItem } from '../../models/inventory.model';
import { InventoryService } from '../../services/inventory.service';
import { ButtonComponent, TextInputComponent } from '../../../../shared/components';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowsRightLeftSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';

export interface AdjustStockDialogData {
  item: JewelryItem;
}

@Component({
  selector: 'app-adjust-stock-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    TextInputComponent,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      heroArrowsRightLeftSolid,
      heroXMarkSolid
    })
  ],
  templateUrl: './adjust-stock-dialog.component.html',
  host: { class: 'block' }
})
export class AdjustStockDialogComponent {
  private fb = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private destroyRef = inject(DestroyRef);
  readonly dialogRef = inject(DialogRef);
  readonly data = inject<AdjustStockDialogData>(DIALOG_DATA);

  readonly item = this.data.item;
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly adjustForm: FormGroup = this.fb.group({
    operation: ['add', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    reason: ['', [Validators.required, Validators.minLength(3)]]
  });

  readonly newStockPreview = computed(() => {
    const op = this.adjustForm.get('operation')?.value;
    const qty = Number(this.adjustForm.get('quantity')?.value || 0);
    const current = Number(this.item.stock_quantity || 0);

    if (op === 'add') return current + qty;
    if (op === 'remove') return Math.max(0, current - qty);
    return qty;
  });

  setOperation(op: 'add' | 'remove'): void {
    this.adjustForm.patchValue({ operation: op });
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.adjustForm.invalid) {
      this.adjustForm.markAllAsTouched();
      return;
    }

    const calculatedStock = this.newStockPreview();
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.inventoryService
      .updateItem(this.item.id, {
        stock_quantity: calculatedStock
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err?.error?.message || 'Falha ao atualizar o estoque.');
        }
      });
  }
}
