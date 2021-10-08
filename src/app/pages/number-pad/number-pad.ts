import { Component } from '@angular/core';
import { PaymentProvider } from '../../services/payment.provider';

@Component({
  selector: 'page-number-pad',
  styleUrls: ['number-pad.scss'],
  templateUrl: 'number-pad.html',
})
export class NumberPadPage {
  amount: string;
  constructor(
    public paymentProvider: PaymentProvider,
  ) {}

  setPayment(val: string): void {
    if (this.paymentProvider.enteredAmount === 0) {
      this.amount = '0';
    }
    if (val !== '-1') {
      this.amount += val;
    } else {
      if (parseFloat(this.amount) > 0) {
        this.amount = this.amount.slice(0, -1);
      }
    }
    this.paymentProvider.enteredAmount = parseFloat(this.amount) * 0.01;
  }
}
