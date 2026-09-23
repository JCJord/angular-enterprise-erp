import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonComponent, ButtonVariant } from '../button/button.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangleSolid, heroXMarkSolid } from '@ng-icons/heroicons/solid';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ButtonVariant;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NgIconComponent],
  providers: [
    provideIcons({
      heroExclamationTriangleSolid,
      heroXMarkSolid
    })
  ],
  templateUrl: './confirm-dialog.component.html',
  host: { class: 'block' }
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(DialogRef);
  readonly data = inject<ConfirmDialogData>(DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
