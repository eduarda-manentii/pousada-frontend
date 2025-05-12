import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Page<T> {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  create(endpoint: string, object: any): Observable<any> {
    return this.http.post<any>(endpoint, object);
  }

  get<T>(endpoint: string, params: any = {}): Observable<Page<T>> {
    return this.http.get<Page<T>>(endpoint, { params });
  }

  put(endpoint: string, object: any): Observable<any> {
    return this.http.put<any>(endpoint, object);
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete<any>(endpoint);
  }

  getById<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(endpoint);
  }

}
