export interface Patient {
  id?: number;
  Code: number;
  name: string;
  forwarded_by: string;
  phone_Number: number;
  age: number;
  number: number;
  examination_type: string;
  price: number;
  date: any;
}
export interface Examination {
  id?: any;
  Code: any;
  name: any;
  forwarded_by: any;
  phone_Number: any;
  age: any;
  number: any;
  examination_type?: any;
  price: any;
  date: any;
}
