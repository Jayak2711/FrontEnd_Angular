import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl + "users"; 

  constructor(private http: HttpClient) { }

  getUser(userId: number): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<User>(url);
  }


  addNewAddress(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl + '/addAddress', user,{headers});
}

  updateUser(user: any): Observable<User> {
    const url = `${this.apiUrl}/${user.user_id}`;
    return this.http.put<User>(url, user);
  }

  updateAdrress(user: any): Observable<User> {
    console.log(user)
    const url = `${this.apiUrl + '/updateAdd'}/${user.user_id}`;
    return this.http.put<User>(url, user);
  }

  changePassword(userId: number, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}/change-password`;
    return this.http.put(url, { newPassword });
  }
}
