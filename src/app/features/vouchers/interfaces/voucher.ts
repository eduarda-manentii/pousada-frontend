import { Status } from "../../../shared/interfaces/status";

export interface Voucher {
  id: number,
  codigo: string,
  nome: string,
  dataDeInicio: Date,
  dataDeVencimento: Date,
  porcentagemDeDesconto: number,
  status: Status,
  quantidadeMaximaDeUso: number,
}
