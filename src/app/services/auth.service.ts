import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs";

@Injectable()
export class AuthService {
    private apiUrl = environment.apiUrl;
    private apiUrlJava = environment.apiUrl1;
    userDetails: any ;

    constructor(private http: HttpClient) {

    }
    
    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getCurrentUser(): User {
        const userJson = sessionStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : '';
  
    }

    isAdmin(): boolean {
        const userJson : any = sessionStorage.getItem('currentUser');
        if (userJson) {
            const currentUser: any = JSON.parse(userJson);
            return currentUser.is_admin;
        }

        return false;
    }


    //homework
    isAuthenticated(): boolean {
        return !!sessionStorage.getItem("currentUser");
    }

    logout(): void {
        sessionStorage.removeItem('currentUser');
    }

    // login(email: string, password: string): Observable<User> {
    //     return new Observable(observer => {
    //         this.http.get<User[]>(`${this.apiUrl}?email=${email}`).subscribe(users => {
    //             const user = users.find(u => u.email === email && u.password === password);
    //             if (user) {
    //                 //sessionStorage
    //                 user.password = "";
    //                 sessionStorage.setItem('currentUser', JSON.stringify(user));
    //                 observer.next(user);
    //                 observer.complete();
    //             } else {
    //                 observer.error(new Error("Invalid Credentials"));
    //             }
    //         })
    //     });
    // }
    userPersonalDetails(userId: any): Observable<any> {
        const url = `${this.apiUrl  + 'users'}/${userId}`;
        return this.http.get<any>(url);
    }

    login(user: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.apiUrl + 'userLogin', user,{headers});
    }

    forgetPassword(user: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.apiUrl + 'forgetPassword', user,{headers});
    }

    changePassword(user: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<any>(this.apiUrl + 'changePassword', user,{headers});
    }

    register(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrlJava + 'users/register', user).pipe(catchError(this.handleError));
    }

    // private handleError(error: HttpErrorResponse) {
    //     if (error.error instanceof ErrorEvent) {
    //         console.error("An error occured", error.message);
    //     } else {
    //         console.error(`Backend returned code ${error.status} body was: ${error.message}`);
    //     }

    //     return throwError('Something bad happened. please try again later');
    // }


     // Centralized error handling method
     private handleError(error: HttpErrorResponse) {
        // Handle the error in a centralized way
        let errorMessage = 'An unknown error occurred!';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side or network error occurred
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Backend returned an unsuccessful response code
          errorMessage = `Error ${error.status}: ${error.message}`;
        }
        
        // Log error to console or remote logging infrastructure
        console.error(errorMessage);
    
        // Return an observable with a user-facing error message
        return throwError(() => new Error(errorMessage));
      }

}