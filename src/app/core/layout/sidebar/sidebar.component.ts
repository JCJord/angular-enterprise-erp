import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroHomeSolid,
  heroSparklesSolid,
  heroDocumentTextSolid,
  heroUsersSolid,
  heroArchiveBoxSolid,
  heroChevronLeftSolid,
  heroChevronRightSolid,
  heroChartBarSolid
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
      heroSparklesSolid,
      heroDocumentTextSolid,
      heroUsersSolid,
      heroArchiveBoxSolid,
      heroChevronLeftSolid,
      heroChevronRightSolid,
      heroChartBarSolid
    })
  ],
  templateUrl: './sidebar.component.html',
  host: { class: 'flex h-full' }
})
export class SidebarComponent {
  isCollapsed = signal<boolean>(false);

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'heroHomeSolid'
    },
    {
      label: 'Estoque de Joias',
      route: '/inventory',
      icon: 'heroArchiveBoxSolid',
      badge: 'Metais'
    },
    {
      label: 'Ordens PCP',
      route: '/orders',
      icon: 'heroDocumentTextSolid',
      badge: 'Bancada'
    },
    {
      label: 'Clientes',
      route: '/customers',
      icon: 'heroUsersSolid'
    },
    {
      label: 'Relatórios Gerenciais',
      route: '/reports',
      icon: 'heroChartBarSolid'
    }
  ];

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }
}
