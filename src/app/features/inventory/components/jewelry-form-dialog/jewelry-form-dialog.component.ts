import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  JewelryCategory,
  JewelryCategoryLabels,
  JewelryItem,
  MetalType,
  MetalTypeLabels
} from '../../models/inventory.model';
import { InventoryService } from '../../services/inventory.service';
import {
  ButtonComponent,
  SelectComponent,
  SelectOption,
  TextInputComponent
} from '../../../../shared/components';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroSparklesSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';

export interface JewelryFormDialogData {
  item?: JewelryItem;
}

@Component({
  selector: 'app-jewelry-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    TextInputComponent,
    SelectComponent,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      heroSparklesSolid,
      heroXMarkSolid
    })
  ],
  templateUrl: './jewelry-form-dialog.component.html',
  host: { class: 'block' }
})
export class JewelryFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private destroyRef = inject(DestroyRef);
  readonly dialogRef = inject(DialogRef);
  readonly data = inject<JewelryFormDialogData>(DIALOG_DATA, { optional: true });

  readonly isEditMode = computed(() => !!this.data?.item);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly categoryOptions: SelectOption[] = Object.values(JewelryCategory).map((cat) => ({
    value: cat,
    label: JewelryCategoryLabels[cat] || cat
  }));

  readonly metalTypeOptions: SelectOption[] = Object.values(MetalType).map((metal) => ({
    value: metal,
    label: MetalTypeLabels[metal].label
  }));

  readonly itemForm: FormGroup = this.fb.group({
    sku: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    category: [JewelryCategory.RING, [Validators.required]],
    metal_type: [MetalType.GOLD_18K_YELLOW, [Validators.required]],
    weight_grams: [1, [Validators.required, Validators.min(0.001)]],
    stock_quantity: [1, [Validators.required, Validators.min(0)]],
    min_stock_alert: [2, [Validators.required, Validators.min(0)]],
    gold_quotation_ref: [420.50, [Validators.required, Validators.min(1)]],
    base_price: [0, [Validators.required, Validators.min(1)]],
    photo_url: ['']
  });

  ngOnInit(): void {
    if (this.data?.item) {
      this.itemForm.patchValue({
        sku: this.data.item.sku,
        name: this.data.item.name,
        category: this.data.item.category,
        metal_type: this.data.item.metal_type,
        weight_grams: Number(this.data.item.weight_grams),
        stock_quantity: Number(this.data.item.stock_quantity),
        min_stock_alert: Number(this.data.item.min_stock_alert),
        gold_quotation_ref: Number(this.data.item.gold_quotation_ref),
        base_price: Number(this.data.item.base_price),
        photo_url: this.data.item.photo_url || ''
      });
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    const formValue = this.itemForm.value;

    const request$ = this.isEditMode() && this.data?.item
      ? this.inventoryService.updateItem(this.data.item.id, formValue)
      : this.inventoryService.createItem(formValue);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Falha ao salvar a joia.');
      }
    });
  }
}
