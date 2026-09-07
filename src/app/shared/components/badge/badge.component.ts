import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant =
  | 'occupied'
  | 'reserved'
  | 'free'
  | 'blocked'
  | 'cargo'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [class]="'badge--' + variant()" [class.badge--dot]="dot()">
      @if (dot()) {
        <span class="badge-dot"></span>
      }
      <ng-content></ng-content>
    </span>
  `,
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  variant = input<BadgeVariant>('neutral');
  dot = input<boolean>(true);
}
