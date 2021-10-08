import { Pipe, PipeTransform } from '@angular/core';
/**
 * Generated class for the AmountPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'amount',
})
export class AmountPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any): any {
    let amount = parseFloat(value);
    //TODO: will define app constant variable in the a global file.
    return parseFloat(amount.toFixed(2));
  }
}
