import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { ToastType } from './toast.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCheckCircleSolid,
  heroExclamationCircleSolid,
  heroExclamationTriangleSolid,
  heroInformationCircleSolid,
  heroXMarkSolid
} from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroCheckCircleSolid,
      heroExclamationCircleSolid,
      heroExclamationTriangleSolid,
      heroInformationCircleSolid,
      heroXMarkSolid
    })
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  getToastClasses(type: ToastType): string {
    return `toast-item--${type}`;
  }

  getIconName(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'heroCheckCircleSolid';
      case 'danger':
        return 'heroExclamationCircleSolid';
      case 'warning':
        return 'heroExclamationTriangleSolid';
      case 'info':
        return 'heroInformationCircleSolid';
    }
  }
}
