export class WarehouseQueryDto {
  armazem?: string;
  linhaInicial?: string;
  linhaFinal?: string;
  boxInicial?: string;
  boxFinal?: string;
  nivelInicial?: string;
  nivelFinal?: string;
  situacao?: string;
  tipoEmbalagem?: string;
  quebrado?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
