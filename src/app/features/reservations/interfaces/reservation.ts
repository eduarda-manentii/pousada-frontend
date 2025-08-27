import { Complement } from "../../complements/interfaces/complement";

export interface Reserva {
  id: number;
  quarto?: { nome: string };
  valorDaReserva: number;
  statusDaReserva: string;
  observacao?: string;
  checkIn: Date;
  checkOut: Date;
  cliente?: { nome: string };
  complementos?: Complement[];
}
