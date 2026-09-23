import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'occupied'
  | 'reserved'
  | 'free'
  | 'blocked'
  | 'cargo'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full leading-4 whitespace-nowrap"
      [class]="variantClasses()"
    >
      @if (dot()) {
        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
      }
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  variant = input<BadgeVariant>('neutral');
  dot = input<boolean>(true);

  protected variantClasses = computed(() => {
    switch (this.variant()) {
      case 'occupied':
        return 'bg-amber-50 text-amber-700';
      case 'reserved':
        return 'bg-blue-50 text-blue-700';
      case 'free':
      case 'success':
        return 'bg-emerald-50 text-emerald-700';
      case 'cargo':
      case 'warning':
        return 'bg-amber-50 text-amber-700';
      case 'danger':
        return 'bg-rose-50 text-rose-700';
      case 'info':
        return 'bg-blue-50 text-blue-700';
      case 'blocked':
      case 'neutral':
      default:
        return 'bg-slate-100 text-slate-700';
    }
  });
}
