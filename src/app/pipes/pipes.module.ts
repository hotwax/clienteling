import { NgModule } from '@angular/core';
import { AmountPipe } from './amount/amount';
import { CheckPhoneNumberPipe } from './check-phone-number/check-phone-number';
import { StatePipe } from './state/state';
import { PhoneNumberPipe } from './phone-number/phone-number';
import { ShowDatePipe } from './show-date/show-date';
@NgModule({
  declarations: [AmountPipe, CheckPhoneNumberPipe, StatePipe, PhoneNumberPipe,
    ShowDatePipe],
  imports: [],
  exports: [AmountPipe, CheckPhoneNumberPipe, StatePipe, PhoneNumberPipe,
    ShowDatePipe],
})
export class PipesModule {}
