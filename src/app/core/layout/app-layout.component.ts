import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      <app-sidebar/>
      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
        <app-topbar (logout)="handleLogout()" />
        <main class="flex-1 overflow-y-auto p-6">
          <ng-content />
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AppLayoutComponent {
  handleLogout(): void {
    console.log('[Layout] Logout clicked');
  }
}
