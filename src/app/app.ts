import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroPlusSolid, 
  heroPencilSquareSolid, 
  heroTrashSolid, 
  heroPrinterSolid, 
  heroFunnelSolid,
  heroBuildingStorefrontSolid,
  heroTruckSolid,
  heroCheckCircleSolid
} from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIconComponent],
  providers: [
    provideIcons({
      heroPlusSolid,
      heroPencilSquareSolid,
      heroTrashSolid,
      heroPrinterSolid,
      heroFunnelSolid,
      heroBuildingStorefrontSolid,
      heroTruckSolid,
      heroCheckCircleSolid
    })
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('angular-enterprise-erp');
}
