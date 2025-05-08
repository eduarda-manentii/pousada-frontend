import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8081/clientes';
  private STORAGE_KEY = 'customers';
  private useLocal = false;

  constructor(private http: HttpClient) {}

  createCustomer(customer: any): Observable<any> {
    if (this.useLocal) {
      const customers = this.getCustomersSync();
      customers.push(customer);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customers));
      return of(customer);
    } else {
      return this.http.post<any>(this.apiUrl, customer);
    }
  }

  getCustomers(): Observable<any[]> {
    if (this.useLocal) {
      const customers = this.getCustomersSync();
      return of(customers);
    } else {
      return this.http.get<any[]>(this.apiUrl);
    }
  }

  private getCustomersSync(): any[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  
}
