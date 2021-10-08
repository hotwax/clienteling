import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentProvider {
  // Payment array contains the value of paymentMethodName, paymentMethodTypeId and corresonding amount
  public payment: any[] = [];
  // ToDo: Will initialize the value as per the shopping cart template, for now use the hard coded value
  public totalAmount: any = 0;
  public tenderAmount: any = 0;
  public enteredAmount: any = 0;

  constructor() {}
}
