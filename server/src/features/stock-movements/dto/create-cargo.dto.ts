export class CreateCargoDto {
  codigoCarga!: string;
  clienteFornecedor!: string;
  codigoSap!: string;
  pagamentoAntecipado?: boolean;
  numeroVolumes?: number;
  numeroSuportes?: number;
  pesoComercial?: number;
  pesoBruto?: number;
  pesoLiquido?: number;
  observacao?: string;
  materiais?: Array<{
    material: string;
    qualidadeQi: string;
    solicitadoKg: number;
    comercialKg: number;
    liquidoKg: number;
    brutoKg: number;
    volumes: number;
    suportes: number;
    observacao?: string;
  }>;
  paletes?: Array<{
    palete: string;
    armazemLocal: string;
    comercialKg: number;
    liquidoKg: number;
    brutoKg: number;
    volumes: number;
    suportes: number;
  }>;
  caixas?: Array<{
    caixa: string;
    suportes: number;
    comercialKg: number;
    liquidoKg: number;
    brutoKg: number;
  }>;
}
