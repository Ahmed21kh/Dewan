import { Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css']
})
export class MedicalHistoryComponent implements OnInit {
  filteredData$: any=[]

  constructor(
    private patientserv:PatientService,
    private router:Router
  ) { }
  selected=''
  Name:any
  public loading:boolean=false
  patientHistory:any =[]
  ngOnInit(): void {
    this.loading =true
    this.patientserv.getMedicalHistory().subscribe((history)=>{
      this.filteredData$=this.patientHistory=history.Examination_records
      this.loading =false

      console.log(this.patientHistory);
      
    })
  }
  viewHistory(id:any){
    this.patientserv.SendIdToComponent(id);
    this.router.navigate(['doctors/add-prescription'])
  }
  filter(event:any){
  
    
    // this.Name=parseInt(this.Name)
    // if(this.Name===NaN){
    //   this.Name=this.Name.toString();
    //   //console.log(this.Name);
      
      
    // }else if(this.Name!==NaN){
    //   this.Name=parseFloat(this.Name)
    //   console.log(this.Name);
      
    // }

    
   
    this.patientserv.getNameMidicalByParams(this.Name).subscribe((data:any)=>{
      console.log(data);
      
      if(data.Examination_records.length!==0){
        this.filteredData$=data.Examination_records
      }else{
        this.filteredData$ =[];
      }

    })
  }


}
