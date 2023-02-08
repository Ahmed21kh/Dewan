import { Patient, Examination } from 'src/app/models/Patient'
import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { HttpClient } from '@angular/common/http'
import { PatientService } from 'src/app/services/patient.service'
import { HotToastService } from '@ngneat/hot-toast'
import { ActivatedRoute, Router } from '@angular/router'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import 'moment/locale/ja';
import 'moment/locale/fr';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import { JwtHelperService } from '@auth0/angular-jwt'
import {nameValidator, forwardByValidator } from 'src/app/validators/namevalidator'

const helper = new JwtHelperService();
@Component({
  selector: 'app-reservation-request',
  templateUrl: './reservation-request.component.html',
  styleUrls: ['./reservation-request.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'fr'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ReservationRequestComponent implements OnInit, AfterViewInit {


  resiveData: any = {}
  selected = ''
  registered: boolean
  Token:any
  data: boolean
  filteredData$:any=[]
  nameOfPatient:any

  PatientData: any = {}
  public dialog: MatDialog
  patientName: any = []
  patientTd:any
  selectedValue:any

  patient$: Patient
  registerdPatient: any = {}
  code$: any
  isEdit: boolean = false
  patientId: any
  patientNum: any
  DateExamin:any

  year=  new Date().getFullYear()
  month=  new Date().getMonth()+1
  day=  new Date().getDate()
  newDate:any= new Date()


   newFilterDate:any=new Date()

  public bookingForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl(''),
    phone_number: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.pattern('[0-9]*')
    ]),
    examination_type: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required,Validators.pattern('[0-9]*')]),
    date: new FormControl('', Validators.required),
    number: new FormControl(''),
    age: new FormControl('', [Validators.required,Validators.pattern('[0-9]*')]),
    forward_by: new FormControl(''),
  },{
    validators:[nameValidator('name'),forwardByValidator('forward_by')]
 })
  public registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    phone_number: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
    ]),
    examination_type: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    number: new FormControl(''),
    age: new FormControl('', Validators.required),
    forward_by: new FormControl(''),
  })

  bookinginfo = this.bookingForm.value

  get f() {
    return this.bookingForm.controls
  }
  get r(){
    return this.registerForm.controls}

  get name() {
    return this.bookingForm.get('name'),this.registerForm.get('name')
  }
  get code() {
    return this.bookingForm.get('code')
  }
  get phone_number() {
    return this.bookingForm.get('phone_number')
  }
  get examination_type() {
    return this.bookingForm.get('examination_type')
  }
  get price() {
    return this.bookingForm.get('price')
  }
  get date() {
    return this.bookingForm.get('date')
  }
  get number() {
    return this.bookingForm.get('number')
  }
  get age() {
    return this.bookingForm.get('age')
  }
  get forward_by() {
    return this.bookingForm.get('forward_by')
  }


  constructor(
    private http: HttpClient,
    private patientserv: PatientService,
    private toast: HotToastService,
    private router: Router,
    private route: ActivatedRoute,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    ) {}
    @Input() pattern: string | RegExp

    ngAfterViewInit(): void {
      var year=  new Date().getFullYear()
      var month=  new Date().getMonth()+1
      var day=  new Date().getDate()
      var newDate:any= new Date()


      this.route.queryParams.subscribe((parms:any)=>{
       console.log(parms.data);
       if(parms.data=='false'){
         this.registered=false
         this.bookingForm.patchValue({
           code: this.patientId,
           name: null,
           phone_number: null,
           examination_type: null,
           price: null,
           date:newDate,
           number: this.patientNum,
           age: null,
           forward_by: null,
         })
         this.patientserv.SendData.subscribe((data) => {
           this.resiveData = data
           this.bookingForm.patchValue({
             code:this.resiveData.code,
             name: this.resiveData.name,
             phone_number: this.resiveData.phone_number,
             age: this.resiveData.age,
             forward_by: this.resiveData.forward_by,
             date: this.resiveData.date,
             number: this.resiveData.number,
             price: this.resiveData.price,
           })
           console.log(data)
           console.log(this.resiveData.name)
         })
         console.log(this.bookingForm.value);

       }else if(parms.data=='true'){
         this.registered=true
         this.patientserv.SendId.subscribe((id)=>{
           this.patientTd=id
           console.log(id);

         })
         this.registerForm.patchValue({
           code:this.patientId,
           name: null,
           phone_number: null,
           examination_type: null,
           price: null,
           date:newDate,
           number: this.patientNum,
           age: null,
           forward_by: null,
         })
         this.patientserv.SendData.subscribe((data) => {
           this.resiveData = data
           this.registerForm.patchValue({
             code:this.resiveData.code,
             name: this.resiveData.name,
             phone_number: this.resiveData.phone_number,
             age: this.resiveData.age,
             forward_by: this.resiveData.forward_by,
             date: this.resiveData.date,
             number: this.resiveData.number,
             price: this.resiveData.price,
             examination_type:this.resiveData.examination_type,
           })

           console.log(data)
           console.log(this.resiveData.name)
         })
         console.log(this.bookingForm.value);

       }else {
         this.bookingForm.value.date=newDate

         console.log(this.bookingForm.value);

         this.registered=false
       }
       this.patientserv.getNumber().subscribe((num: any) => {
         this.patientNum = num.examinationNumber
         console.log( this.patientNum)
         this.bookingForm.patchValue({
          number:this.patientNum,
          date:newDate
         })
       })
       this.patientserv.getCode().subscribe((id: any) => {
         this.patientId = id.code
         console.log(this.patientId)
       })
       // console.log(this.patientId);
       // this.bookingForm.value.date=newDate
       // this.bookingForm.setValue({
       //   date: newDate,
       //   code: this.patientId,
       //   number: this.patientNum,
       //   name: null,
       //   phone_number: null,
       //   examination_type: null,
       //   price: null,
       //   age: null,
       //   forward_by: null
       // })
       // else{
       //   this.registered=false

       // }

     })




     // this.bookingForm.setValue({
     //   date:newDate,
     //   name: null,
     //   code: null,
     //   phone_number: null,
     //   examination_type: null,
     //   price: null,
     //   number: null,
     //   age: null,
     //   forward_by: null
     // })
     // this.bookingForm.value.code = this.patientId

     // this.bookingForm.setValue({
     //   code:this.patientId,
     //   name: null,
     //   phone_number: null,
     //   examination_type: null,
     //   price: null,
     //   date: null,
     //   number: this.patientNum,
     //   age: null,
     //   forward_by: null,
     // })
     console.log(this.bookingForm.value);
   }

   ngOnInit(): void {

     var newDate:any= new Date()
     // this.route.queryParams.subscribe((params: any) => {
       //   this.registered = params.data
       //   console.log(params.data)
       // })
       // this.patientserv.getPatient().subscribe((data:any)=>{
         //   this.registerdPatient=data['Patient_Table']
         // })

         this.patientserv.getNumber().subscribe((num: any) => {
           this.patientNum = num.examinationNumber
           console.log(this.patientId)
           this.bookingForm.value.number=this.patientNum
         })

         this.patientserv.getCode().subscribe((id: any) => {
           this.patientId = id.code
           this.bookingForm.value.code = this.patientId
           console.log(this.patientId)
         })

         this.bookingForm.patchValue({
           code:this.patientId,
           name: null,
           phone_number: null,
           examination_type: null,
           price: null,
           date:newDate,
           number: this.patientNum,
           age: null,
           forward_by: null,
         })
         this.patientserv.getPatientName().subscribe({
           next: (res: any) => {
             this.filteredData$= this.patientName = res['patients_names']
             console.log(this.patientName)
         //  console.log(this.patientName!.id);
       },
     })
     // this.bookingForm.patchValue({
     //   code: this.patientId,
     //   name: null,
     //   phone_number: null,
     //   examination_type: null,
     //   price: null,
     //   date: this.newDate,
     //   number: this.patientNum,
     //   age: null,
     //   forward_by: null,
     // })
     // var year=  new Date().getFullYear()
     // var month=  new Date().getMonth()+1
     // var day=  new Date().getDate()
     // var newDate= `${year}-${month}-${day}`
   }

  mySubmit() {
    console.log('this is new ');

    console.log(this.bookingForm.value)
    if(this.bookingForm.valid){

      this.patientserv.SendDataToComponent(this.bookingForm.value)
      this.router.navigate(['nurse/showbooking'],{queryParams:{data:this.registered}})
    }
  }


  submit(id:any){
    console.log('this is registeredPatient');
    console.log(id);
    if(this.registerForm.valid){
      this.patientserv.SendIdToComponent(id)
    this.patientserv.SendDataToComponent(this.registerForm.value)
    this.router.navigate(['nurse/showbooking'],{queryParams:{data:true}})
    }
  }


  getCode() {
    var year=  new Date().getFullYear()
    var month=  new Date().getMonth()+1
    var day=  new Date().getDate()
    var newDate:any= new Date()

    this.patientserv.getNumber().subscribe((num: any) => {
      this.patientNum = num.examinationNumber
      console.log(this.patientNum)
    })
    // this.router.navigate(['nurse/add-patient'],{queryParams:{data:false}})


    this.bookingForm.value.code = this.patientId
    this.registered = false
    // console.log(this.patientId)

    this.patientserv.getCode().subscribe((res) => {
      this.code$ = res.code
      this.bookingForm.setValue({
        code: res.code,
        name: null,
        phone_number: null,
        examination_type: null,
        price: null,
        date: newDate,
        number: this.patientNum,
        age: null,
        forward_by: null,
      })
      // console.log(this.bookingForm.value.code)
    })
  }


  isRegistered() {
    this.registered = true
    var year=  new Date().getFullYear()
    var month=  new Date().getMonth()+1
    var day=  new Date().getDate()
    var newDate:any=new Date()

      this.patientserv.getNumber().subscribe((num: any) => {
        this.patientNum = num.examinationNumber
        console.log(this.patientNum)
        this.registerForm.setValue({
          code: null,
          name: null,
          phone_number: null,
          examination_type: null,
          price: null,
          date: newDate,
          number: this.patientNum,
          age: null,
          forward_by: null,
        })
        console.log(this.registerForm.value);

      })


  }

  getregisterdPatient(PatientId: number) {
    console.log(PatientId);
    this.Token= window.localStorage.getItem('auth-token')
    console.log(this.Token);
    if(this.patientserv.isTokenExpired(this.Token)){
      this.patientserv.signOut()
    }else{
      this.patientserv.getOnePatient(PatientId).subscribe({next:(patient: any) => {


        this.PatientData = patient
        this.patientTd =this.PatientData.id
        this.nameOfPatient=patient.name
        console.log(patient.code);

        this.registerForm.setValue({
          name: patient.name,
          code: patient.code,
          phone_number: patient.phone_number,
          age: patient.age,
          forward_by: null,
          examination_type: null,
          price: null,
          date: this.newDate,
          number: this.patientNum,
        })

      // console.log(this.bookingForm.value)

      // console.log(PatientId)
      // console.log(patient)
  },error:(err)=>{
    console.log(err.error.message)

    if(err.error.message){
      this.toast.error(err.error.message)
    }else{
      this.toast.error(err.error)
    }
  }})
    }

  }
  // onClick(){
  //   this.patientserv.SendDataToComponent(this.bookingForm.value)
  //   this.router.navigate(['nurse/showbooking'],{queryParams:{data:this.data=false}})
  // }
  filterName(queryString:any ){
    if(queryString){
      this.filteredData$ =
      this.patientName.filter((p:any)=>p.name.toLowerCase().includes(queryString.toLowerCase()))
    }else{
      this.filteredData$ = this.patientName;
    }
  }

}
