export class CreatePositionDto {
  armazem!: string;
  linha!: string;
  box!: string;
  nivel!: string;
  situacao!: 'Ocupada' | 'Reservada' | 'Livre' | 'Bloqueada' | 'Em Carga';
  quantidadeCaixas?: number;
  tipoEmbalagem?: 'Rolete' | 'Container' | 'Palletizado' | 'Cabo' | 'Beam' | 'Caixa';
  sequencia?: string;
  quebrado?: boolean;
  pesoMaximoKg!: number;
  pesoAtualKg?: number;
}
