export interface Endereco {
  id: number,
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  numero: string;
  complemento?: string;
}
