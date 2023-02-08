import { HotToastService } from '@ngneat/hot-toast';
import { PatientService } from 'src/app/services/patient.service';
import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { Component, OnInit, AfterViewInit, Injectable } from '@angular/core';
import * as AOS from 'aos'
import jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit {
  isCollapsed = true;
  Admin:boolean=false
  doctor:boolean=false
  nurse:boolean=false
  islogin:boolean=false
  Role:any
  dataInToken: any={}
  token: any;
  clinicsData:any=[]
  constructor(

    private route:ActivatedRoute,
    private patientserv:PatientService,
    private router:Router,
    private toast:HotToastService,
    private toaster:ToastrService,
    private nzMessageService: NzMessageService,
    private notification: NzNotificationService
  ){}
  ngAfterViewInit(): void {
    // console.log(this.patientserv.getUser().role);
    if(window.location.pathname=="/login"){
      this.islogin=true
    }else{
      this.islogin=false
    }
    this.Role=this.patientserv.getUser().role
    this.token=this.patientserv.getUser().token
    const decodedToken = helper.decodeToken(this.token);
    const expirationDate = helper.getTokenExpirationDate(this.token);
    console.log(expirationDate?.toUTCString());
    // const date= Date.now()
    // console.log(date);

    // this.CanActive
    const isExpired = helper.isTokenExpired(this.token);
    console.log(isExpired);
    if(isExpired){
      this.patientserv.signOut()
      this.router.navigate(['login'])

      // window.location.reload()
    }
    console.log(this.token);
    this.dataInToken= jwt_decode(this.token)
    console.log(this.dataInToken);

    if(this.dataInToken.role=='doctor'){
      this.doctor=true
      this.nurse=false
      // this.router.navigate(['/doctors/bookings'])


    }else{
      this.nurse=true
      this.doctor=false
      // this.router.navigate(['/nurse/add-patient'])
    }
  }
  reloadPage(): void {
    window.location.reload();
  }
  ngOnInit(): void {
    console.log(window.location.pathname);
    if(window.location.pathname=="/login"){
      this.islogin=true
    }else{
      this.islogin=false
    }
    this.Role=this.patientserv.getRole()
    // console.log(this.Role);
    this.token=this.patientserv.getUser().token
    // console.log(this.token);
    this.patientserv.SendData.subscribe((token)=>{
      if(token!==''){
        // console.log(token);
        this.token=token
        const decodedToken = helper.decodeToken(this.token);
        const expirationDate = helper.getTokenExpirationDate(this.token);
        const isExpired = helper.isTokenExpired(this.token);
        // console.log(isExpired);
        if(isExpired){
          this.patientserv.signOut()
          this.router.navigate(['login'])

        }
        this.dataInToken= jwt_decode(this.token)
        // console.log(this.dataInToken);

      }else{
        this.token=this.patientserv.getUser().token
        this.dataInToken= jwt_decode(this.token)
        // console.log(this.dataInToken);
      }
    })
    this.patientserv.SendRole.subscribe((role)=>{
      this.Role=role
      // console.log(role);
      if(this.Role==='doctor'){
        this.doctor=true
        this.nurse=false
        // this.router.navigate(['/doctors/bookings'])

      }else{
        this.nurse=true
        this.doctor=false
        // this.router.navigate(['/nurse/add-patient'])
      }

    })



    AOS.init();
    // console.log(this.route.snapshot.params);
    this.route.queryParams.subscribe((data)=>{
      // console.log(data['signup']);
      if(data['signup'] =='true' || data['login'] =='true'){

        this.islogin=true
      }else{
        this.islogin=false
      }

    })

  }
  logout(){
    this.patientserv.signOut()
    this.router.navigate(['login'])
    this.confirm()
  }
  CanActive(state:RouterState){
    // console.log(state);


  }
  cancel(): void {
    this.nzMessageService.info('');
  }

  confirm(): void {
    this.nzMessageService.success('تم تسجيل الخروج بنجاح');
  }
}


