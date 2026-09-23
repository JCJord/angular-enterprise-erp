import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';

export type ButtonVariant = 'brand' | 'solid' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './button.component.html',
  host: {
    '[class.w-full]': 'full()',
    '[class.inline-block]': '!full()'
  }
})
export class ButtonComponent {
  variant = input<ButtonVariant>('brand');
  size = input<ButtonSize>('md');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  full = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  protected spinnerSize = computed(() => {
    switch (this.size()) {
      case 'sm': return 13;
      case 'lg': return 18;
      default: return 15;
    }
  });

  protected buttonClasses = computed(() => {
    const base = 'inline-flex items-center justify-center font-medium rounded-md transition-colors select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    let sizeClass = 'px-3.5 py-2 text-sm leading-5 gap-2';
    if (this.size() === 'sm') sizeClass = 'px-2.5 py-1.5 text-xs leading-4 gap-1.5';
    if (this.size() === 'lg') sizeClass = 'px-4.5 py-2.5 text-base leading-6 gap-2.5';

    let variantClass = 'bg-brand text-white border border-transparent hover:bg-brand-hover active:bg-brand-dark shadow-xs';
    switch (this.variant()) {
      case 'secondary':
        variantClass = 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-xs';
        break;
      case 'outline':
        variantClass = 'bg-transparent text-brand border border-brand hover:bg-brand-light active:bg-brand-light/80';
        break;
      case 'ghost':
        variantClass = 'bg-transparent text-slate-600 border border-transparent hover:bg-slate-100 hover:text-slate-900';
        break;
      case 'danger':
        variantClass = 'bg-rose-600 text-white border border-transparent hover:bg-rose-700 active:bg-rose-800 shadow-xs';
        break;
      case 'brand':
      case 'solid':
      default:
        variantClass = 'bg-brand text-white border border-transparent hover:bg-brand-hover active:bg-brand-dark shadow-xs';
        break;
    }

    const fullClass = this.full() ? 'w-full' : '';

    return `${base} ${sizeClass} ${variantClass} ${fullClass}`;
  });
}
