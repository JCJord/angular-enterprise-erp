import { Component, inject, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  host: {
    '[class.w-full]': 'full()',
    '[class.inline-block]': '!full()'
  }
})
export class TextInputComponent {
  private formGroupDirective = inject(FormGroupDirective, { optional: true });

  /** Form control name when used inside a FormGroup */
  name = input<string>('');

  /** Optional label displayed above the input */
  label = input<string>();

  /** Placeholder text */
  placeholder = input<string>('');

  /** Input type (text, password, number, email, search) */
  type = input<'text' | 'password' | 'email' | 'number' | 'search'>('text');

  /** Disabled state */
  disabled = input<boolean>(false);

  /** Required field indicator */
  required = input<boolean>(false);

  /** Helper hint message below the input */
  hint = input<string>();

  /** Whether to use monospace font (for WMS/SAP codes) */
  mono = input<boolean>(false);

  /** Full width container */
  full = input<boolean>(true);

  /** Prefix text/symbol */
  prefix = input<string>();

  /** Suffix text/symbol */
  suffix = input<string>();

  /** Manual two-way value fallback when not using Reactive Forms */
  value = input<string | number>('');

  /** Value changed event */
  valueChanged = output<string>();

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChanged.emit(target.value);
  }

  get control() {
    return this.formGroupDirective?.form.get(this.name());
  }

  get isInvalid(): boolean {
    if (!this.control) return false;
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  getFirstError(): string {
    const errors = this.control?.errors;
    if (!errors) return '';

    if (errors['required']) return 'Campo obrigatório';
    if (errors['email']) return 'E-mail inválido';
    if (errors['minlength']) return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['min']) return `Valor mínimo é ${errors['min'].min}`;
    if (errors['max']) return `Valor máximo é ${errors['max'].max}`;
    if (errors['pattern']) return 'Formato inválido';

    return 'Valor inválido';
  }
}
