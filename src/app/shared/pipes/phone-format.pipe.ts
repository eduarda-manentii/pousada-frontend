import { Pipe, PipeTransform } from '@angular/core';
import parsePhoneNumberFromString from 'libphonenumber-js';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {


  transform(value: string): string {
    if (!value) return value;

    const phoneNumber = parsePhoneNumberFromString(value, 'BR');
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.formatNational(); 
    }
    return value; 
  }

}
