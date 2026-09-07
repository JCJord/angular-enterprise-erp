import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowRightOnRectangleSolid,
  heroUserCircleSolid,
  heroBellSolid,
  heroMagnifyingGlassSolid,
  heroShieldCheckSolid
} from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroArrowRightOnRectangleSolid,
      heroUserCircleSolid,
      heroBellSolid,
      heroMagnifyingGlassSolid,
      heroShieldCheckSolid
    })
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  // Inputs & Outputs
  userName = input<string>('SEFWEB');
  userRole = input<string>('ADMINISTRADOR');
  warehouseCode = input<string>('001');

  logout = output<void>();

  onLogout(): void {
    this.logout.emit();
  }
}
