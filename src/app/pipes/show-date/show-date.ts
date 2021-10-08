import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment'
import * as moment from "moment-timezone";

@Pipe({
  name: 'showDate',
})
export class ShowDatePipe implements PipeTransform {

  transform(date) {
    //moment.tz.guess(Boolean): we can set ignoreCache argument, if set to true then caches will be ignored.
    let timezone = moment.tz.guess();
    return moment.tz(date, timezone).format(environment.DATE_FORMAT);
  }
}