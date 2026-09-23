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
  templateUrl: './toast.component.html'
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  getToastClasses(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'bg-white border-emerald-200 text-emerald-600';
      case 'danger':
        return 'bg-white border-rose-200 text-rose-600';
      case 'warning':
        return 'bg-white border-amber-200 text-amber-600';
      case 'info':
        return 'bg-white border-blue-200 text-blue-600';
    }
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
