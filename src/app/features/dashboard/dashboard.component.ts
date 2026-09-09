import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonComponent,
  TextInputComponent,
  DataTableComponent,
  BadgeComponent,
  TableColumn
} from '../../shared/components';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    TextInputComponent,
    DataTableComponent,
    BadgeComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  readonly authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // Interactive demo states
  protected isButtonLoading = signal<boolean>(false);
  protected isTableLoading = signal<boolean>(false);
  protected selectedRow = signal<any | null>(null);

  // Form Demo
  protected demoForm: FormGroup = this.fb.group({
    codigoPosicao: ['', [Validators.required, Validators.minLength(3)]],
    descricaoMaterial: ['', [Validators.required]],
    pesoUnitario: ['', [Validators.required, Validators.min(1)]]
  });

  // Table Columns Configuration
  protected tableColumns: TableColumn[] = [
    { key: 'codigo', header: 'Código / Posição', width: '160px', mono: true, sortable: true },
    { key: 'linha', header: 'Linha', width: '90px', align: 'center', sortable: true },
    { key: 'box', header: 'Box', width: '90px', align: 'center', sortable: true },
    { key: 'nivel', header: 'Nível', width: '90px', align: 'center', sortable: true },
    { key: 'situacao', header: 'Situação', width: '140px', align: 'center', sortable: true },
    { key: 'embalagem', header: 'Embalagem', width: '130px' },
    { key: 'pesoMaximo', header: 'Capacidade (kg)', width: '150px', align: 'right', mono: true, sortable: true }
  ];

  // Table Sample Dataset
  protected tableData = signal<any[]>([
    { id: 1, codigo: '01-001-01', linha: '01', box: '001', nivel: '01', situacao: 'Ocupada', embalagem: 'Pallet PBR', pesoMaximo: '1.200,00' },
    { id: 2, codigo: '01-001-02', linha: '01', box: '001', nivel: '02', situacao: 'Reservada', embalagem: 'Pallet PBR', pesoMaximo: '1.200,00' },
    { id: 3, codigo: '01-002-01', linha: '01', box: '002', nivel: '01', situacao: 'Livre', embalagem: 'Gaiola Metálica', pesoMaximo: '800,00' },
    { id: 4, codigo: '02-005-03', linha: '02', box: '005', nivel: '03', situacao: 'Em Carga', embalagem: 'Rack Industrial', pesoMaximo: '1.500,00' },
    { id: 5, codigo: '03-010-01', linha: '03', box: '010', nivel: '01', situacao: 'Bloqueada', embalagem: 'Pallet PBR', pesoMaximo: '1.000,00' },
  ]);

  toggleButtonLoading(): void {
    this.isButtonLoading.update(v => !v);
  }

  toggleTableLoading(): void {
    this.isTableLoading.update(v => !v);
  }

  onRowClick(row: any): void {
    this.selectedRow.set(row);
  }

  onSortChange(event: { key: string; direction: 'asc' | 'desc' }): void {
    const sorted = [...this.tableData()].sort((a, b) => {
      const valA = a[event.key];
      const valB = b[event.key];
      if (event.direction === 'asc') {
        return valA > valB ? 1 : -1;
      }
      return valA < valB ? 1 : -1;
    });
    this.tableData.set(sorted);
  }

  onSubmitForm(): void {
    if (this.demoForm.invalid) {
      this.demoForm.markAllAsTouched();
      return;
    }
    alert('Formulário Válido: ' + JSON.stringify(this.demoForm.value));
  }
}
