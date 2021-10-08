import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { PhoneNumberPipe } from '../../pipes/phone-number/phone-number'
import { Select, Store } from '@ngxs/store';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';
import { ShoppingCart } from '../../models/shopping-cart/shopping.cart';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AddToCart } from '../../shared/store/shopping-cart/shopping-cart.actions';

@Component({
  selector: 'page-shipping-form',
  templateUrl: 'shipping-form.html',
})
export class ShippingFormPage implements OnInit {
  paymentMode = 'payNow';
  reservationForm: any = {};
  trustee: string = '';
  @Input() data: any;
  phoneNumber: string = '';
  deliveryAfter: any = null;
  deliveryBefore: any = null;
  selectedProduct: any;
  isValid: boolean = false;
  cart: ShoppingCart;
  cartSubscription: any;
  @Select(ShoppingCartState.getCart) cart$: Observable<any>;

  validator = {
    phoneNumber: {
      pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
      isValid: false,
    },
    // name: {
    //   pattern: /^[a-z ,.'-]+$/i,
    //   isValid: false,
    // },
  };

  constructor(
    public translation: L10nTranslationService,
    private modalCtrl: ModalController,
    private phone: PhoneNumberPipe,
    private store: Store,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.cartSubscription = this.cart$.subscribe((cart) => {
      this.cart = cart;
    })
  }

  saveReservationForm(form: any): void {
    form.trusteeName =
      form.trusteeName == 'enteredName'
        ? this.trustee
        : this.cart.customer.partyName;
    form.phoneNumber =
      form.phoneNumber == 'enteredNumber'
        ? this.phone.unMaskPhoneNumber(this.phoneNumber)
        : this.cart.customer.phoneNumber;

    this.selectedProduct.attributes = {
      TRUSTEE_NAME: form.trusteeName,
      TRUSTEE_PHONE: form.phoneNumber,
    };
    this.store.dispatch(new AddToCart({ item: this.selectedProduct, contactMechId: this.data.contactMechId, shipByDate: this.deliveryBefore, shipAfterDate: this.deliveryAfter, address: this.data.address}));
    this.closeModal();
  }

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
    // this.validator.name.isValid =
    //   this.reservationForm.trusteeName == 'enteredName' && !this.trustee
    //     ? false
    //     : true;
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
    this.deliveryAfter = null;
    this.deliveryBefore = null;
    this.selectedProduct = this.data.item;
    this.cart$.pipe(take(1)).subscribe((cart) => {
      this.data.phoneNumber = this.data.phoneNumber ? this.data.phoneNumber : cart.customer.phoneNumber;
      //this.validator.name.isValid = cart.billToCustomerPartyId !== '_NA_'
      this.validator.phoneNumber.isValid =
        this.data.phoneNumber
          ? true
          : false;
      this.reservationForm = {
        payment: 'payNow',
        trusteeName:
          cart.billToCustomerPartyId !== '_NA_'
            ? cart.customer.partyName
            : 'enteredName',
        phoneNumber:
          this.data.phoneNumber
            ? this.data.phoneNumber
            : 'enteredNumber',
        deliveryInDays: 'five',
      };
      this.isValid = this.validateForm();
    })
  }

  ngOnDestroy() {
    if(this.cartSubscription) this.cartSubscription.unsubscribe();
  }
}
