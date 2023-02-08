import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PatientService } from '../services/patient.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(
    private patientserv:PatientService,
    private router:Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      const token = this.patientserv.getToken()
      const requiresLogin = route.data['requiresLogin'] || false;
      if (this.patientserv.isTokenExpired(token)) {
        // logged in so return true
        this.patientserv.signOut()
        this.router.navigate(['login'])
        
      }
    return true;
  }
  
}
