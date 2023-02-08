import { HotToastService } from '@ngneat/hot-toast';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, AfterViewInit, OnDestroy, PipeTransform } from '@angular/core';
import { Patient } from 'src/app/models/Patient';
import { PatientService } from 'src/app/services/patient.service';
import { interval, Subscription, timer } from 'rxjs';
import { AlertService } from 'ngx-alerts';
import * as moment from 'moment';

@Component({
  selector: 'app-record-bookings',
  templateUrl: './record-bookings.component.html',
  styleUrls: ['./record-bookings.component.css']
})
export class RecordBookingsComponent implements OnInit , AfterViewInit , OnDestroy {
  size: 'large' | 'small' | 'default' = 'large';
  paid:number=0
  MaxPayment:number=Number.MAX_VALUE
  public loading:boolean =false
  patients$: any[]=[]
  filteredData$: any=[]
  subscribe:Subscription
  selected=''
  selectedValue:any=''
  Examination:any={}
  ExaminationPatient:any={}
  isVisible = false;
  isdeleted=false
  isEdit= false
  patient$:any={}
  Date:any
  patient:Patient
  public errorMessage:string|null =null;
  PatientData: any;
  updatedValue:any
  interv:any
  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  examinationtype:any=[]
  typeSelected:string=''
  typeExamin:any={}
  Name:any
  PatientPayment:any={}
  count:number
  Code:number
  paymentSuccess:boolean=false
  positiveValue:number

   year=  new Date().getFullYear()
   month=  new Date().getMonth()+1
  day=  new Date().getDate()
  newDate= `${this.year}-${this.month}-${this.day}`
  newFilterDate:any
  Token: string | null;
  
  constructor(
    private patientserv:PatientService,
    private route:ActivatedRoute,
    private router:Router,
    private toast:HotToastService,
    private alert: AlertService
  ) { 
    this.minDate.setDate(this.minDate.getDate() - 1);
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.bsValue, this.maxDate];
  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    
    
  }
  
  ngOnInit(): void {
    // let Max = Number.MAX_VALUE
    // Max=this.Examination.price
    this.MaxPayment=this.Examination.price
    this.paid <= this.Examination.price

    this.count=this.Examination.price-this.paid
    // this.patientserv.getExaminationType().subscribe(type=>{
    //   this.examinationtype=type
    //   this.typeExamin=type
      
      
    // })
    this.loading =true
    this.patientserv.getPatient().subscribe({
    next:(data: any)=>{
      if(this.typeSelected==''){
        this.filteredData$=this.patient$ = data["Examination_records"]
        // this.Name=data.Examination_records
        // for (let index = 0; index <  this.filteredData$.length; index++) {
        //   const element =  this.filteredData$[index];
        //   this.Name=element.name
        //   console.log(this.Name);
          
        // }
        
      }
      this.loading=false
      // console.log(data.hasOwnProperty("Patient_Table"));
      
      
    }, error: (error)=>{
    this.errorMessage =error;
    this.loading = false
  }
})


}

showEditModal(patientId:any,examinationId:any): void {
  console.log(patientId);
  this.Token= window.localStorage.getItem('auth-token')
  console.log(this.Token);
  if(this.patientserv.isTokenExpired(this.Token)){
    // this.alert.danger('انتهت جلستك برجاء تسجيل الدخول !!')
    this.toast.error('انتهت جلستك برجاء تسجيل الدخول !!')
    this.patientserv.signOut()
  }else{
      this.isEdit = true;
      this.isdeleted=false
    
    this.patientserv.getExamination(patientId,examinationId).subscribe({
      next:(data:any)=>{
        this.Examination = data.patient
        console.log( this.Examination );
        
        var year=  new Date(data.patient.date).getFullYear();
        var month=  new Date(data.patient.date).getMonth()+1;
        var day=  new Date(data.patient.date).getDate();
        const newDate= `${year}-${month}-${day}`
        this.Examination.date=moment(this.Examination.date).format('YYYY-MM-DD')
        console.log(data);
        
        this.Date=this.Examination.date
        console.log(this.Date);
        
        this.loading=false
        // console.log(data.hasOwnProperty("Patient_Table"));
        console.log( this.Examination.date);
        
     }, error: (error)=>{
      this.errorMessage =error;
      this.loading = false
    }
    })
  }
  }
  showPaymentModal(patientId:any,examinId:any): void {
    this.Token= window.localStorage.getItem('auth-token')
    console.log(this.Token);
    if(this.patientserv.isTokenExpired(this.Token)){
      this.alert.danger('انتهت جلستك برجاء تسجيل الدخول !!')
      this.toast.error('انتهت جلستك برجاء تسجيل الدخول !!')
      this.patientserv.signOut()
    }else{
    this.MaxPayment=this.Examination.price
    this.paymentSuccess=false
    this.isVisible = true;
    this.paid=this.paid
    this.patientserv.getNewPayment(patientId,examinId).subscribe(data=>{
      const year=  new Date(data.examinationDate).getFullYear()
      const month=  new Date(data.examinationDate).getMonth()+1
      const day=  new Date(data.examinationDate).getDate()
      const newDate= `${year}-${month}-${day}`
      data.examinationDate= newDate
      this.paid=data.paid
      console.log(this.paid);

      this.PatientPayment=data 
      this.count=Math.abs(this.PatientPayment.examinationPrice-this.paid)
      
    
      console.log( this.PatientPayment.patient_id);
      
    })
  }
  }
  
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.isEdit = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.isEdit = false;
  }
  forDelete(){
    this.isdeleted = ! this.isdeleted
  }

  filterName(queryString:string){

  // this.patientserv.getNameByParams(name,code).subscribe(data=>{
  //   if(name){
  //     name=data.Examination_records.name
  //     this.filteredData$=data.Examination_records
  //     console.log(data.Examination_records);
  //   }
  //   else{
  //     console.log(this.patient$);
      
  //     this.filteredData$=this.patient$
  //   }      
  // })
  //   this.patientserv.getPatient().subscribe({
  //     next:(data: any)=>{
  //      this.patient$ = data["Examination_records"]
  //       this.loading=false
  //       // console.log(data.hasOwnProperty("Patient_Table"));
        if(queryString){
          this.filteredData$ =
          this.patient$.filter((p:any)=>p.name.toLowerCase().includes(queryString.toLocaleLowerCase())) 
        }else{
          this.filteredData$ = this.patient$;
        }
        
  //     }, error: (error)=>{
  //     this.errorMessage =error;
  //     this.loading = false
  //   }
  // })
 
  }
  filter(event:any){
  //   console.log(event);
  //   let charCode = (event.which)?event.which:event.keyCode
  //   console.log(charCode);
  //  if(isNaN(this.Name)){
  //   // this.Name.toString()
  //   console.log(this.Name);
    
  //   console.log('غير رقم');
    
  //  }else{

  //    if((48 <= charCode &&charCode <= 57) || (charCode === 8 && this.Name!=='')){
       
  //     this.Name= parseFloat(this.Name)
      
      
  //     console.log(this.Name);
      
  //     // if(charCode === 8){
  //     //   this.Name=this.Name
  //     //   console.log( this.Name);
        
  //     //   console.log(event.key);
        
  //     // }
      
  //   }else{
      
  //     this.Name=this.Name
  //   }
  // }
    
    // this.Name=parseInt(this.Name)
    // if(this.Name===NaN){
    //   this.Name=this.Name.toString();
    //   //console.log(this.Name);
      
      
    // }else if(this.Name!==NaN){
    //   this.Name=parseFloat(this.Name)
    //   console.log(this.Name);
      
    // }

    
    // if(this.newFilterDate==null){
    //   this.newFilterDate=undefined
    // }
    if(this.typeSelected === null){
      this.typeSelected=''

    }
    if(this.newFilterDate === null){
      this.newFilterDate=undefined

    }
    
    this.patientserv.getExaminationTypeByParams(this.typeSelected,this.Name,this.newFilterDate).subscribe((data)=>{
      if(data["Examination_records"].length!==0){

        this.filteredData$=data["Examination_records"]
      }else{
        this.filteredData$=[]

      }
    })

  }
  // filterNameByParams(name:any){
  //  this.patientserv.getNameByParams(name).subscribe((data:any)=>{
  //   console.log(data["Examination_records"]);
    
  //   if(data){
  //     this.filteredData$=data["Examination_records"] 
  //   }else{
  //     this.filteredData$=this.patient$
  //   }
  //  })
  // }
  filterExaminType(queryString:any ){
    if(queryString){
      this.filteredData$ =
      this.patient$.filter((p:any)=>p.examination_type.includes(queryString)) 
    }else{
      this.filteredData$ = this.patient$;
    }
  }
  filterDate(queryString:any ){
    if(queryString){
      this.filteredData$ =
      this.patient$.filter((p:any)=>p.date.includes(queryString)) 
    }else{
      this.filteredData$ = this.patient$;
    }
  }

   SaveEdit(id:any, patient:any){
    console.log(id);
    console.log(patient);
    this.patientserv.saveEdit(id,patient).subscribe({
      next: (response) => {
        this.updatedValue=response   
          // this.patient$=this.updatedValue
          const index = this.filteredData$.findIndex((item:any)=>item.examination_id==id )
          
          this.filteredData$.splice(index,1,patient)
          console.log(this.patient)
            console.log(this.updatedValue.examination_type);

            //  this.interv = setInterval(()=>{
            //   this.loading=true
            // },1000)

        console.log('Updated');
        this.isVisible = false;
        this.isEdit = false;
        console.log(response);
      },
        
        error: (error) => console.log(error),
      });
 ;

      //   setInterval(()=>{
      //   clearInterval(this.interv)
      // },2000)
    

    
    
  }
  ngOnDestroy(): void {
    // this.subscribe.unsubscribe()
  }
   deletePatient(patientId:any){
    console.log(patientId);
    
    this.patientserv.deletePatient(patientId).subscribe({next:(response)=>{
      console.log(response);
      // console.log('deleted');
      const index = this.filteredData$.findIndex((item:any)=>item.examination_id==patientId )
          
          this.filteredData$.splice(index,1)
      this.isVisible = false;
      this.isEdit = false;
      // this.isdeleted=false
      
     },
      error:(err)=> console.log(err)
      
    })
   }
   
   onSelectedType(selectedType:string,name:string){
   
   
    this.patientserv.getExaminationTypeByParams(selectedType,name,this.newFilterDate)
    .subscribe(data=>{
      console.log(data);
       
      if(this.typeSelected&&this.Code&&this.Name&&this.newFilterDate){
        this.filteredData$=data.Examination_records
        console.log(data);
      }
      else{
        console.log(this.typeSelected);
        
        this.filteredData$=this.patient$
      }      
    })
   }
   addPayment(){

    this.paymentSuccess=true
    

   }
   handleEdit(){
    this.paymentSuccess=false
   }
   handleAddpay(patientId:any,examinId:any,pay:any){
    console.log(patientId);
    console.log(examinId);
    
    let paid = parseInt(pay)  
    console.log(paid);
    this.patientserv.addPaymint(patientId,examinId,paid)
    .pipe(
      this.toast.observe({
        success:'تم الدفع بنجاح',
        loading:'Logging in...',
        error:({message})=>`${message}`
      })
    )
    .subscribe(data=>{
      console.log(data);
      this.isVisible = false;
      // {examinationPrice: 200, paid: 100, the_Rest_Of_Examination_Price: 100}
      this.paid=data.paid
      this.count=data.the_Rest_Of_Examination_Price
    })
   }
   
}
