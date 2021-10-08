import { Pipe, PipeTransform } from '@angular/core';
import { region } from '../../../states';

/**
 * Generated class for the StatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'stateName',
})
export class StatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    return region[args[0]].find(el => el.code === value).name;
  }
}
