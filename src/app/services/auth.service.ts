import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { User } from "../models/user.model";
import { Observable, retryWhen, throwError } from "rxjs";
import { catchError } from "rxjs";

@Injectable()
export class AuthService {
    private apiUrl = environment.apiUrl;
    private apiUrlJava = environment.apiUrl1;

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

    login(user: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.apiUrl + 'userLogin', user,{headers});
    }

    forgetPassword(user: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.apiUrl + 'userLogin', user,{headers});
    }

    register(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrlJava + 'users/register', user).pipe();
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error("An error occured", error.message);
        } else {
            console.error(`Backend returned code ${error.status} body was: ${error.message}`);
        }

        return throwError('Something bad happened. please try again later');
    }
}