export class UpdatePositionDto {
  situacao?: 'Ocupada' | 'Reservada' | 'Livre' | 'Bloqueada' | 'Em Carga';
  quantidadeCaixas?: number;
  tipoEmbalagem?: 'Rolete' | 'Container' | 'Palletizado' | 'Cabo' | 'Beam' | 'Caixa';
  sequencia?: string;
  quebrado?: boolean;
  pesoMaximoKg?: number;
  pesoAtualKg?: number;
}
