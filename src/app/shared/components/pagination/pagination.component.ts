import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroChevronLeftSolid,
  heroChevronRightSolid
} from '@ng-icons/heroicons/solid';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroChevronLeftSolid,
      heroChevronRightSolid
    })
  ],
  templateUrl: './pagination.component.html',
  host: { class: 'block w-full' }
})
export class PaginationComponent {
  page = input<number>(1);
  pageSize = input<number>(environment.defaultPageSize);
  total = input<number>(0);
  pageSizeOptions = input<number[]>(environment.pageSizeOptions);
  showPageSize = input<boolean>(true);
  showTotal = input<boolean>(true);

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.total() / (this.pageSize() || 1)))
  );

  hasPrevious = computed(() => this.page() > 1);
  hasNext = computed(() => this.page() < this.totalPages());

  pageChange = output<number>();
  pageSizeChange = output<number>();

  onPrevious(): void {
    if (this.hasPrevious()) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  onNext(): void {
    if (this.hasNext()) {
      this.pageChange.emit(this.page() + 1);
    }
  }

  onPageSizeSelect(event: Event): void {
    const val = Number((event.target as HTMLSelectElement).value);
    if (val && val !== this.pageSize()) {
      this.pageSizeChange.emit(val);
    }
  }
}
