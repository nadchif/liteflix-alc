import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class NeedAuthGuard implements CanActivate {
    constructor(private authservice: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {


        if ((localStorage.getItem('user'))) {
            return true;
        }
        this.router.navigate(['landing']);
        return false;
    }
}
