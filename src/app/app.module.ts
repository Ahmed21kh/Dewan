import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatSliderModule } from '@angular/material/slider'
import { MatButtonModule } from '@angular/material/button'
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatCardModule } from '@angular/material/card'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog'
import { HotToastModule } from '@ngneat/hot-toast'
import { MatMenuModule } from '@angular/material/menu'
import { MatListModule } from '@angular/material/list'
import { MatDividerModule } from '@angular/material/divider'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReservationRequestComponent } from './components/nurses/reservation-request/reservation-request.component'
import { RecordBookingsComponent } from './components/nurses/record-bookings/record-bookings.component'
import { CalculatorsComponent } from './components/nurses/calculators/calculators.component'
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core'
import { Routes } from '@angular/router'
import { ShowbookingComponent } from './components/nurses/showbooking/showbooking.component'
import { MatDialogModule } from '@angular/material/dialog'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { HttpClientModule } from '@angular/common/http'
import { BookingsComponent } from './components/doctors/bookings/bookings.component'
import { MedicalHistoryComponent } from './components/doctors/medical-history/medical-history.component'
import { ReportsComponent } from './components/doctors/reports/reports.component'
import { AddPrescriptionComponent } from './components/doctors/add-prescription/add-prescription.component'
import { ar_EG, NZ_I18N } from 'ng-zorro-antd/i18n'
import { en_US } from 'ng-zorro-antd/i18n'
import { registerLocaleData } from '@angular/common'
import en from '@angular/common/locales/en'
import { NzLayoutModule } from 'ng-zorro-antd/layout'
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzCardModule } from 'ng-zorro-antd/card'
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'
import { LoginComponent } from './components/login/login.component'
import { NzModalModule } from 'ng-zorro-antd/modal'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { NzUploadModule } from 'ng-zorro-antd/upload'
import { NzMessageService } from 'ng-zorro-antd/message'
import { NgxDropzoneModule } from 'ngx-dropzone'
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { AlertConfig } from 'ngx-bootstrap/alert'
import { ButtonsModule } from 'ngx-bootstrap/buttons'
import { CarouselModule } from 'ngx-bootstrap/carousel'
import { CollapseModule } from 'ngx-bootstrap/collapse'
import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker'
import { BsDropdownModule, BsDropdownConfig } from 'ngx-bootstrap/dropdown'
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal'
import { PatientService } from './services/patient.service'
import { DataTablesModule } from 'angular-datatables'
import { MatTableModule } from '@angular/material/table'
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter'
import { SignupComponent } from './components/signup/signup.component'
import { authInterceptorProviders } from './services/auth.interceptor'
import { ToastrModule } from 'ngx-toastr'
import { MatPaginatorModule } from '@angular/material/paginator'
import { NgxPaginationModule } from 'ngx-pagination'
import { MatTooltipModule } from '@angular/material/tooltip'
import { JwtModule } from '@auth0/angular-jwt'
import { AuthGuardGuard } from './guards/auth-guard.guard'
import { AlertModule } from 'ngx-alerts'
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

registerLocaleData(en)
const appRoutes: Routes = [
  {
    path: 'nurse',
    children: [
      {
        path: 'add-patient',
        component: ReservationRequestComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'showbooking',
        component: ShowbookingComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'record-bookings',
        component: RecordBookingsComponent,
        canActivate: [AuthGuardGuard],
      },
    ],
  },
  {
    path: 'nurse/accounts',
    component: CalculatorsComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: 'doctors/accounts',
    component: CalculatorsComponent,
    canActivate: [AuthGuardGuard],
  },
  { path: '', component: LoginComponent, canActivate: [AuthGuardGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'doctors',
    children: [
      {
        path: 'bookings',
        component: BookingsComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'add-prescription',
        component: AddPrescriptionComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'medical-history',
        component: MedicalHistoryComponent,
        canActivate: [AuthGuardGuard],
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuardGuard],
      },
    ],
  },
]

@NgModule({
  declarations: [
    AppComponent,
    ReservationRequestComponent,
    RecordBookingsComponent,
    CalculatorsComponent,
    ShowbookingComponent,
    BookingsComponent,
    MedicalHistoryComponent,
    ReportsComponent,
    AddPrescriptionComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true }),
    MatMenuModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatSidenavModule,
    MatNativeDateModule,
    MatDialogModule,
    NgbModule,
    HttpClientModule,
    NzLayoutModule,
    NzMenuModule,
    NzDatePickerModule,
    NzCardModule,
    NzCheckboxModule,
    NzModalModule,
    NzButtonModule,
    NzSelectModule,
    MatProgressSpinnerModule,
    NzUploadModule,
    NgxDropzoneModule,
    CarouselModule,
    CollapseModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule,
    ModalModule,
    AccordionModule,
    ButtonsModule,
    DataTablesModule,
    HotToastModule.forRoot(),
    MatTableModule,
    JwtModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
    }),
    MatPaginatorModule,
    NgxPaginationModule,
    MatTooltipModule,
    AlertModule.forRoot({ maxMessages: 5, timeout: 5000, positionX: 'right' }),
    NzBadgeModule,
    NzNotificationModule,
    NzPopconfirmModule
  ],
  providers: [
    authInterceptorProviders,
    NzMessageService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_LOCALE, useValue: 'fr' },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { floatLabel: 'always' },
    },
    AlertConfig,
    BsDatepickerConfig,
    BsDropdownConfig,
    BsModalService,
    PatientService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ShowbookingComponent],
})
export class AppModule {}
