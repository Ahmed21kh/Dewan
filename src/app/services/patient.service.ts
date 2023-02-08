import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/internal/Observable'
import { Patient } from '../models/Patient'
import { BehaviorSubject, catchError, observable, of, throwError } from 'rxjs'
import {saveAs} from 'file-saver';
import { JwtHelperService } from '@auth0/angular-jwt'
import { Router } from '@angular/router'
import * as moment from 'moment'
const TOKEN_KEY = 'auth-token'
const USER_KEY = 'Authorization'
const Role = 'role'
import {environment} from '../../environments/environment'
const Url=environment.Url
// const Url='http://127.0.0.1:5000'
// const Url='http://54.216.176.240:8000/'
const helper = new JwtHelperService();
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}
@Injectable({
  providedIn: 'root',
})
export class PatientService {

  public SendData = new BehaviorSubject<any>('')
  public SendId = new BehaviorSubject<any>('')
  public SendRole = new BehaviorSubject<any>('')
  public SendExaminId = new BehaviorSubject<any>('')

  constructor(
    private http: HttpClient,
    private router:Router
    ) {}
  signOut(): void {
    window.localStorage.clear()
    this.router.navigate(['login'])
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.setItem(TOKEN_KEY, token)
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY)
  }
  isTokenExpired(token:any):boolean{
    const decodedToken = helper.decodeToken(token);
    const expirationDate = helper.getTokenExpirationDate(token);
    const isExpired = helper.isTokenExpired(token);
    return isExpired
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY)
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
  public saveRole(role: any): void {
    window.localStorage.removeItem(Role)
    window.localStorage.setItem(Role, JSON.stringify(role))
  }
  public getRole(): any {
    const user = window.localStorage.getItem(Role)
    if (user) {
      return JSON.parse(user)
    }
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY)
    if (user) {
      return JSON.parse(user)
    }

    return {}
  }

  getOnePatient(id: any): Observable<object> {

    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);

    // console.log(token)
    const isExpired = helper.isTokenExpired(token);
    if(isExpired){
     this.signOut()
    }

    let httpHeader = new HttpHeaders().set('x-access-token', token)

    // console.log(httpHeader)

    return this.http.get<Patient>(Url+
      `/api/patient/exist_patient_data/${clinicId}/${id}`,
    )
  }
  getPatient(): Observable<object> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let mydata = this.http.get<any>(Url+
      `/api/nurse/examination_records/filter/${clinicId}`,
    )
    return mydata
  }
  getRegisteredPatient(): Observable<object> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let mydata = this.http.get<any>(Url+
      `/api/nurse/examination_records/filter/${clinicId}`,
    )
    return mydata
  }
  getExamination(pid: any, eid: any): Observable<object> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    var token: any = this.getToken()
    // console.log(token)

    let httpHeader = new HttpHeaders().set('x-access-token', token)
    let mydata = this.http.get<Patient>(Url+
      `/api/examination_records/data_examination/${clinicId}/${pid}/${eid}`,
      { headers: httpHeader },
    )
    return mydata
  }

  getExaminPatient(id: any): Observable<object> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let mydata = this.http.get<any>(Url+
      `/api/nurse/patient_examinations/${clinicId}/${id}`,
    )
    return mydata
  }
  getPatientName(): Observable<object> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let mydata = this.http.get<any>(Url+
      `/api/patient/registered_patient/${clinicId}`,
    )
    return mydata
  }

  addPatient(patient: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    // patient.date =
    var token: any = this.getToken()
    // console.log(token)
    // let httpHeader = new HttpHeaders().set('x-access-token',token)

    const year = new Date(patient.date).getFullYear()
    const month = new Date(patient.date).getMonth() + 1
    const day = new Date(patient.date).getDate()
    const newDate = `${year}-${month}-${day}`
    patient.date = newDate
    let x = this.http.post(Url+
      `/api/patient/add_patient/${clinicId}`,
      patient,
    )
    return x
  }

  addExamination(id: any, patient: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    var token: any = this.getToken()
    // console.log(token)
    let httpHeader = new HttpHeaders().set('x-access-token', token)

    const year = new Date(patient.date).getFullYear()
    const month = new Date(patient.date).getMonth() + 1
    const day = new Date(patient.date).getDate()
    const newDate = `${year}-${month}-${day}`
    patient.date = newDate
    let data = this.http.post<any>(Url+
      `/api/nurse/add_examination/${clinicId}/${id}`,
      patient,
      { headers: httpHeader },
    )
    return data
  }

  addExamin(id: any, examin: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    var token: any = this.getToken()
    // console.log(token)
    let httpHeader = new HttpHeaders().set('x-access-token', token)

    const year = new Date(examin.date).getFullYear()
    const month = new Date(examin.date).getMonth() + 1
    const day = new Date(examin.date).getDate()
    const newDate = `${year}-${month}-${day}`
    examin.date = newDate
    let mydata = this.http.post<any>(Url+
      `/api/nurse/add_examination/${clinicId}/${id}`,
      examin,
    )
    return mydata
  }
  saveEdit(id: any, patient: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    const year = new Date(patient.date).getFullYear()
    const month = new Date(patient.date).getMonth() + 1
    const day = new Date(patient.date).getDate()
    const newDate = `${year}-${month}-${day}`
    patient.date = newDate
    let data = this.http.put(Url+
      `/api/nurse/update_examination/${clinicId}/${id}`,
      patient,
    )
    return data
  }
  deletePatient(id: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.delete(Url+
      `/api/nurse/delete_examination/${clinicId}/${id}`,
    )
    return data
  }

  // EditPatient(patient: Patient) {
  //   let mydata = this.http.put(
  //     'http://localhost:3000/users' + patient.id,
  //     patient
  //   );
  //   return mydata;
  // }

  getCode() {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);

    return this.http.get<any>(Url+
      `/api/patient/new_patient/get_code/${clinicId}`,
    )
  }
  getNumber() {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    return this.http.get<any>(Url+
      `/api/patient/new_patient/get_num/${clinicId}`,
    )
  }

  //get all Patients

  getPatientTaple(): Observable<Patient[]> {

    let Url: string = 'http://localhost:3000/Patient_Table'
    return this.http.get<Patient[]>(Url).pipe(catchError(this.handleError))
  }

  // Error Handling
  public handleError(error: HttpErrorResponse) {
    let errorMessage: string = ''
    if (error.error instanceof ErrorEvent) {
      //client error
      errorMessage = ` Error : ${error.error.message}`
    } else {
      //server error
      errorMessage = `Status: ${error.status}\n Message : ${error.message}`
    }
    return throwError(errorMessage)
  }

  SendDataToComponent(data: any) {
    return this.SendData.next(data)
  }
  SendRoleToComponent(role: any) {
    return this.SendRole.next(role)
  }
  SendIdToComponent(id: any) {
    return this.SendId.next(id)
  }
  SendExaminIdToComponent(id: any) {
    return this.SendExaminId.next(id)
  }

  getAddPatient(id: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
      `/api/medical_history/files/data_at/add_prescription/${clinicId}/${id}`,
    )
    return data
  }

  Upload(id: any, type: string, file: File[]): Observable<any> {
    // console.log(file)
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let formData: FormData = new FormData()
    file.forEach((f) => {
      formData.append('file', f)
      // console.log(f.name)
    })
    let headers = new HttpHeaders()
    /** In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data')
    // headers.append('Accept', 'application/json');

    return this.http.post<any>(Url+
      `/api/medical_history/files/upload/${clinicId}/${id}/${type}`,
      formData,
    )
  }

  getMedicalHistory() {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get<any>(Url+
      `/api/patient/data_for_doctor/medical_history/filter/${clinicId}`,
    )
    return data
  }



  addPaymint(pid: any, exid: any, paid: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    //  let paid = parseFloat(pay)
    //  console.log(typeof paid);
    let pay = { paid: parseFloat(paid) }

    let data = this.http.post<any>(Url+
      `/api/nurse/accounts/pay/${clinicId}/${pid}/${exid}`,
      pay,
    )
    return data
  }

  getNewPayment(pid: any, exid: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
      `/api/nurse/accounts/new_pay/${clinicId}/${pid}/${exid}`,
    )
    return data
  }
  getPayment(id: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
      `/api/nurse/accounts/get_pay/${clinicId}/${id}`,
    )
    return data
  }
  updatePayment(payid: any, exid: any, paid: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let pay = { paid: parseFloat(paid) }
    let data = this.http.put<any>(Url+
      `/api/nurse/accounts/pay/edit/${clinicId}/${payid}/${exid}`,
      pay,
    )
    return data
  }

  getDataOfAllPatients(): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
     `/api/nurse/accounts/filter/${clinicId}`,
    )
    return data
  }
  getMedicalAnalysis(id: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
      `/api/medical_history/files/medical_analysis_table/${clinicId}/${id}`,
    )
    return data
  }
  getXray(id: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
      `/api/medical_history/files/x_rays_report_table/${clinicId}/${id}`,
    )
    return data
  }
  getprescription(id: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
      `/api/medical_history/files/prescription_table/${clinicId}/${id}`,
    )
    return data
  }
  getDiagnosis(id: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
      `/api/reports/diagnosis/${clinicId}/${id}`,
    )
    return data
  }
  addDiagnosis(pid: any, exid: any, diagonsis: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.post<any>(Url+
      `/api/reports/add_comment/${clinicId}/${pid}/${exid}`,
      diagonsis,
    )
    return data
  }
  getReports(): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
      `/api/reports/filter/${clinicId}`,
    )
    return data
  }
  downloadMedicalHistory(fileId: any, type: any): Observable<any> {
       var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
      `/api/medical_history/files/download/${clinicId}/${fileId}/${type}`,
      { observe: 'response', responseType: 'blob' },
    )
    return data
  }
  downloadAll(pId: any, type: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get(Url+
      `/api/medical_history/files/download_all/${clinicId}/${pId}/${type}`,
      { observe: 'response', responseType: 'blob' },
    )
    return data
  }
  updateDiagonsis(id: any, diagonsis: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    console.log(diagonsis)

    let data = this.http.put<any>(Url+
      `/api/reports/change_comment/${clinicId}/${id}`,
      diagonsis,
    )
    return data
  }
  getComment(id: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.get<any>(Url+
      `/api/reports/get_comment/${clinicId}/${id}`,
    )
    return data
  }
  downloadAsText(id_list: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    // var idList={id_list:id_list}
    // console.log(idList);
    let data = this.http.get<any>(Url+
      `/api/reports/download_one_text/${clinicId}/${id_list}`,
    )
    return data
  }
  downloadAsExcel(id_list: any[]): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    var idList = { id_list: id_list }
    // console.log(idList)
    let data = this.http.post(Url+
      `/api/reports/download_as_excel/${clinicId}`,
      idList,
      { responseType: 'blob' },
    )
    return data
  }
  downloadAllAsText(patientId: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    // var idList={id_list:id_list}
    // console.log(idList);
    let data = this.http.get(Url+
      `/api/reports/download_all_text/${clinicId}/${patientId}`,
      { responseType: 'blob' },
    )
    return data
  }
  deleteFile(id: any, type: any) {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.delete<any>(Url+
      `/api/medical_history/files/delete_file/${clinicId}/${id}/${type}`,
    )
    return data
  }
  deleteComment(id: any) {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let data = this.http.delete<any>(Url+
      `/api/reports/delete_comment/${clinicId}/${id}`,
    )
    return data
  }
  login(loginForm: any): Observable<any> {
    let data = this.http.post(Url+
      '/api/auth/login',
      loginForm,
      {observe: 'response'}
    )
    return data
  }
  signup(signupForm: any): Observable<any> {

    let data = this.http.post(Url+
      '/api/user',
      signupForm,

    )
    return data
  }

  //filters
  getExaminationTypeByParams(type: any, name: any, date: any): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    if (name === undefined) {
      name = ''
    }
    if (date === undefined || date === '1970-1-1') {
      date = ''
    } else {
      const year = new Date(date).getFullYear()
      const month = new Date(date).getMonth() + 1
      const day = new Date(date).getDate()
      const newDate = `${year}-${month}-${day}`
      date = moment(date).format('YYYY-MM-DD')
    }
    let param1 = new HttpParams().set('examination_typ', type)
    name=name.trim()
    if(Number.isInteger(+name)){
      param1 = param1.append('patient_code', name)

      }else{

        param1 = param1.append('patient_name', name)

      }

    // param1 = param1.append('patient_code',code)
    param1 = param1.append('examination_date', date)
    // let param2 = new HttpParams().set('patient_name',selectedType);
    // let param3 = new HttpParams().set('patient_code',selectedType);
    // let param4 = new HttpParams().set('examination_date',selectedType);
    console.log(param1)

    return this.http.get(Url+
      `/api/nurse/examination_records/filter/${clinicId}`,
      { params: param1 },
    )
  }
  getExaminationReportByParams( name: any,  dateFrom:any, dateTo:any ): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    // console.log(dateFrom);
    // console.log(dateTo);

    if (name === undefined ) {
      name = ''
    }
    if(dateFrom === undefined || dateFrom === '1970-1-1'){
      dateFrom = ''

    }else{
      const year1 = new Date(dateFrom).getFullYear()
      const month1 = new Date(dateFrom).getMonth() + 1
      const day1 = new Date(dateFrom).getDate()
      const newDateFrom = `${year1}-${month1}-${day1}`
      dateFrom = moment(dateFrom).format('YYYY-MM-DD')
    // console.log(dateFrom);

    }

    if (dateTo === undefined || dateTo === '1970-1-1') {
      dateTo = ''
    } else {
      const year = new Date(dateTo).getFullYear()
      const month = new Date(dateTo).getMonth() + 1
      const day = new Date(dateTo).getDate()
      const newDateTo = `${year}-${month}-${day}`
      dateTo = moment(dateTo).format('YYYY-MM-DD')
      console.log(dateTo);


    }
    let param1 = new HttpParams()
    name=name.trim()
    if(Number.isInteger(+name)){
      param1 = param1.append('patient_code', name)

      }else{

        param1 = param1.append('patient_name', name)

      }

    // param1 = param1.append('patient_code',code)
    param1 = param1.append('examination_date_from', dateFrom)
    param1 = param1.append('examination_date_to', dateTo)
    // let param2 = new HttpParams().set('patient_name',selectedType);
    // let param3 = new HttpParams().set('patient_code',selectedType);
    // let param4 = new HttpParams().set('examination_date',selectedType);
    console.log(param1)

    return this.http.get(Url+
      `/api/reports/filter/${clinicId}`,
      { params: param1 },
    )
  }

  getCodeByParams(selectedType: string): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let param3 = new HttpParams().set('patient_code', selectedType)
    // console.log(param3)

    return this.http.get(Url+
      `/api/nurse/examination_records/filter/${clinicId}`,
      { params: param3 },
    )
  }
  getNameMidicalByParams(name: any) {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let param2 = new HttpParams()
    name=name.trim()
    if(Number.isInteger(+name)){
      param2 = param2.append('patient_code', name)

      }else{

        param2 = param2.append('patient_name', name)

      }
    // console.log(param2)

    return this.http.get(Url+
      `/api/patient/data_for_doctor/medical_history/filter/${clinicId}`,
      { params: param2 },
    )
  }
  getDateByParams(selectedType: string): Observable<any> {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let param4 = new HttpParams().set('examination_date', selectedType)
    console.log(param4)

    return this.http.get(Url+
      `/api/nurse/examination_records/filter/${clinicId}`,
      { params: param4 },
    )
  }
  getPaymentfilter(name: any,pagenum:number) {
    var token: any = this.getToken()
    const clinicId = helper.decodeToken(token).clinic_id
     console.log(clinicId);
    let param2 = new HttpParams()
    if(name==undefined){
      name=""
    }
    if(Number.isInteger(+name)&&name!==undefined){
      name=name.trim()
      param2 = param2.append('patient_code', name)

      }else{
      name=name.trim()
        param2 = param2.append('patient_name', name)

      }
      param2 = param2.append('page', pagenum)
    console.log(param2)

    return this.http.get(Url+
      `/api/nurse/accounts/filter/${clinicId}`,
      { params: param2 },
    )
  }

 downloadFile(pid:any,exid:any):Observable<any>{
  var token: any = this.getToken()
  const clinicId = helper.decodeToken(token).clinic_id
   console.log(clinicId);
  let data = this.http.get(Url+`/api/print/${clinicId}/${pid}/${exid}`, {responseType: "blob", headers: {'Accept': 'application/text'}})

  return data
 }
}
