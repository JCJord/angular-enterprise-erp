import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { JewelryCategoryLabels, JewelryItem, MetalTypeLabels } from '../../models/inventory.model';
import { CurrencyBrPipe, JewelryWeightPipe } from '../../../../shared/pipes';
import { ButtonComponent } from '../../../../shared/components';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCubeSolid, heroPencilSquareSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';

export interface JewelryDetailsDialogData {
  item: JewelryItem;
}

@Component({
  selector: 'app-jewelry-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyBrPipe,
    JewelryWeightPipe,
    ButtonComponent,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      heroCubeSolid,
      heroPencilSquareSolid,
      heroXMarkSolid
    })
  ],
  templateUrl: './jewelry-details-dialog.component.html',
  host: { class: 'block' }
})
export class JewelryDetailsDialogComponent {
  readonly dialogRef = inject(DialogRef);
  readonly data = inject<JewelryDetailsDialogData>(DIALOG_DATA);

  get item(): JewelryItem {
    return this.data.item;
  }

  get categoryLabel(): string {
    return JewelryCategoryLabels[this.item.category] || this.item.category;
  }

  get metalLabel(): { label: string; badgeClass: string } {
    return MetalTypeLabels[this.item.metal_type] || {
      label: String(this.item.metal_type),
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
    };
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    this.dialogRef.close('edit');
  }
}
