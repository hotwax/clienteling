import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { HcProvider } from '../../services/hc.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { PhoneNumberPipe } from '../../pipes/phone-number/phone-number';
import { Select, Store } from '@ngxs/store';
import { AuthState } from '../../shared/store/auth/auth.state';
import { Observable } from 'rxjs';
import { ShoppingCartState } from "../../shared/store/shopping-cart/shopping-cart.state";
import { ShoppingCart } from "../../models/shopping-cart/shopping.cart";
import { UpdateCart } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'page-create-customer',
  templateUrl: 'create-customer.html',
})
export class CreateCustomerPage {
  createCustomerForm: FormGroup;
  phoneNumber = '';
  currentStoreData: any;
  cart: ShoppingCart;
  cartSubscription: any;

  @Select(AuthState.getCurrentStore) currentStoreData$: Observable<any>;
  @Select(ShoppingCartState.getCart) shoppingCart$: Observable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private translation: L10nTranslationService,
    private hcProvider: HcProvider,
    private widget: WidgetUtils,
    private phone: PhoneNumberPipe,
    private store: Store,
    public router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.createCustomerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(14),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[A-Za-z0-9._%+-]{2,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})',
          ),
        ],
      ],
    });
    this.createCustomerForm.get('phoneNumber').valueChanges.subscribe(val => {
      this.phoneNumber = this.phone.transform(val);
    });
    this.currentStoreData$.subscribe(currentStoreData => {
      this.currentStoreData = currentStoreData;
    });
    this.cartSubscription = this.shoppingCart$.subscribe(shoppingCart => {
      this.cart = shoppingCart;
    });
  }

  ngOnDestroy() {
    if(this.cartSubscription) this.cartSubscription.unsubscribe();
  }

  createCustomer(createCustomerForm): void {
    this.widget.showLoading('');
    let params = {
      firstName: createCustomerForm.firstName,
      lastName: createCustomerForm.lastName,
      emailAddress: createCustomerForm.email,
      emailVerified: createCustomerForm.email ? 'Y' : '',
      contactNumber: this.phone.unMaskPhoneNumber(this.phoneNumber),
      phoneVerified: 'Y',
      productStoreId: this.currentStoreData.productStoreId,
      createUserAccount: false,
    };
    this.hcProvider
      .callRequest('post', 'createCommerceCustomer', params)
      .subscribe(
        (data: any) => {
          if (data.body.partyId) {
            let partyName = data.body.firstName + ' ' + data.body.lastName;
            this.cart.shipToCustomerPartyId = data.body.partyId;
            this.cart.billToCustomerPartyId = data.body.partyId;
            this.cart.customer.partyId = data.body.partyId;
            this.cart.customer.partyName = partyName;
            this.cart.partyId = data.body.partyId;
            this.cart.customer.emailAddress = data.body.emailAddress;
            this.cart.customer.phoneNumber = data.body.contactNumber
            this.cart.placingCustomerPartyId = data.body.partyId;
            this.store.dispatch(new UpdateCart({ cart: this.cart }));
            this.router.navigate(['/payment'], { replaceUrl: true });
            this.widget.hideLoading();
          } else {
            this.widget.hideLoading();
            this.widget.showToast(
              this.translation.translate('Error while creating customer'),
            );
          }
        },
        err => {
          this.widget.hideLoading();
          this.widget.showToast(this.translation.translate('Something went wrong'));
        },
      );
  }
}
