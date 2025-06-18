export class ApiError extends Error {
  mensagem: string;

  constructor(mensagem: string) {
    super(mensagem);
    this.mensagem = mensagem;
    this.name = '';
  }
}
