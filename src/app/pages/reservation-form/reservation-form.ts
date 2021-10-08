import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { ShoppingCartState } from "../../shared/store/shopping-cart/shopping-cart.state";
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AddToCart } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { PhoneNumberPipe } from '../../pipes/phone-number/phone-number';
import { CustomerState } from '../../shared/store/customer/customer.state';

@Component({
  selector: 'page-reservation-form',
  templateUrl: 'reservation-form.html',
})
export class ReservationFormPage implements OnInit {
  @Input() data: any;

  paymentMode = 'payNow';
  reservationForm: any = {};
  trustee: string = '';
  phoneNumber: string = '';
  numberOfDays = 0;
  pickupDate: string = null;

  isValid: boolean = false;
  cart: any;
  cartSubscription: any;

  validator = {
    phoneNumber: {
      pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
      isValid: false,
    },
    name: {
      pattern: /^[a-z ,.'-]+$/i,
      isValid: false,
    },
  };

  @Select(ShoppingCartState.getCart) cart$: Observable<any>;
  @Select(CustomerState.getPartyId) customerId$: Observable<any>;
  constructor(
    public translation: L10nTranslationService,
    private modalCtrl: ModalController,
    private phone: PhoneNumberPipe,
    private store: Store,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.cartSubscription = this.cart$.subscribe((cart) => {
    this.cart = cart;
    });
  }

  ngOnDestroy() {
    if(this.cartSubscription) this.cartSubscription.unsubscribe();
  }

  saveReservationForm(form: any): void {
    this.cart$.pipe(take(1)).subscribe((cart) => {
    form.trusteeName =
      form.trusteeName == 'enteredName'
        ? this.trustee
        : cart.customer.partyName;
    form.phoneNumber =
      form.phoneNumber == 'enteredNumber'
        ? this.phone.unMaskPhoneNumber(this.phoneNumber)
        : cart.customer.phoneNumber;

    this.data.selectedProduct.attributes = {
      TRUSTEE_NAME: form.trusteeName,
      TRUSTEE_PHONE: form.phoneNumber,
    };
    this.store.dispatch(new AddToCart({ item: this.data.selectedProduct, facilityId: this.data.facilityId, facilityName: this.data.facilityName, shipByDate: this.pickupDate }));
    this.closeModal();
    });
  }

  /**
   * NOTE:
   * ionic-3 form validation doesnot work for radio button group.If we add formControlName on
   * ion-radio it will through an exception: "No value accessor for form control with name".
   */

  validateField(val, fieldType): void {
    this.validator[fieldType].isValid = val.match(
      this.validator[fieldType].pattern,
    )
      ? true
      : false;
    this.isValid = this.validateForm();
  }

  validateForm(): boolean {
    for (let field in this.validator) {
      if (!this.validator[field]['isValid']) {
        return false;
      }
    }
    return true;
  }

  checkstatus(): void {
    this.validator.name.isValid =
      this.reservationForm.trusteeName == 'enteredName' && !this.trustee
        ? false
        : true;
    this.validator.phoneNumber.isValid =
      this.reservationForm.phoneNumber == 'enteredNumber' && !this.phoneNumber
        ? false
        : true;
    this.isValid = this.validateForm();
  }

  closeModal(): void {
    this.modalCtrl.dismiss({
      'dismissed': true
    })
  }

  ngOnInit() {
    this.validator.name.isValid = this.cart.billToCustomerPartyId !== '_NA_';
    this.validator.phoneNumber.isValid =
      this.cart.customer.phoneNumber &&
      this.cart.customer.phoneNumber !== '_NA_'
        ? true
        : false;
    this.reservationForm = {
      payment: 'payNow',
      trusteeName:
      this.cart.billToCustomerPartyId !== '_NA_'
          ? this.cart.customer.partyName
          : 'enteredName',
      phoneNumber:
        this.cart.customer.phoneNumber &&
        this.cart.customer.phoneNumber !== '_NA_'
          ? this.cart.customer.phoneNumber
          : 'enteredNumber',
    };
    this.isValid = this.validateForm();
    this.checkRange();
  }

  checkRange() {
    let selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + this.numberOfDays);
    this.pickupDate = `${selectedDate.getDate()}/${
      selectedDate.getMonth() + 1
    }/${selectedDate.getFullYear()}`;
  }
}
