
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { PatientService } from 'src/app/services/patient.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from "@auth0/angular-jwt";


const helper = new JwtHelperService();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide:boolean=true
  login:boolean=true
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  dataInToken:any={}
  token:any
  roles: string;
  constructor(
    private patientserv:PatientService,
    private toast:HotToastService,
    private router:Router,

    private toaster:ToastrService
  ) { }

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required ]),
    password:new FormControl('',[Validators.required]),
  });
  get username(){
    return this.loginForm.get('username');
  }
  get password(){
    return this.loginForm.get('password');
  }
  ngOnInit(): void {
    if (this.patientserv.getToken()) {
      this.isLoggedIn = true;
      // this.roles = this.patientserv.getUser().role;
    }
    this.router.navigate(['/login'],{queryParams:{login:this.login}})
     this.token=this.patientserv.getToken()
     const decodedToken = helper.decodeToken(this.token);
     const expirationDate = helper.getTokenExpirationDate(this.token);
     const isExpired = helper.isTokenExpired(this.token);
     console.log(isExpired);

     this.dataInToken= jwt_decode(this.token)
     console.log(this.dataInToken);

     console.log(this.token);

    if (this.patientserv.getToken()) {
      this.login = false;
      // this.roles = this.tokenStorage.getUser().roles;
    }
  }
  reloadPage(): void {
    window.location.reload();
  }

  mySubmit(){
    if (!this.loginForm.valid){
      return;
    }

    const {username , password} = this.loginForm.value;
    this.patientserv.login( this.loginForm.value).subscribe({next:(data)=>{
      console.log(data.body);

      this.patientserv.saveToken(data.body.token);
      this.patientserv.saveUser(data.body);
      this.token=this.patientserv.getToken()
      this.dataInToken= jwt_decode(this.token)
      this.patientserv.saveRole(this.dataInToken.role)
      this.roles = this.patientserv.getRole();
      console.log(this.roles);
      this.isLoggedIn=true
      setTimeout(() => {
        if(this.token!==''){

          this.patientserv.SendDataToComponent(this.token)
        }
        if(this.roles!==''){

          this.patientserv.SendRoleToComponent(this.roles)
        }
        if(this.roles ==='doctor'){
          this.router.navigate(['doctors/bookings'])
        }else{

          this.router.navigate(['nurse/add-patient'])
        }

      }, 2000)





    },error:(err)=>{
      console.log(err);
      if(err){
        this.toast.error(err.error.message)
      }
    }})



  }


}
