import { Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';


const helper = new JwtHelperService();
const TOKEN_HEADER_KEY = 'x-access-token'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private token: PatientService,
    private patientserv:PatientService,
    private router:Router
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Hi Iam Ahmed');
    // console.log(req);


    let authReq = req;
    const token = this.token.getToken();
    // console.log(token);
    // const isExpired = helper.isTokenExpired(token);
    // console.log(isExpired);
    // if(isExpired){
    //   this.patientserv.signOut()
    //   this.router.navigate(['login'])
    //   // window.location.reload()
    // }

    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY , token) });
      // console.log(req);

    }else{
      // console.log(req);

    }
    return next.handle(authReq);
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
