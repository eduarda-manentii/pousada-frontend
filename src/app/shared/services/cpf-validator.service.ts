import { Injectable } from '@angular/core';

import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CpfValidatorService {
  
  static validar(control: AbstractControl): ValidationErrors | null {
    const cpf = CpfValidatorService.removerNaoNumericos(control.value);

    if (!CpfValidatorService.verificarComprimento(cpf)) return { cpfInvalido: true };
    if (CpfValidatorService.ehCpfGenerico(cpf)) return { cpfInvalido: true };
    if (!CpfValidatorService.validarPrimeiroDigito(cpf)) return { cpfInvalido: true };
    if (!CpfValidatorService.validarSegundoDigito(cpf)) return { cpfInvalido: true };

    return null;
  }

  private static removerNaoNumericos(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  private static verificarComprimento(cpf: string): boolean {
    return cpf.length === 11;
  }

  private static ehCpfGenerico(cpf: string): boolean {
    return /^(\d)\1{10}$/.test(cpf);
  }

  private static validarPrimeiroDigito(cpf: string): boolean {
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += +cpf[i] * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === +cpf[9];
  }

  private static validarSegundoDigito(cpf: string): boolean {
    let soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += +cpf[i] * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === +cpf[10];
  }

}
