import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = 'http://localhost:8081/enderecos';
   private STORAGE_KEY = 'locations';
   private useLocal = false;
 
   constructor(private http: HttpClient) {}
 
   createLocation(location: any): Observable<any> {
     if (this.useLocal) {
       const locations = this.getLocationsSync();
       locations.push(location);
       localStorage.setItem(this.STORAGE_KEY, JSON.stringify(locations));
       return of(location);
     } else {
       return this.http.post<any>(this.apiUrl, location);
     }
   }  
 
   getLocations(): Observable<any[]> {
     if (this.useLocal) {
       const lcoations = this.getLocationsSync();
       return of(lcoations);
     } else {
       return this.http.get<any[]>(this.apiUrl);
     }
   }
 
   private getLocationsSync(): any[] {
     const data = localStorage.getItem(this.STORAGE_KEY);
     return data ? JSON.parse(data) : [];
   }

}
