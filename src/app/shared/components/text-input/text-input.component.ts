import { Component, inject, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlassSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  providers: [
    provideIcons({
      heroMagnifyingGlassSolid
    })
  ],
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

  name = input<string>('');
  label = input<string>();
  placeholder = input<string>('');
  type = input<'text' | 'password' | 'email' | 'number' | 'search'>('text');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  hint = input<string>();
  mono = input<boolean>(false);
  full = input<boolean>(true);
  prefix = input<string>();
  suffix = input<string>();
  prefixIcon = input<string>();
  suffixIcon = input<string>();
  value = input<string | number>('');
  valueChanged = output<string>();

  effectivePrefixIcon = computed(() => {
    if (this.prefixIcon()) return this.prefixIcon();
    if (this.type() === 'search') return 'heroMagnifyingGlassSolid';
    return null;
  });

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
