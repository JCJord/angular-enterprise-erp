import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroScaleSolid, heroSparklesSolid } from '@ng-icons/heroicons/solid';
import { InventorySummaryStats } from '../../models/inventory.model';
import { CurrencyBrPipe, JewelryWeightPipe } from '../../../../shared/pipes';
import { ButtonComponent } from '../../../../shared/components';

@Component({
  selector: 'app-inventory-stats',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgIconComponent,
    CurrencyBrPipe,
    JewelryWeightPipe,
    ButtonComponent
  ],
  providers: [
    provideIcons({
      heroScaleSolid,
      heroSparklesSolid
    })
  ],
  host: { class: 'block' },
  template: `
    @if (stats(); as s) {
      <div class="flex flex-wrap items-center gap-2.5">
        <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200/80 shadow-sm">
          <ng-icon name="heroScaleSolid" class="text-amber-600 text-lg" />
          <div class="flex flex-col">
            <span class="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">Ouro no Cofre</span>
            <span class="text-xs font-bold text-amber-900 font-mono">
              {{ s.totalWeightGrams | jewelryWeight }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 shadow-sm">
          <ng-icon name="heroSparklesSolid" class="text-emerald-600 text-lg" />
          <div class="flex flex-col">
            <span class="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">Patrimônio</span>
            <span class="text-xs font-bold text-emerald-900 font-mono">
              {{ s.totalStockValue | currencyBr }}
            </span>
          </div>
        </div>

        @if (s.criticalItems > 0) {
          <app-button
            variant="secondary"
            size="md"
            (click)="criticalClick.emit()"
            title="Clique para filtrar peças em nível crítico"
          >
            <div class="flex items-center gap-2 text-rose-700">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <div class="flex flex-col text-left">
                <span class="text-[10px] font-bold uppercase tracking-wider text-rose-800">Estoque Crítico</span>
                <span class="text-xs font-extrabold text-rose-950">
                  {{ s.criticalItems }} {{ s.criticalItems === 1 ? 'peça' : 'peças' }}
                </span>
              </div>
            </div>
          </app-button>
        }
      </div>
    }
  `
})
export class InventoryStatsComponent {
  readonly stats = input<InventorySummaryStats | null>(null);
  readonly criticalClick = output<void>();
}
