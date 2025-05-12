import { Endereco } from "./endereco";

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  celular: string;
  dataDeNascimento: string;
  sexo: string;
  endereco: Endereco;
}
