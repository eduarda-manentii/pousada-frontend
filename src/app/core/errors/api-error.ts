export class ApiError extends Error {
  codigo: number;
  mensagem: string;

  constructor(codigo: number, mensagem: string) {
    super(mensagem);
    this.codigo = codigo;
    this.mensagem = mensagem;
    this.name = 'ApiError';
  }
}