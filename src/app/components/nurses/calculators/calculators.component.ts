import { ToastrService } from 'ngx-toastr';
import { HotToastService } from '@ngneat/hot-toast';
import { PatientService } from 'src/app/services/patient.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calculators',
  templateUrl: './calculators.component.html',
  styleUrls: ['./calculators.component.css']
})
export class CalculatorsComponent implements OnInit,OnDestroy {
  size: 'large' | 'small' | 'default' = 'large';
  PatientData:any=[]
  dtOptions: DataTables.Settings = {};
  public loading:boolean =false
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
  PatientPayment: any={};
  count: number;
  paid: number;
  Name:any
  isPaid:boolean
  filter$:any=[]
  p: number = 1;
  collection: any[] =[];  
  totalPages:number
  constructor(
    private patientserv:PatientService,
    private toast:HotToastService,
    private toastr:ToastrService
  ) { }
  
  selected=''
  
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2
    };
    this.loading=true
    this.patientserv.getDataOfAllPatients().subscribe({next:(response)=>{
      console.log(response);
      this.totalPages=response.total
      this.filter$=this.PatientData=response.examinationRecords
      
      console.log(this.PatientData[0].paid);
      this.dtTrigger.next(response);
      this.loading=false
      for (let index = 0; index < response.length; index++) {
        const element = response[index];
        this.PatientData=element
        
        
      }
      console.log(this.PatientData);
      
    },error:(err)=>console.log(err)
    })
  }
  
  
  showPaymentModal(paymentId:any): void {
    if(paymentId=="no id"){
      this.toast.error('المريض لم يقم بالدفع')
    }else{
      this.patientserv.getPayment(paymentId).subscribe({next:(data)=>{
        console.log(data);
        this.isPaid=true
        
        // if(data)
        const year=  new Date(data.examinationDate).getFullYear()
        const month=  new Date(data.examinationDate).getMonth()+1
        const day=  new Date(data.examinationDate).getDate()
        const newDate= `${year}-${month}-${day}`
        data.examinationDate= newDate
        this.PatientPayment=data
        console.log(data);
        
  
        this.paid=this.PatientPayment.paid
  
        this.count=this.PatientPayment.theRest
  
  
        console.log( this.PatientPayment.patient_id);
        
    },error:(err)=>{
      console.log(err)
      if(err){
        this.isPaid=false
      }
    }
    })
    }

  }
  settling(examinationPrice:number){
    this.paid=examinationPrice
    this.count=0
  }
  UpdatePayment(paymentId:any,examinId:any,paid:any){
     this.patientserv.updatePayment(paymentId,examinId,paid).pipe(
      this.toast.observe({
        success:'تم التعديل بنجاح',
        loading:'Logging in...',
        error:({message})=>`${message}`
      })
      ).subscribe({next:(response)=>{
        console.log(response);
        const index = this.filter$.findIndex((item:any)=>item.payment_id === response.payment_id &&item.examination_id === response.examination_id  )
        console.log(index);
        this.filter$.splice(index,1,response)
        console.log(this.PatientData[index].code);
        
        // this.PatientData.splice(index,1,{
          //   payment_id:this.PatientData[index].payment_id,
          //   examination_id:this.PatientData[index].examination_id,
      //   patient_id:this.PatientData[index].patient_id,
      //   code:this.PatientData[index].code,
      //   name:this.PatientData[index].name,
      //   examinationPrice:this.PatientData[index].examinationPrice,
      //   paid:paid,
      //   theRest:this.count
      // })
      
    }})
  }
 filter(event:any){

  this.patientserv.getPaymentfilter(this.Name,this.p).subscribe((data:any)=>{
    if(data.examinationRecords.length!==0){
      this.totalPages=data.total
      this.filter$=data.examinationRecords
    }else{
      this.totalPages=data.total
        this.filter$=[]


      
    }
  })
}
pagination(pageNumber:any){
  console.log(pageNumber);
  
   this.p=pageNumber
  this.patientserv.getPaymentfilter(this.Name,this.p).subscribe((data:any)=>{
    if(data.examinationRecords.length!==0){
      this.totalPages=data.total
      this.filter$=this.PatientData=data.examinationRecords
    }else{
      this.totalPages=data.total
        this.filter$=this.PatientData=[]


      
    }
  })
}
ngOnDestroy(): void {
  this.dtTrigger.unsubscribe();
}
}
