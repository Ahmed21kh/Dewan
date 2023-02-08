import { HotToastService } from '@ngneat/hot-toast';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit,ViewEncapsulation, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PatientService } from 'src/app/services/patient.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';


const helper = new JwtHelperService();
@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.css']
})
export class AddPrescriptionComponent implements OnInit ,AfterViewInit {

  constructor(
    private route:ActivatedRoute,
    private msg:NzMessageService,
    private http:HttpClient,
    private patientserv:PatientService,
    private modalService: BsModalService,
    private toast:HotToastService,
    private router:Router
  ) { }
  public loading:boolean =false
  modalRef: BsModalRef;
  files: File[] = [];
  isVisible = false;
  isdeleted=false
  isEdit= false
  selected=''
  checked :boolean
  diagonsisComment:any={}
  isUpdateComment:boolean=false
  idList:any[]=[]
  Id:any
  allChecked :boolean=false
  x:number
  indeterminate = false;
  diagonName:any

  addPrescription:boolean =false
  error: string;
  dragAreaClass: string;
  draggedFiles: any;
  fileName = '';
  fileList: NzUploadFile[]
  patient:any
  token:any=this.patientserv.getToken()
  clinicId:any=helper.decodeToken(this.token).clinic_id
  PatientData:any={}
  patientId:any
  ExaminId:any
  name:string=''
  file:any
  type:any
  diagnosis:boolean=false
  ids:any[]=[]
  comment:any=''
  diagon:any=''
  forwardTo:any=''

  medicalAnalysis:any=[]
  Xray:any=[]
  Prescription:any=[]
  Diagnosis:any=[]

  checkOptionsOne:any[]=[]
  Url=environment.Url
  // Url="http://127.0.0.1:5000"
//  Url='http://54.216.176.240:8000/'



  getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  saveFiles(files: FileList) {

    if (files.length > 1) this.error = "Only one file at time allow";
    else {
      this.error = "";
      console.log(files[0].size,files[0].name,files[0].type);
      this.draggedFiles = files;
      console.log(files);
    }
  }



  onFileSelected(event:any) {

    const file:File = event.target.files[0];

    if (file) {

        this.fileName = file.name;

        const formData = new FormData();

        formData.append("thumbnail", file);

        const upload$ = this.http.post("/api/thumbnail-upload", formData);

        upload$.subscribe();
      }
    }

    ngAfterViewInit(): void {
      // this.patientserv.SendId.subscribe((id)=>{
        //   // console.log(id);
        //   this.patientId=id

        //   this.patientserv.getAddPatient(this.patientId).subscribe((patientData)=>{
          //     this.PatientData=patientData.patient
          //     // console.log(patientData.patient);

          //   })
    // })
  }

  ngOnInit(): void {
    console.log(this.clinicId);

    this.route.queryParams.subscribe((params:any)=>{
      // console.log(params.data);
      this.addPrescription=params.data
    })
    this.patientserv.SendExaminId.subscribe((exid)=>{
      console.log(exid);

      this.ExaminId=exid
    })
    this.patientserv.SendId.subscribe((id)=>{
      console.log(id);
      if(id===''){
        console.log(id);
        if(this.addPrescription){

          this.router.navigate(['doctors/bookings'])
        }else
        this.router.navigate(['doctors/medical-history'])



      }else{
        this.patientId=id
        this.loading =true
        this.patientserv.getAddPatient(this.patientId).subscribe({next:(patientData)=>{
          this.PatientData=patientData.patient
          // console.log(patientData.patient);
          this.loading =false
        },error:(err)=>{
          console.log(err)
        // this.router.navigate(['doctors/bookings'])

        }
      })

        this.patientserv.getMedicalAnalysis(this.patientId).subscribe((medical)=>{
          this.medicalAnalysis=medical.Medical_Analysis_Table
          if(this.medicalAnalysis===undefined){
            this.medicalAnalysis=[]
          }
          console.log(this.medicalAnalysis);
          this.loading =false


        })
        this.patientserv.getXray(this.patientId).subscribe((medical)=>{
          this.Xray=medical.X_Rays_Table
          if(this.Xray===undefined){
            this.Xray=[]
          }
          console.log(this.Xray);
          this.loading =false


        })
        this.patientserv.getprescription(this.patientId).subscribe((medical)=>{
          this.Prescription=medical.Prescription_Table
          if(this.Prescription===undefined){
            this.Prescription=[]
          }
          console.log(this.Prescription);
          this.loading =false


        })
        this.patientserv.getDiagnosis(this.patientId).subscribe((medical)=>{
          this.Diagnosis=medical.collected_Data

          console.log(this.ids);

          if(this.Diagnosis===undefined){
            this.Diagnosis=[]
          }
          console.log(this.Diagnosis);
          this.loading =false








        })
      }

    })

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
 }
  updateAllChecked(): void {

    this.indeterminate = false;
    if (this.allChecked) {
        this.allChecked = true;
        console.log(this.Diagnosis);

      this.Diagnosis.forEach((element:any) => {
        if(!this.idList.includes(element.diagnosis_id) ){
          console.log(element.diagnosis_id);

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
  updateSingleChecked(id:any): void {
    console.log(id);

    if (this.checkOptionsOne.every(item => !item.checked && item.id==id)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
  showXRayModal(): void {
    this.files.length=0
    this.type="x-ray_report"
    this.diagnosis=false
  }
  showPrescriptionModal(): void {
    this.files.length=0
    this.type="prescription"
    this.diagnosis=false

  }
  showMedicalAnalysisModal(): void {
    this.files.length=0
    this.type="medical analysis"
    this.diagnosis=false

  }
  showDiagoniesModal(): void {
    this.type="diagnosis"
    this.diagnosis=true
    this.isUpdateComment=false
    this.diagon=null
    this.comment=null
    this.forwardTo=null
    this.diagonName=null
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


  handleChange({ file, fileList }:NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }
  getName(name:any){
   this.name=name
  }
  getFile(event:any){
   this.file= event.target.files;
   console.log('file' , this.file);


  }


onSelect(event:any) {
  console.log(event);
  this.files.unshift(...event.addedFiles);
  console.log(this.files[0].name);

}

onRemove(event:any) {
  console.log(event);
  this.files.splice(this.files.indexOf(event), 1);
}
  // handleChange(event:any){
  //   this.file = event.target.files[0]
  //   console.log('file',this.file);


  // }
  upload(id:any ,type:string ,file:any[]){
    console.log(file);
    this.patientserv.Upload(id,type,file).subscribe((response)=>{
      // const index = this.medicalAnalysis.findIndex((item:any)=>item.id===id)
      // this.medicalAnalysis.splice(index,1,file)
       console.log(response.medical);
       if(type=='medical analysis'){

         this.medicalAnalysis.push(...response.File)
       }else if(type=='x-ray_report'){

         this.Xray.push(...response.File)
       }else
      this.Prescription.push(...response.File)
      // console.log(this.medicalAnalysis.unshift(...file));


    })

  }
  addDiagnosis(patientId:any,examinId:any){
    console.log(examinId);

    // this.addNewDiagnosis={
    //   special_comment:'',
    //   diagnosis:this.diagon,
    //   forward_to:this.forwardTo
    // }
   var addNewDiagnosis={
      special_comment:this.comment,
      diagnosis:this.diagon,
      forward_to:this.forwardTo,
      diagnosis_name:this.diagonName
    }


    this.patientserv.addDiagnosis(patientId,examinId,addNewDiagnosis).pipe(
      this.toast.observe({
        success:'تم اضافة تشخيص جديد',
        loading:'Logging in...',
        error:({message})=>`${message}`
      })
    ).subscribe((response)=>{
        console.log(response);
        this.Diagnosis.push(response.new_comment)
        // for (let index=0; index < this.Diagnosis.length; index++) {
        //   const element = this.Diagnosis[index];
        //   if(this.Diagnosis[index].id === response.new_comment.id){

        //     this.checkOptionsOne.push({id:this.Diagnosis[index].id , label:this.Diagnosis[index].diagnosis, value: this.Diagnosis[index].id, checked: false })
        //   }
        //        console.log(this.checkOptionsOne);}
    })

  }
  // downloadFileMedicalAnalysis(fileId:any){
  //   this.type='medical analysis'
  //   this.patientserv.downloadMedicalHistory(fileId,this.type).pipe(
  //     this.toast.observe({
  //       success:'تم التحميل ',
  //       loading:'Logging in...',
  //       error:({message})=>`${message}`
  //     })
  //   ).subscribe({next:(data)=>{
  //     console.log(data);

  //   },error:(err)=>{
  //     this.toast.error('هناك خطأ')
  //   }})
  // }
  // downloadFileXRay(fileId:any){
  //   this.type='x-ray report'
  //   this.patientserv.downloadMedicalHistory(fileId,this.type).pipe(
  //     this.toast.observe({
  //       success:'تم التحميل ',
  //       loading:'Logging in...',
  //       error:({message})=>`${message}`
  //     })
  //   ).subscribe({next:(data)=>{console.log(data);
  //   },error:(err)=>{
  //     this.toast.error('هناك خطأ')
  //   }})
  // }
  // downloadFilePrescription(fileId:any){
  //   this.type='prescription'
  //   this.patientserv.downloadMedicalHistory(fileId,this.type).pipe(
  //     this.toast.observe({
  //       success:'تم التحميل ',
  //       loading:'Logging in...',
  //       error:({message})=>`${message}`
  //     })
  //   ).subscribe({next:(data)=>{console.log(data);
  //   },error:(err)=>{
  //     this.toast.error('هناك خطأ')
  //   }})
  // }

  downloadAllMedical(patientId:any){
    this.type='medical analysis'
    console.log(this.type);
    console.log(patientId);
    this.patientserv.downloadAll(patientId,this.type).pipe(
      this.toast.observe({
        success:'تم التحميل ',
        loading:'Logging in...',
        error:({message})=>`${message}`
      })
    ).subscribe({next:(data)=>{

    },error:(err)=>{
      this.toast.error('هناك خطأ')
    }})
  }
  downloadAllXRay(patientId:any){
    this.type='x-ray report'
    console.log(this.type);
    console.log(patientId);
    this.patientserv.downloadAll(patientId,this.type).pipe(
      this.toast.observe({
        success:'تم التحميل ',
        loading:'Logging in...',
        error:({message})=>`${message}`
      })
    ).subscribe({next:(data)=>{

    },error:(err)=>{
      this.toast.error('هناك خطأ')
    }})
  }
  downloadAllPrescription(patientId:any){
    this.type='prescription'
    console.log(this.type);
    console.log(patientId);
    this.patientserv.downloadAll(patientId,this.type).pipe(
      this.toast.observe({
        success:'تم التحميل ',
        loading:'Logging in...',
        error:({message})=>`${message}`
      })
    ).subscribe({next:(data)=>{

    },error:(err)=>{
      this.toast.error('هناك خطأ')
    }})
  }
  getComment(id:any){
    this.isUpdateComment=true
    this.diagnosis=true
    this.patientserv.getComment(id).subscribe({next:(comment)=>{
     console.log(comment.diagnosis)
     this.diagonsisComment=comment.diagnosis
    if(this.isUpdateComment==true){
      this.diagon=this.diagonsisComment.diagnosis
      this.comment=this.diagonsisComment.special_comment
      this.forwardTo=this.diagonsisComment.forward_to
      this.diagonName=this.diagonsisComment.diagnosis_name
    }else{
      this.diagon=null
      this.comment=null
      this.forwardTo=null
      this.diagonName=null
    }

    }})
  }
  updateComment(id:any){
    console.log(id);
    var addNewDiagnosis={
      special_comment:this.comment,
      diagnosis:this.diagon,
      forward_to:this.forwardTo,
      diagnosis_name:this.diagonName
    }
    this.patientserv.updateDiagonsis(id,addNewDiagnosis).pipe(
      this.toast.observe({
        success:'تم التعديل  بنجاح',
        loading:'Logging in...',
        error:({message})=>`${message}`
      })
    ).subscribe({next:(value)=>{
      console.log(value.Updated_comment);
      const index = this.Diagnosis.findIndex((item:any)=>item.id ===id  )
      console.log(index);
      this.Diagnosis.splice(index,1,{special_comment:value.Updated_comment.special_comment,
        diagnosis:value.Updated_comment.diagnosis,diagnosis_name:value.Updated_comment.diagnosis_name})

    },error:(err)=>{
      if(err){
        this.toast.error('هناك خطأ')
      }
    }})
  }
  downloadAsText(id:any){
    // this.idList=[parseFloat(id)]
    // const requestPayload = {
    //   id_list:this.idList
    // };
    // console.log(this.idList);

     this.patientserv.downloadAsText(id).pipe(
      this.toast.observe({
        success:'تم التحميل  بنجاح',
        loading:'Logging in...',
        error:({message})=>`${message}`
      })
    ).subscribe({next:(text)=>{
      console.log(text);

    }})

  }
  public async downloadAsFile(key: String) {


    //  const blob = await this.patientserv.downloadAsText()
    //  const link = document.createElement('a');
    //  link.href = window.URL.createObjectURL(blob);
    //  link.download = "file_name_with_extension.jepg";
    //  document.body.appendChild(link);
    //  link.click();
    //  document.body.removeChild(link);
 }

 disable(id:any){
  this.idList.push(id)
 }
 deleteFile(id:any,type:any){
 type= this.type
  this.patientserv.deleteFile(id,type).pipe(
    this.toast.observe({
      success:'تم الحذف  بنجاح',
      loading:'Logging in...',
      error:({message})=>`${message}`
    })
  ).subscribe({next:(deleted)=>{
    if(type=='medical analysis'){
      const index = this.medicalAnalysis.findIndex((item:any)=>item.id ===id  )
      this.medicalAnalysis.splice(index,1)
    }else if(type=='x-ray report'){
      const index = this.Xray.findIndex((item:any)=>item.id ===id  )
      this.Xray.splice(index,1)
    }else if(type=='prescription'){
      const index = this.Prescription.findIndex((item:any)=>item.id ===id  )
      this.Prescription.splice(index,1)
    }
  },error:(err)=>{
    console.log(err);

  }})
 }

 deleteFileMedicalAnalysis(id:any){
  this.type='medical analysis'
  this.Id=id
  this.diagnosis=false
 }
 deleteFileXray(id:any){
  this.type='x-ray report'
  this.Id=id
  this.diagnosis=false

}
deleteFilePrescription(id:any){
  this.type='prescription'
  this.Id=id
  this.diagnosis=false

}
deleteFileDiagnosis(id:any){
  this.diagnosis=true
  this.Id=id
}
deleteComment(id:any){
  this.patientserv.deleteComment(id).pipe(
    this.toast.observe({
      success:'تم الحذف  بنجاح',
      loading:'Logging in...',
      error:({message})=>`${message}`
    })
  ).subscribe({next:(deleted)=>{
    const index = this.Diagnosis.findIndex((item:any)=>item.id ===id  )
    this.Diagnosis.splice(index,1)
  }})
}

addDiginosesId(id:any,checkBox:HTMLInputElement){

  if(!checkBox.checked){
    const index = this.idList.indexOf(id)
    this.idList.splice(index,1)

  }else if(checkBox.checked && !this.idList.includes(id)){
    this.idList.push(parseFloat(id))
    this.indeterminate=true


    if(this.idList.length === this.Diagnosis.length ){
      this.allChecked=true
    this.indeterminate=false

    }else{
     console.log(this.idList.length);
      this.allChecked=false
      this.indeterminate=false
    }


       console.log(this.allChecked);


  }

  console.log(this.idList.length);

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
    let filename: string = this.getFileName(response)
    this.downLoadFile(response, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

  },error:(err)=>{
    console.log(err)
    this.toast.error('هناك خطأ')
  }
  })
}
getFileName(response: HttpResponse<Blob>) {
  let filename: string;
  try {
    const contentDisposition: any = response.headers.get('content-disposition');
    const r = /(?:filename=")(.+)(?:;")/

    filename = r.exec(contentDisposition)![1];
  }
  catch (e) {
    filename = 'myfile.txt'
  }
  return filename
}

downLoadFile(data: any, type: string) {

  let blob = new Blob([data], { type: type});
  let url = window.URL.createObjectURL(blob);
  let pwa = window.open(url);
  if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert( 'Please disable your Pop-up blocker and try again.');
  }}

  downloadAllText(patientId:any){
    this.patientserv.downloadAllAsText(patientId).pipe(
      this.toast.observe({
        success:'تم التحميل  بنجاح',
        loading:'Logging in...',
        error:({message})=>`${message}`
      })
    ).subscribe({next:(response)=>{
      console.log(response);
    this.downLoadFile(response, "application/text/plain")

    },error:(err)=>{
      console.log(err)
      this.toast.error('هناك خطأ')
    }})

  }
}



