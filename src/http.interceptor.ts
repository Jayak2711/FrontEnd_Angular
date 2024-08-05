import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; // If using Angular Material for notifications

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {} // Inject MatSnackBar or any other notification service

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          // Handle 400 error here
          this.handleBadRequest(error);
        }
        // Rethrow the error if needed
        return throwError(() => error);
      })
    );
  }

  private handleBadRequest(error: HttpErrorResponse) {
    // Example of showing an error message
    this.snackBar.open('Bad Request: ' + (error.error.message || 'Please check your request'), 'Close', {
      duration: 5000,
    });

    // Additional handling logic can go here
  }
}
