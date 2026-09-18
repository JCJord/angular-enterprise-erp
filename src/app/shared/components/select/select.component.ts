import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

export interface SelectOption<T = any> {
  value: T;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
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
export class SelectComponent {
  private formGroupDirective = inject(FormGroupDirective, { optional: true });

  name = input<string>('');
  label = input<string>();
  placeholder = input<string>('');
  options = input<SelectOption[]>([]);
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  hint = input<string>();
  full = input<boolean>(true);
  value = input<any>('');
  valueChanged = output<any>();

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
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
    return 'Opção inválida';
  }
}
