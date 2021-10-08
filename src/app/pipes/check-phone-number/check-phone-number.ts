import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CheckPhoneNumberPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'checkPhoneNumber',
})
export class CheckPhoneNumberPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(contacts: string[], contactType: string) {
    let phoneNumber = contacts
      .filter((ele: string) => ele.includes(contactType))
      .map((num: string) => {
        return num.substring(num.indexOf('/') + 1, num.length);
      })[0];
    return phoneNumber ? '+' + phoneNumber : ' ';
  }
}
