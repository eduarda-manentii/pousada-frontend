import { Amenidade } from "../../amenities/interfaces/amenity";

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