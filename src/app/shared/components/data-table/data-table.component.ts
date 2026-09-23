import {
  Component,
  computed,
  contentChildren,
  input,
  output,
  signal,
  TemplateRef
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroChevronUpDownSolid,
  heroChevronUpSolid,
  heroChevronDownSolid,
  heroCircleStackSolid,
  heroEyeSolid,
  heroPencilSquareSolid,
  heroArrowsRightLeftSolid,
  heroTrashSolid
} from '@ng-icons/heroicons/solid';
import { ButtonComponent } from '../button/button.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { TableCellDirective } from './table-cell.directive';
import { environment } from '../../../../environments/environment';

export interface TableColumn<T = any> {
  key: (keyof T & string) | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  mono?: boolean;
  sortable?: boolean;
}

export type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    NgTemplateOutlet,
    NgIconComponent,
    ButtonComponent,
    PaginationComponent
  ],
  providers: [
    provideIcons({
      heroChevronUpDownSolid,
      heroChevronUpSolid,
      heroChevronDownSolid,
      heroCircleStackSolid,
      heroEyeSolid,
      heroPencilSquareSolid,
      heroArrowsRightLeftSolid,
      heroTrashSolid
    })
  ],
  templateUrl: './data-table.component.html'
})
export class DataTableComponent<T = any> {
  columns = input<TableColumn<T>[]>([]);
  data = input<T[] | null | undefined>([]);
  loading = input<boolean>(false);
  emptyMessage = input<string>('Nenhum registro encontrado.');
  striped = input<boolean>(false);
  clickable = input<boolean>(true);

  sortKeyInput = input<string | null>(null, { alias: 'sortKey' });
  sortDirectionInput = input<SortDirection>(null, { alias: 'sortDirection' });

  showActions = input<boolean>(false);
  showViewAction = input<boolean>(true);
  showEditAction = input<boolean>(true);
  showAdjustStockAction = input<boolean>(false);
  showDeleteAction = input<boolean>(true);
  actionsHeader = input<string>('Ações');
  actionsWidth = input<string>('auto');

  showPagination = input<boolean>(true);
  page = input<number>(1);
  pageSize = input<number>(environment.defaultPageSize);
  total = input<number>(0);
  pageSizeOptions = input<number[]>(environment.pageSizeOptions);

  readonly customCells = contentChildren(TableCellDirective);

  private internalSortKey = signal<string | null>(null);
  private internalSortDirection = signal<SortDirection>(null);

  activeSortKey = computed(() => this.sortKeyInput() ?? this.internalSortKey());
  activeSortDirection = computed(() => this.sortDirectionInput() ?? this.internalSortDirection());

  readonly cellTemplates = computed(() => {
    const map = new Map<string, TemplateRef<any>>();
    for (const cell of this.customCells()) {
      map.set(cell.appTableCell(), cell.templateRef);
    }
    return map;
  });

  safeData = computed(() => this.data() ?? []);
  totalColumnsCount = computed(() => this.columns().length + (this.showActions() ? 1 : 0));
  trackKey = input<string>('id');

  trackRow(index: number, row: T): any {
    return (row as any)?.[this.trackKey()] ?? (row as any)?.id ?? index;
  }

  rowClick = output<T>();
  sortChange = output<{ key: string; direction: 'asc' | 'desc' }>();
  view = output<T>();
  edit = output<T>();
  adjustStock = output<T>();
  delete = output<T>();
  pageChange = output<number>();
  pageSizeChange = output<number>();

  onSort(column: TableColumn<T>): void {
    if (!column.sortable) return;

    const columnKey = String(column.key);
    const currentKey = this.activeSortKey();
    const currentDir = this.activeSortDirection();

    if (currentKey !== columnKey) {
      this.internalSortKey.set(columnKey);
      this.internalSortDirection.set('asc');
      this.sortChange.emit({ key: columnKey, direction: 'asc' });
    } else if (currentDir === 'asc') {
      this.internalSortKey.set(columnKey);
      this.internalSortDirection.set('desc');
      this.sortChange.emit({ key: columnKey, direction: 'desc' });
    } else {
      this.internalSortKey.set(null);
      this.internalSortDirection.set(null);
      this.sortChange.emit({ key: columnKey, direction: 'asc' });
    }
  }

  onRowClick(row: T): void {
    if (this.clickable() && !this.loading()) {
      this.rowClick.emit(row);
    }
  }

  onView(row: T, event: MouseEvent): void {
    event.stopPropagation();
    this.view.emit(row);
  }

  onEdit(row: T, event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(row);
  }

  onAdjustStock(row: T, event: MouseEvent): void {
    event.stopPropagation();
    this.adjustStock.emit(row);
  }

  onDelete(row: T, event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit(row);
  }

  onPageChange(newPage: number): void {
    this.pageChange.emit(newPage);
  }

  onPageSizeChange(newSize: number): void {
    this.pageSizeChange.emit(newSize);
  }

  getCellValue(row: any, key: any): any {
    if (!row || !key) return '';
    const keyStr = String(key);
    if (keyStr.includes('.')) {
      return keyStr.split('.').reduce((obj, k) => (obj ? obj[k] : ''), row);
    }
    return row[keyStr] ?? '-';
  }
}
