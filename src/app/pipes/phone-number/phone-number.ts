import { Pipe, PipeTransform } from '@angular/core';
import { parsePhoneNumber, CountryCode, getCountryCallingCode } from 'libphonenumber-js/min';
import { AsYouType } from 'libphonenumber-js';
import { environment } from '../../../environments/environment';
/**
 * Generated class for the PhoneNumberPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'phone',
})
export class PhoneNumberPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(phone: number | string) {
    phone = phone + '';
    if (phone.length >= 10 && phone.indexOf(' ') <= 0) {
      try {
        const phoneNumber = parsePhoneNumber(
          phone,
          environment.DEFAULT_COUNTRY as CountryCode,
        );
        return phoneNumber.formatNational();
      } catch (error) {
        return phone;
      }
    } else {
      return new AsYouType('US').input(phone);
    }
  }
  unMaskPhoneNumber(phone) {
    const phoneNumber = parsePhoneNumber(
      phone,
      environment.DEFAULT_COUNTRY as CountryCode,
    );
    return phoneNumber.nationalNumber;
  }
  getCountryCode(country) {
    return getCountryCallingCode(country);
  }
}
