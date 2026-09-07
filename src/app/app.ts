import { Component, signal } from '@angular/core';
import { AppLayoutComponent } from './core/layout/app-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('angular-enterprise-erp');
}
