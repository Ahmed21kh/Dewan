import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function nameValidator(name: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
    const ValidName:any = control.get(name);
    // console.log(ValidName);
    
    // console.log(typeof ValidName?.value);
    if (
      ValidName.errors && !ValidName.errors['regName']) {
      return null;
    }
     const regex=/^[a-zA-Zا-ي]+ [a-zA-Zا-ي]+$/
     const regex2=/^[a-zA-Zا-ي]+ [a-zA-Zا-ي]+ [a-zA-Zا-ي]+$/
    
    // const isValid = ValidName?.value?.trim().match(regex);
    const isValid=ValidName?.value?.trim()
    console.log(isValid);
    console.log(regex);
    
    console.log(regex.test(isValid));
    
      if (ValidName?.value===''||(null||undefined)) {
        return null;
      }else
      if (!regex2.test(isValid) ) {
        ValidName.setErrors({ regName: true });
        return { regName: true }
      } else {
        ValidName.setErrors(null);
        return null;
      }
    //   return isValid ? null : 
    //   {'regName': true};
    };
}
export function forwardByValidator(forward_by: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
    const ValidName:any = control.get(forward_by);
    // console.log(ValidName);
    
    // console.log(typeof ValidName?.value);
    if(!forward_by){
      return null
    }
    if (ValidName.errors && !ValidName.errors['forwardByName']) {
      return null;
    }
    const isValid = ValidName?.value?.trim()
      .match('^[a-zA-Zا-ي]');
      if (ValidName?.value===null||undefined) {
        return null;
      }
      if (!isValid ) {
        ValidName.setErrors({ forwardByName: true });
        return { forwardByName: true }
      } else {
        ValidName.setErrors(null);
        return null;
      }
    //   return isValid ? null : 
    //   {'regName': true};
    };
}
// export function nameWithWhitespaceValidator(control: FormControl) {
//     const isValid = control.value
//       .trimEnd()
//       .match('^[a-zA-Z]');
//     return isValid ? null : {
//         'regName': false
//     };
//   }