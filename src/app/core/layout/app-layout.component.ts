import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { AuthService } from '../auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="flex h-screen w-screen overflow-hidden bg-app font-sans">
      <app-sidebar />
      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
        <app-topbar
          [userName]="authService.userName()"
          [userRole]="authService.userRole()"
          (logout)="handleLogout()"
        />
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AppLayoutComponent {
  readonly authService = inject(AuthService);

  handleLogout(): void {
    this.authService.logout();
  }
}
