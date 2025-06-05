export interface Amenidade {
  icone: string;
  nome?: string;
}

export interface Quarto {
  id: number;
  nome: string;
  valorDiaria: number;
  capacidade: number;
  qtdCamaCasal?: number;
  qtdCamaSolteiro?: number;
  observacao?: string;
  amenidades: Amenidade[];
  fotos?: string[];
}