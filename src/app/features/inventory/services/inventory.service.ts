import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/components';
import {
  InventorySummaryStats,
  JewelryItem,
  JewelryListResponse,
  JewelryQueryFilters
} from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private readonly apiUrl = `${environment.apiUrl}/inventory`;

  getItems(filters: JewelryQueryFilters = {}): Observable<JewelryListResponse> {
    let params = new HttpParams();

    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());
    if (filters.search && filters.search.trim()) params = params.set('search', filters.search.trim());
    if (filters.category) params = params.set('category', filters.category);
    if (filters.metal_type) params = params.set('metal_type', filters.metal_type);
    if (filters.critical_stock_only) params = params.set('critical_stock_only', 'true');
    if (filters.sort_by) params = params.set('sort_by', filters.sort_by);
    if (filters.sort_order) params = params.set('sort_order', filters.sort_order);

    return this.http.get<JewelryListResponse>(this.apiUrl, { params });
  }

  getSummaryStats(): Observable<InventorySummaryStats> {
    return this.http.get<InventorySummaryStats>(`${this.apiUrl}/stats`);
  }

  getItemById(id: string): Observable<JewelryItem> {
    return this.http.get<JewelryItem>(`${this.apiUrl}/${id}`);
  }

  createItem(dto: Partial<JewelryItem>): Observable<JewelryItem> {
    return this.http.post<JewelryItem>(this.apiUrl, dto).pipe(
      tap((item) => {
        this.toastService.success(`Joia "${item.name}" cadastrada com sucesso.`);
      })
    );
  }

  updateItem(id: string, dto: Partial<JewelryItem>): Observable<JewelryItem> {
    return this.http.put<JewelryItem>(`${this.apiUrl}/${id}`, dto).pipe(
      tap((item) => {
        this.toastService.success(`Joia "${item.name}" atualizada com sucesso.`);
      })
    );
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.toastService.success('Joia excluída com sucesso.');
      })
    );
  }
}
