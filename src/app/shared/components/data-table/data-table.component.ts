import { Component, computed, input, output, signal, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroChevronUpDownSolid,
  heroChevronUpSolid,
  heroChevronDownSolid,
  heroCircleStackSolid
} from '@ng-icons/heroicons/solid';

export interface TableColumn {
  key: string;
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
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroChevronUpDownSolid,
      heroChevronUpSolid,
      heroChevronDownSolid,
      heroCircleStackSolid
    })
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  /** Column definitions */
  columns = input<TableColumn[]>([]);

  /** Data rows */
  data = input<any[]>([]);

  /** Loading state with skeleton / spinner */
  loading = input<boolean>(false);

  /** Empty state message */
  emptyMessage = input<string>('Nenhum registro encontrado.');

  /** Striped alternate rows */
  striped = input<boolean>(false);

  /** Allow clicking on rows */
  clickable = input<boolean>(true);

  /** Active sort state */
  sortKey = signal<string | null>(null);
  sortDirection = signal<SortDirection>(null);

  /** Events */
  rowClick = output<any>();
  sortChange = output<{ key: string; direction: 'asc' | 'desc' }>();

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortKey() !== column.key) {
      this.sortKey.set(column.key);
      this.sortDirection.set('asc');
      this.sortChange.emit({ key: column.key, direction: 'asc' });
    } else if (this.sortDirection() === 'asc') {
      this.sortDirection.set('desc');
      this.sortChange.emit({ key: column.key, direction: 'desc' });
    } else {
      this.sortKey.set(null);
      this.sortDirection.set(null);
    }
  }

  onRowClick(row: any): void {
    if (this.clickable() && !this.loading()) {
      this.rowClick.emit(row);
    }
  }

  getCellValue(row: any, key: string): any {
    if (!row || !key) return '';
    if (key.includes('.')) {
      return key.split('.').reduce((obj, k) => (obj ? obj[k] : ''), row);
    }
    return row[key] ?? '-';
  }
}
