import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth.service";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        console.log(this.authService.isAuthenticated())
        if (this.authService.isAuthenticated()) {
            return true;
        //     if(this.authService.isAdmin() )
                
        // }
        }else{
            this.router.navigate(['/auth/login']);
            return false;
        }

        return this.router.navigate(['/no-access']);
    }
}