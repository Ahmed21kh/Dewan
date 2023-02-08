import { HotToastService } from '@ngneat/hot-toast';
import { PatientService } from 'src/app/services/patient.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
patientReports:any=[]
patientQuantity:any={}
idList:any[]=[]
Name:any
date:any
public loading:boolean =false
filteredData$: any=[]
  dateFrom: any;
  dateTo: any;

  constructor(
    private patientserv:PatientService,
    private toast:HotToastService
  ) { }
  selected=''
  checked = false;
  allChecked = false;
  indeterminate = false;
  checkOptionsOne = [
    { label: '', value: '', checked: false },
  ];
  size: 'large' | 'small' | 'default' = 'large';
  ngOnInit(): void {
    this.loading=true
    this.patientserv.getReports().subscribe((reports)=>{
     console.log(reports.examinationRecords);
     this.filteredData$=this.patientReports=reports.examinationRecords
     this.patientQuantity=reports.statisticsReport
    this.loading=false

     
    })
  }
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
        this.allChecked = true;
      this.patientReports.forEach((element:any) => {
        if(!this.idList.includes(element.diagnosis_id) ){
  
          this.idList.push(parseFloat(element.diagnosis_id))
        }
      });
      console.log(this.idList);

    } else {
      this.allChecked=false
      this.idList=[]
      console.log(this.idList);
    }
  }
  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
  addDiginosesId(id:any,checkBox:HTMLInputElement){
    console.log(id);
    
    if(!checkBox.checked){
      const index = this.idList.indexOf(id)
    this.idList.splice(index,1)
    }else if(!this.idList.includes(id)){
  
      this.idList.push(parseFloat(id))
    }
    if(this.patientReports.length== this.idList.length){
      this.allChecked=true
    }
    console.log(this.idList);
  }
  downloadAllasExel(){
    this.patientserv.downloadAsExcel(this.idList).pipe(
      this.toast.observe({
        success:'تم التحميل  بنجاح',
        loading:'Logging in...',
        error:({message})=>`${message}`
      })
    ).subscribe({next:(response)=>{
      console.log(response);
      this.downLoadFile(response, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      
    },error:(err)=>{
      console.log(err)
      this.toast.error('هناك خطأ')  
    }
    })
  }
  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }}
    filter(event:any){
    //   console.log(event);
    //   let charCode = event.keyCode
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
  
      
      if(this.dateFrom==null){
        this.dateFrom=undefined
      }
      if(this.dateTo==null){
        this.dateTo=undefined

      }
      this.patientserv.getExaminationReportByParams(this.Name,this.dateFrom,this.dateTo).subscribe((data)=>{
        if(data.examinationRecords.length!==0){
          this.filteredData$=data.examinationRecords
        }else{
          this.filteredData$ =[];
        }
  
      })
    }
  
 
}


