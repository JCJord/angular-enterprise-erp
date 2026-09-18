import { Directive, TemplateRef, inject, input } from '@angular/core';

export interface TableCellContext<T = any> {
  $implicit: T;
  row: T;
  col?: any;
}

@Directive({
  selector: '[appTableCell]',
  standalone: true
})
export class TableCellDirective<T = any> {
  appTableCell = input.required<string>();
  templateRef = inject(TemplateRef<TableCellContext<T>>);

  static ngTemplateContextGuard<T>(
    dir: TableCellDirective<T>,
    ctx: any
  ): ctx is TableCellContext<T> {
    return true;
  }
}
