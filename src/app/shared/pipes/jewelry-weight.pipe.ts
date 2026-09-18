import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jewelryWeight',
  standalone: true
})
export class JewelryWeightPipe implements PipeTransform {
  transform(
    value: number | string | null | undefined,
    unit: 'g' | 'ct' = 'g'
  ): string {
    if (value === null || value === undefined || value === '') {
      return unit === 'ct' ? '0.00 ct' : '0,000 g';
    }

    const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    if (isNaN(numericValue)) {
      return unit === 'ct' ? '0.00 ct' : '0,000 g';
    }

    if (unit === 'ct') {
      return `${numericValue.toFixed(2)} ct`;
    }

    // Default: grams with 3 decimals (Brazilian formatting: 14.250 g)
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(numericValue);

    return `${formatted} g`;
  }
}
