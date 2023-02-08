import { HotToastService } from '@ngneat/hot-toast'
import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { Examination, Patient } from 'src/app/models/Patient'
import { PatientService } from 'src/app/services/patient.service'
import { Subscription, interval } from 'rxjs'
import * as saveAs from 'file-saver'

@Component({
  selector: 'app-showbooking',
  templateUrl: './showbooking.component.html',
  styleUrls: ['./showbooking.component.css'],
})
export class ShowbookingComponent implements OnInit, AfterViewInit {
  // @Input() public showbooking:any
  subscribe: Subscription
  patients$: any
  patient: Patient
  sucsses: boolean = false
  showbookingForm: any = {}
  successAdd: boolean = true
  value: boolean = false
  register: boolean = false
  registerPatient: boolean
  patientId: any
  code: any
  interv: any
  regist: any
  downloadfile:any
  Token: string | null

  constructor(
    public dialog: MatDialog,
    private patientserv: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService,
  ) {}
  ngAfterViewInit(): void {
    this.register = false

    this.route.queryParams.subscribe((parms: any) => {
      if (parms.data == 'false') {
        this.register = false
        console.log(this.register)
      } else {
        this.register = true
        console.log(this.register)
      }

      console.log(this.register)

      console.log(typeof parms.data)
    })

    // throw new Error('Method not implemented.');
    // this.route.queryParams.subscribe((parms:any)=>{
    //   this.register=parms.data
    //   console.log(parms.data);

    // })
  }

  ngOnInit(): void {
    //  this.patientserv.getPatient().subscribe(response => {
    //   console.log(response);
    //   this.patients$= response
    //  })

    // this.route.queryParams.subscribe((parms:any)=>{
    //   this.register=parms.data
    //   console.log(parms.data);
    // })

    //  this.patientserv.getCode().subscribe((code$)=>{
    //     this.code=code$.code
    //  })

    this.patientserv.SendData.subscribe({
      next: (data: any) => {
        console.log(data)
        // console.log(data.name);
        this.showbookingForm = data
        console.log(this.showbookingForm)
      },
    })
    this.patientserv.SendId.subscribe((dataId) => {
      this.patientId = dataId
      console.log(dataId)
    })
    // this.route.queryParams.subscribe((params:any)=>{
    //   console.log(params.data);
    //   this.showbookingForm = JSON.parse( params.data)
    // })
  }
  addExamin(id: any, patient: any) {
    console.log('Examin Added')
    // console.log(id);
    // console.log(patient);
    this.Token= window.localStorage.getItem('auth-token')
    console.log(this.Token);
    if(this.patientserv.isTokenExpired(this.Token)){
      this.patientserv.signOut()
    }else{

   
    this.patientserv
      .addExamination(id, patient)
      .pipe(
        this.toast.observe({
          success: 'تم اضافة الكشف بنجاح',
          loading: 'Logging in...',
          error: ({ message }) => `${message}`,
        }),
      )
      .subscribe({
        next: (response) => {
          console.log(response.new_examination)
          this.patientserv.downloadFile(this.patientId,response.new_examination.examination_id).pipe(
            this.toast.observe({
              success: 'تم التحميل  بنجاح',
              loading: 'Logging in...',
              error: ({ message }) => `${message}`,
            }),

          ).subscribe((file)=>{
            console.log(file);
              saveAs(file, 'download.txt');
            
          })
          this.sucsses = true
          setTimeout(() => {
            this.router.navigate(['nurse/add-patient'], {
              queryParams: { data: this.successAdd },
            })
            this.patientserv.SendDataToComponent(
              (this.showbookingForm.value = ''),
            )
          }, 1000)
        },
        error: (err) => console.log(err),
      })
    }
    // setTimeout(() => {
    //   clearInterval(this.regist)
    // }, 1000)
  }

  sendToAddPatient() {
    console.log(this.showbookingForm)
    this.patientserv.SendDataToComponent(this.showbookingForm)
    // this.router.navigate(['nurse/add-patient'])
    this.router.navigate(['nurse/add-patient'], {
      queryParams: { data: this.register },
    })
  }


  addPatientAndExamin() {
    console.log('patient Added')
    this.Token= window.localStorage.getItem('auth-token')
    console.log(this.Token);
    if(this.patientserv.isTokenExpired(this.Token)){
      this.patientserv.signOut()
    }else{

      this.patientserv
        .addPatient(this.showbookingForm)
        .pipe(
          this.toast.observe({
            success: 'تم اضافة الكشف بنجاح',
            loading: 'Logging in...',
            error: ({ message }) => `${message}`,
          }),
        )
        .subscribe({
          next: (response) => {
            console.log(response)
            
            this.downloadfile=response
  
            console.log(this.downloadfile);
            
            this.patientserv.downloadFile(response.patient_id,response.examination_id).pipe(
              this.toast.observe({
                success: 'تم التحميل  بنجاح',
                loading: 'Logging in...',
                error: ({ message }) => `${message}`,
              }),
  
            ).subscribe((file)=>{
              console.log(file);
                saveAs(file, 'download.txt');
              
            })
            this.sucsses = true
  
            setTimeout(() => {
              this.router.navigate(['nurse/add-patient'], {
                queryParams: { data: this.value },
              })
              this.patientserv.SendDataToComponent(
                (this.showbookingForm.value = ''),
              )
            }, 1000)
          },
  
          error: (err) => {
            
            console.log(err.error.message)
            if(err.error.message){
              this.toast.error(err.error.message)
            }
          }
  
        })

    }  

    //  this.router.navigate(['nurse/add-patient'])
  }

  sendToRegisterPatient() {
    console.log(this.showbookingForm)
    this.patientserv.SendIdToComponent(this.patientId)
    this.patientserv.SendDataToComponent(this.showbookingForm)
    this.router.navigate(['nurse/add-patient'], { queryParams: { data: true } })
  }
  downLoadFile(data: any, type: string) {
  
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }}
}
