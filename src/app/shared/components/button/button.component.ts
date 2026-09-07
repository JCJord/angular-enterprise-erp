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
  styleUrl: './button.component.scss',
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
}
