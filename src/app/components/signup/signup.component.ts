import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  hide:boolean=true
  signup:boolean=true
  constructor(
    private patientserv:PatientService,
    private toast:HotToastService,
    private router:Router,
    private route:ActivatedRoute
  ) { }

  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required ]),
    password:new FormControl('',[Validators.required]),
    confirmpassword:new FormControl('',[Validators.required ])
  },{
    validators:this.passwordMatch('password','confirmpassword')
 });
 get f(){
  return this.signUpForm.controls;
}
  get username(){
    return this.signUpForm.get('username');
  }
  get password(){
    return this.signUpForm.get('password');
  }
  get confirmpassword(){
    return this.signUpForm.get('confirmpassword');
  }
  ngOnInit(): void {
    console.log(this.route.snapshot.params={data:'ahmed'});
    this.router.navigate(['/signup'],{queryParams:{signup:this.signup}})
    
  }

  mySubmit(){
    if (!this.signUpForm.valid){

      return;
    }

    const {username , password} = this.signUpForm.value;
    this.patientserv.signup( this.signUpForm.value).pipe(
      this.toast.observe({
        success:'signup  successfully',
        loading:'Logging in...',
        // error:'email or password is wrong'
        error:({message})=>`${message}`
      })
    ).subscribe(()=>{
        this.router.navigate(['nurse/add-patient'])
    }) 
  }
    passwordMatch(password: string, confirmPassword: string):ValidatorFn {
      return (formGroup: AbstractControl):ValidationErrors | null => {
        const passwordControl = formGroup.get(password);
        const confirmPasswordControl = formGroup.get(confirmPassword);
  
        if (!passwordControl || !confirmPasswordControl) {
          return null;
        }
  
        if (
          confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
          return null;
        }
  
        if (passwordControl.value !== confirmPasswordControl.value) {
          confirmPasswordControl.setErrors({ passwordMismatch: true });
          return { passwordMismatch: true }
        } else {
          confirmPasswordControl.setErrors(null);
          return null;
        }
      };
    }


 


}
