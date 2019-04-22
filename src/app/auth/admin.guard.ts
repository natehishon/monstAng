import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAdmin = this.authService.getIsAdmin();
    if (!isAdmin) {
      this.router.navigate(['']);
    }
    return isAdmin;
  }

}
