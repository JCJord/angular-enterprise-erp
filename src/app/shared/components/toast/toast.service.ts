import { Injectable, signal } from '@angular/core';
import { Toast, ToastOptions, ToastType } from './toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(type: ToastType, message: string, options?: ToastOptions): string {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    const toast: Toast = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? 4500
    };

    this._toasts.update((current) => [...current, toast]);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, toast.duration);
    }

    return id;
  }

  success(message: string, options?: ToastOptions): string {
    return this.show('success', message, options);
  }

  error(message: string, options?: ToastOptions): string {
    return this.show('danger', message, options);
  }

  warning(message: string, options?: ToastOptions): string {
    return this.show('warning', message, options);
  }

  info(message: string, options?: ToastOptions): string {
    return this.show('info', message, options);
  }

  remove(id: string): void {
    this._toasts.update((current) => current.filter((t) => t.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }
}
