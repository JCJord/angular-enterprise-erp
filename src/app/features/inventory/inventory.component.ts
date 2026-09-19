import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  of,
  startWith,
  switchMap,
  tap
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlassSolid,
  heroFunnelSolid,
  heroArrowPathSolid,
  heroExclamationTriangleSolid,
  heroChevronLeftSolid,
  heroChevronRightSolid,
  heroSparklesSolid,
  heroCubeSolid,
  heroTagSolid,
  heroScaleSolid,
  heroPlusSolid,
  heroEyeSolid,
  heroPencilSquareSolid,
  heroArrowsRightLeftSolid,
  heroTrashSolid
} from '@ng-icons/heroicons/solid';

import { InventoryService } from './services/inventory.service';
import {
  InventorySummaryStats,
  JewelryCategory,
  JewelryCategoryLabels,
  JewelryItem,
  JewelryListResponse,
  JewelryQueryFilters,
  MetalType,
  MetalTypeLabels
} from './models/inventory.model';
import { CurrencyBrPipe, JewelryWeightPipe } from '../../shared/pipes';
import { Dialog } from '@angular/cdk/dialog';
import {
  ButtonComponent,
  ConfirmDialogComponent,
  DataTableComponent,
  SelectComponent,
  SelectOption,
  SpinnerComponent,
  TableCellDirective,
  TableColumn,
  TextInputComponent,
  ToastService
} from '../../shared/components';
import { JewelryDetailsDialogComponent } from './components/jewelry-details-dialog/jewelry-details-dialog.component';
import { JewelryFormDialogComponent } from './components/jewelry-form-dialog/jewelry-form-dialog.component';
import { AdjustStockDialogComponent } from './components/adjust-stock-dialog/adjust-stock-dialog.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIconComponent,
    CurrencyBrPipe,
    JewelryWeightPipe,
    ButtonComponent,
    TextInputComponent,
    SelectComponent,
    SpinnerComponent,
    DataTableComponent,
    TableCellDirective
  ],
  providers: [
    provideIcons({
      heroMagnifyingGlassSolid,
      heroFunnelSolid,
      heroArrowPathSolid,
      heroExclamationTriangleSolid,
      heroChevronLeftSolid,
      heroChevronRightSolid,
      heroSparklesSolid,
      heroCubeSolid,
      heroTagSolid,
      heroScaleSolid,
      heroPlusSolid,
      heroEyeSolid,
      heroPencilSquareSolid,
      heroArrowsRightLeftSolid,
      heroTrashSolid
    })
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(Dialog);
  private toastService = inject(ToastService);

  readonly categories = Object.values(JewelryCategory);
  readonly metalTypes = Object.values(MetalType);
  readonly categoryLabels = JewelryCategoryLabels;
  readonly metalLabels = MetalTypeLabels;

  readonly categoryOptions: SelectOption[] = Object.values(JewelryCategory).map((cat) => ({
    value: cat,
    label: JewelryCategoryLabels[cat] || cat
  }));

  readonly metalTypeOptions: SelectOption[] = Object.values(MetalType).map((metal) => ({
    value: metal,
    label: MetalTypeLabels[metal].label
  }));

  getCategoryLabel(category: any): string {
    return this.categoryLabels[category as JewelryCategory] || category || '-';
  }

  getMetalLabel(metalType: any): { label: string; badgeClass: string } {
    return (
      this.metalLabels[metalType as MetalType] || {
        label: String(metalType || '-'),
        badgeClass: 'bg-app text-secondary border-base'
      }
    );
  }

  readonly tableColumns: TableColumn<JewelryItem>[] = [
    { key: 'photo', header: 'Foto', width: '70px', align: 'center' },
    { key: 'sku', header: 'Código / SKU', width: '130px', sortable: true },
    { key: 'name', header: 'Descrição da Joia', sortable: true },
    { key: 'category', header: 'Categoria', width: '140px' },
    { key: 'metal_type', header: 'Tipo de Metal', width: '150px' },
    { key: 'weight_grams', header: 'Peso Líquido', width: '120px', align: 'right', sortable: true },
    { key: 'stock_quantity', header: 'Estoque', width: '120px', align: 'center', sortable: true },
    { key: 'base_price', header: 'Preço de Venda', width: '140px', align: 'right', sortable: true }
  ];

  readonly isLoading = signal<boolean>(false);
  readonly stats = signal<InventorySummaryStats | null>(null);
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly totalItems = signal<number>(0);
  readonly totalPages = signal<number>(1);

  readonly sortBy = signal<string>('created_at');
  readonly sortOrder = signal<'ASC' | 'DESC'>('DESC');
  readonly sortDirectionForTable = computed<'asc' | 'desc'>(() =>
    this.sortOrder() === 'ASC' ? 'asc' : 'desc'
  );

  readonly filterForm = this.fb.group({
    search: new FormControl<string>(''),
    category: new FormControl<JewelryCategory | ''>(''),
    metal_type: new FormControl<MetalType | ''>(''),
    critical_stock_only: new FormControl<boolean>(false)
  });

  private readonly paginationTrigger$ = new BehaviorSubject<{ page: number; limit: number }>({
    page: 1,
    limit: 10
  });

  private readonly sortTrigger$ = new BehaviorSubject<{ sortBy: string; sortOrder: 'ASC' | 'DESC' }>({
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });

  readonly response$: Observable<JewelryListResponse> = combineLatest([
    this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      tap(() => {
        if (this.currentPage() !== 1) {
          this.currentPage.set(1);
          this.paginationTrigger$.next({ page: 1, limit: this.pageSize() });
        }
      })
    ),
    this.paginationTrigger$,
    this.sortTrigger$
  ]).pipe(
    tap(() => this.isLoading.set(true)),
    switchMap(([formValues, pagination, sort]) => {
      const filters: JewelryQueryFilters = {
        page: pagination.page,
        limit: pagination.limit,
        search: formValues.search || undefined,
        category: formValues.category || undefined,
        metal_type: formValues.metal_type || undefined,
        critical_stock_only: formValues.critical_stock_only || undefined,
        sort_by: sort.sortBy,
        sort_order: sort.sortOrder
      };

      return this.inventoryService.getItems(filters).pipe(
        catchError((err) => {
          console.error('[InventoryComponent] Erro ao carregar estoque:', err);
          return of({
            data: [],
            meta: { page: 1, limit: 10, total: 0, totalPages: 1 }
          });
        }),
        finalize(() => this.isLoading.set(false))
      );
    }),
    tap((res) => {
      this.totalItems.set(res.meta.total);
      this.totalPages.set(res.meta.totalPages || 1);
    })
  );

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.inventoryService
      .getSummaryStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.stats.set(data),
        error: (err) => console.error('[InventoryComponent] Erro ao carregar estatísticas:', err)
      });
  }

  onSortChange(event: { key: string; direction: 'asc' | 'desc' }): void {
    const order: 'ASC' | 'DESC' = event.direction === 'asc' ? 'ASC' : 'DESC';
    this.sortBy.set(event.key);
    this.sortOrder.set(order);
    this.sortTrigger$.next({ sortBy: event.key, sortOrder: order });
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages()) return;
    this.currentPage.set(newPage);
    this.paginationTrigger$.next({ page: newPage, limit: this.pageSize() });
  }

  onPageSizeChange(newLimit: number): void {
    this.pageSize.set(newLimit);
    this.currentPage.set(1);
    this.paginationTrigger$.next({ page: 1, limit: newLimit });
  }

  onLimitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newLimit = parseInt(select.value, 10) || 10;
    this.onPageSizeChange(newLimit);
  }

  toggleCriticalStock(): void {
    const current = this.filterForm.get('critical_stock_only')?.value;
    this.filterForm.patchValue({ critical_stock_only: !current });
  }

  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      category: '',
      metal_type: '',
      critical_stock_only: false
    });
  }

  refreshData(): void {
    this.loadStats();
    this.paginationTrigger$.next({ page: this.currentPage(), limit: this.pageSize() });
  }

  onAddItem(): void {
    const ref = this.dialog.open(JewelryFormDialogComponent);
    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((saved) => {
      if (saved) this.refreshData();
    });
  }

  onViewDetails(item: JewelryItem): void {
    const ref = this.dialog.open(JewelryDetailsDialogComponent, {
      data: { item }
    });
    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((action) => {
      if (action === 'edit') {
        this.onEditItem(item);
      }
    });
  }

  onEditItem(item: JewelryItem): void {
    const ref = this.dialog.open(JewelryFormDialogComponent, {
      data: { item }
    });
    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((saved) => {
      if (saved) this.refreshData();
    });
  }

  onAdjustStock(item: JewelryItem): void {
    const ref = this.dialog.open(AdjustStockDialogComponent, {
      data: { item }
    });
    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((saved) => {
      if (saved) this.refreshData();
    });
  }

  onDeleteItem(item: JewelryItem): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Joia',
        message: `Tem certeza que deseja excluir "${item.name}" (SKU: ${item.sku})? Esta ação não pode ser desfeita.`,
        confirmText: 'Sim, Excluir',
        cancelText: 'Cancelar',
        variant: 'danger'
      }
    });

    ref.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((confirmed) => {
      if (confirmed) {
        this.inventoryService
          .deleteItem(item.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.refreshData(),
            error: (err) => console.error('[InventoryComponent] Erro ao excluir:', err)
          });
      }
    });
  }
}
