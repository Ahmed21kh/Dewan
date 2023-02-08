import { PatientService } from 'src/app/services/patient.service';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
 public loading:boolean=false
  filteredData$: any=[]
  patient$:any
  date:any=null
  Name:any=''
  selected=''
  Code:number
  selectedValue:any

  public errorMessage:string|null =null;
  constructor(
    private route:Router,
    private patientserv:PatientService
  ) { }
  @ViewChild('someInput') input: ElementRef;

  size: 'large' | 'small' | 'default' = 'large';
  
  addPrescription:boolean =true
  ngOnInit(): void {
    this.loading =true
    this.patientserv.getRegisteredPatient().subscribe({
     next:(data: any)=>{
       this.filteredData$= this.patient$ = data.Examination_records
       this.loading=false
     // console.log(data.hasOwnProperty("Patient_Table"));
         console.log(this.patient$[0].examination_id);
         
 
    }, error: (error)=>{
     this.errorMessage =error;
     this.loading = false
    }
   })
  }
  addPrescriptions(id:any,exid:any){
    console.log(exid);
    console.log(id);
    
    this.route.navigate(['/doctors/add-prescription'],{queryParams:{data:this.addPrescription}});
    this.patientserv.SendExaminIdToComponent(exid)
   for (let index = 0; index < this.patient$.length; index++) {
    const element = this.patient$[index];
    if(this.patient$[index].patient_id === id )
    this.patientserv.SendIdToComponent(this.patient$[index].patient_id)
    
    
   }
   for (let index = 0; index < this.patient$.length; index++) {
    const element = this.patient$[index];
    if(this.patient$[index].examination_id === exid )
    this.patientserv.SendExaminIdToComponent(this.patient$[index].examination_id)
    
    
   }
  
  }
  filter(event:any){
  //   console.log(event);
  //   let charCode = (event.which)?event.which:event.keyCode
  //   console.log(charCode);
  //  if(isNaN(this.Name)){
  //   this.Name.toString()
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

    
    if(this.date==null){
      this.date=undefined
    }
    if(this.selected===null){
      this.selected=''
    }
    this.patientserv.getExaminationTypeByParams(this.selected,this.Name,this.date).subscribe((data)=>{
      if(data.Examination_records.length!==0){
        this.filteredData$=data.Examination_records
      }else{
        this.filteredData$ = []
      }

    })
  }

}
