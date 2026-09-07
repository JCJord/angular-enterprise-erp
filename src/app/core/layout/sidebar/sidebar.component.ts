import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroHomeSolid,
  heroTruckSolid,
  heroSquares2x2Solid,
  heroChartBarSolid,
  heroDocumentTextSolid,
  heroCog6ToothSolid,
  heroChevronLeftSolid,
  heroChevronRightSolid,
  heroArrowsRightLeftSolid,
  heroMapSolid
} from '@ng-icons/heroicons/solid';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  badge?: string;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent],
  providers: [
    provideIcons({
      heroHomeSolid,
      heroTruckSolid,
      heroSquares2x2Solid,
      heroChartBarSolid,
      heroDocumentTextSolid,
      heroCog6ToothSolid,
      heroChevronLeftSolid,
      heroChevronRightSolid,
      heroArrowsRightLeftSolid,
      heroMapSolid
    })
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  // Signals for state
  isCollapsed = signal<boolean>(false);

  // Navigation routes configuration
  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'heroHomeSolid'
    },
    {
      label: 'Movimentação',
      route: '/stock-movements',
      icon: 'heroArrowsRightLeftSolid',
      badge: 'Carga'
    },
    {
      label: 'Posições de Armazém',
      route: '/warehouse/positions',
      icon: 'heroSquares2x2Solid'
    },
    {
      label: 'Heatmap de Ocupação',
      route: '/warehouse/heatmap',
      icon: 'heroMapSolid'
    },
    {
      label: 'Relatórios',
      route: '/reports',
      icon: 'heroDocumentTextSolid'
    },
    {
      label: 'Utilitários',
      route: '/utilities',
      icon: 'heroCog6ToothSolid'
    }
  ];

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }
}
