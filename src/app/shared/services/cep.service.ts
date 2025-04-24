import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly baseUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  searchCep(cep: string): Observable<any> {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return throwError(() => new Error('CEP inválido'));

    return this.http.get(`${this.baseUrl}/${cleanCep}/json`).pipe(
      catchError(err => {
        console.error('Erro ao buscar CEP', err);
        return throwError(() => err);
      })
    );
  }
}
