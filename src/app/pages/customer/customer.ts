import { Component, Inject } from '@angular/core';
import {
  AlertController,
  ModalController
} from '@ionic/angular';
import { SearchCustomerPage } from '../search-customer/search-customer';
import { DeliveryAddressPage } from '../delivery-address/delivery-address';
import { EditEmailPage } from '../edit-email/edit-email';
import { EditPhonePage } from '../edit-phone/edit-phone';
import { HcProvider } from '../../services/hc.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { CustomerDataProvider } from '../../services/customerdata.provider';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';
import { Select, Store } from '@ngxs/store';
import { ShoppingCart } from '../../models/shopping-cart/shopping.cart';
import { UpdateCart, PrepareEmptyCart } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { PaymentProvider } from '../../services/payment.provider';
import {
  FetchBrowsedProduct,
  FetchSuggestedProduct,
  FetchMostViewedProduct,
  SetOrderHistory
} from '../../shared/store/customer/customer.action';
import { CustomerState } from '../../shared/store/customer/customer.state';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPage {
  customerDetails: any = {};
  isInStore: boolean = false;
  customerCart: any = {};
  customerSegment: string = 'profile';
  addresses: any[] = [];
  cart: ShoppingCart;
  @Select(ShoppingCartState.getCart) cart$: Observable<any>;
  filteredOrders: any[] = []
  orders: any[] = [];
  selectedShipGroups = [];
  keyword: string = ''
  primaryEmail: any = {};
  cartSubscription: any;
  isSearchedSubscription: any;
  primaryPhone: any = {};
  isSearched: string;

  @Select(CustomerState.getOrderHistory) orderHistory$: Observable<any>;
  @Select(CustomerState.getPartyId) customerId$: Observable<any>;
  @Select(CustomerState.getIsSearched) isSearched$: Observable<any>;
  constructor(
    public hcProvider: HcProvider,
    public widget: WidgetUtils,
    public translation: L10nTranslationService,
    public customerDataProvider: CustomerDataProvider,
    private modalCtrl: ModalController,
    private storage: Storage,
    public paymentProvider: PaymentProvider,
    private store: Store,
    private alertCtrl: AlertController,
    public router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.cartSubscription = this.cart$.subscribe(cart => {
      this.cart = cart;
    });
    this.getCustomerAnalytics();
  }

  ionViewWillEnter() {
    this.customerDetails.partyName = this.cart.customer.partyName;
    this.customerDetails.primaryPhoneNumber = this.cart.customer.phoneNumber;
    this.addresses = this.cart.address
      ? this.cart.address.filter(
          ele =>
            ele.address1 &&
            (ele.contactMechPurposeTypeId == 'PostalShippingDest' ||
              ele.contactMechPurposeTypeId == 'PostalPrimary'),
        )
      : [];
    if (this.cart.address) {
      let email = this.cart.address.find(
        ele => ele.infoString && ele.contactMechPurposeTypeId == 'EmailPrimary',
      );
      let phone = this.cart.address.find(
        ele => ele.contactNumber && ele.contactMechPurposeTypeId == 'PhonePrimary',
      );
      this.primaryEmail = email ? email : {};
      this.primaryPhone = phone ? phone : {};
    }
    this.getOrderHistory();
  }

  ngOnDestroy() {
    if(this.cartSubscription) this.cartSubscription.unsubscribe();
  }

  getCustomerAnalytics() {
    this.customerId$.pipe(take(1)).subscribe((customerId) => {
    if (
      customerId !== '_NA_' &&
      environment.hasOwnProperty('CUSTOMER_ANALYTICS') &&
      environment.CUSTOMER_ANALYTICS.trim() !== ''
    ) {
      if (this.primaryEmail.infoString){
        this.store.dispatch(new FetchBrowsedProduct({ email: this.primaryEmail.infoString }));
        this.store.dispatch(new FetchSuggestedProduct({ email: this.primaryEmail.infoString }));
        this.store.dispatch(new FetchMostViewedProduct({ email: this.primaryEmail.infoString }));
      }
    }
    });
  }

  /* Calling customer detail API from HC provider.*/
  getCustomerDetail(customerId) {
    let endPoint = 'customers/' + customerId;
    return this.hcProvider.callRequest('get', endPoint).subscribe(
      (data: any) => {
        if (data.docs.length > 0) {
          this.customerDetails = data.docs[0];
          // Earlier set the partyName directly but now as per the response of API we need concatenation
          this.customerDetails.partyName = this.customerDetails.firstName
            .concat(' ')
            .concat(this.customerDetails.lastName);
          // Here we will update customer basic detail in shopping cart.
          /* Use local variable to assign the cart and once click on shop now button then assign its value in global variable.
        Earlier assign the cart in shoppingCartService.activeShoppingCart and that cause the following issue:
        If we navigate to customer detail page and then navigate back without clicking inStore or shopNow button then that customer is dipslayed as added*/
          this.customerCart = JSON.parse(
            JSON.stringify(this.cart),
          );

          this.customerId$.pipe(take(1)).subscribe((existingCustomerId) => {

          this.isInStore = existingCustomerId !== '_NA_';
          /* After force stop while navigating to this page, Invoke setCustomer method as per the value of billToCustomerPartyId.
        Otherwise setCustomer method invoked each time when the constructor will called.*/
          if (
            this.cart
                .billToCustomerPartyId !== this.customerDetails.partyId
          ) {
            this.setCustomer(this.customerDetails, this.customerCart);
            this.getOrderHistory();
          }
          });
        } else {
          this.widget.showToast(this.translation.translate('Something went wrong'));
          this.widget.hideLoading();
        }
        // As order history requires customerId hence calling Orders API after setting customer
      },
      err => {
        this.widget.hideLoading();
        this.widget.showToast(this.translation.translate('Something went wrong'));
      },
    );
  }

  setCustomer(customer, cart) {
    if (cart.billToCustomerPartyId == '_NA_') {
      cart.billToCustomerPartyId = customer.partyId;
      cart.shipToCustomerPartyId = customer.partyId;
      cart.customer.partyId = customer.partyId;
      cart.customer.partyName = customer.partyName;
      cart.customer.phoneNumber = customer.primaryPhoneNumber;
      cart.partyId = customer.partyId;
      cart.placingCustomerPartyId = customer.partyId;
      /**
       * Adding customer ShippingAddress in cart for displaying it in delivery section
       * and allow user to choose existing address for delivery.
       */
      let shippingAddresses: any[] = [];
      let shippingAddress = {
        shippingAddress1: '',
        shippingAddress2: '',
        shippingAttnName: '',
        shippingCity: '',
        shippingCountry: '',
        shippingEmail: '',
        shippingPhone: '',
        shippingPostalCode: '',
        shippingState: '',
        shippingToName: '',
        state: '',
      };

      shippingAddress.shippingAddress1 = customer.shippingAddress1;
      shippingAddress.shippingAddress2 = customer.shippingAddress2;
      shippingAddress.shippingAttnName = customer.shippingAttnName;
      shippingAddress.shippingCity = customer.shippingCity;
      shippingAddress.shippingCountry = customer.shippingCountry;
      shippingAddress.shippingEmail = customer.shippingEmail;
      shippingAddress.shippingPhone = customer.shippingPhone;
      shippingAddress.shippingPostalCode = customer.shippingPostalCode;
      shippingAddress.shippingState = customer.shippingState;
      shippingAddress.shippingToName = customer.shippingToName;
      shippingAddress.state = customer.state;
      shippingAddresses.push.apply(shippingAddresses, [shippingAddress]);
      cart.shippingAddress = shippingAddresses;
      this.customerCart = cart;
      // Chracter encoding ascii chart: https://grox.net/utils/encoding.html
      this.hcProvider
        .callRequest(
          'get',
          encodeURI(
            'contactMechanism?filters={partyId=' +
              this.customerCart.billToCustomerPartyId +
              '}',
          ),
        )
        .subscribe(
          (data: any) => {
            if (data.docs) {
              this.customerCart['address'].push(...data.docs);
              let email = data.docs.find(
                ele =>
                  ele.infoString &&
                  ele.contactMechPurposeTypeId == 'EmailPrimary',
              );
              let phone = data.docs.find(
                ele => ele.contactNumber && ele.contactMechPurposeTypeId == 'PhonePrimary',
              );
              this.primaryEmail = email ? email : {};
              this.primaryPhone = phone ? phone : {};
              if (this.primaryEmail) {
                this.customerCart['customer'][
                  'emailAddress'
                ] = this.primaryEmail.infoString;
              }
              if (this.primaryPhone) {
                this.primaryPhone.contactNumber = this.primaryPhone.areaCode + this.primaryPhone.contactNumber;
                this.customerCart['customer'][
                  'phoneNumber'
                ] = this.primaryPhone.contactNumber;
              }
              this.addresses = data.docs.filter(
                ele =>
                  ele.address1 &&
                  (ele.contactMechPurposeTypeId == 'PostalShippingDest' ||
                    ele.contactMechPurposeTypeId == 'PostalPrimary'),
              );
            }
            this.shopNow();
          },
          err => {
            this.shopNow();
            this.widget.showToast(
              this.translation.translate('Something went wrong'),
            );
          },
        );
    }
  }

  shopNow(): void {
    this.store.dispatch(new UpdateCart({ cart: this.customerCart }));
    this.isInStore = true;
    this.getOrderHistory();
    this.getCustomerAnalytics();
  }

  getOrderHistory(vSize?, vIndex?, event?) {
    this.customerId$.pipe(take(1)).subscribe((customerId) => {
    if (
      customerId !== '_NA_'
    ) {
      let viewSize = vSize ? vSize : '10';
      let viewIndex = vIndex ? vIndex : '0';
        //let params = { customerPartyId: this.shoppingCartService.activeShoppingCart.billToCustomerPartyId, viewSize: vSize, viewIndex: vIndex };

      let params = {
        customerPartyId: customerId,
        viewSize,
        viewIndex
      } as any;
      // In case of search
      if (this.keyword) params.orderId = this.keyword
      this.hcProvider
        .callRequest('get', 'orders', params, 'orders', 'all')
        .subscribe(
          (data: any) => {
            if (data.ordersList && data.ordersList.length) {
              this.store.dispatch(new SetOrderHistory({ orderHistory: event ? this.orders.concat(data.ordersList) : data.ordersList }));
              this.orderHistory$.pipe(take(1)).subscribe(orderHistory => {
                this.orders = orderHistory;
                this.filteredOrders = this.orders
                if (event) event.target.complete();
                this.widget.hideLoading();
              });
            } else {
              if (event) { 
                event.target.complete();
                event.target.disabled = true;
              }
              this.widget.hideLoading();
            }
          },
          err => {
            this.widget.showToast(
              this.translation.translate('Something went wrong'),
            );
            if (event) event.target.complete();
            this.widget.hideLoading();
          },
        );
    }
    });
  }

  customerDashboard(customerAnalytics, pageTitle) {
    this.router.navigate(['/customer-dashboard',
      { data: {
          customerAnalytics: customerAnalytics,
          pageTitle: this.translation.translate(pageTitle),
        }
      }
    ]);
  }

  loadMoreOrders(event) {
    this.getOrderHistory(
      '10',
      Math.ceil(this.filteredOrders.length / 10).toString(),
      event
    );
  }

  async endSession() {
    let alert = await this.alertCtrl.create({
      header: this.translation.translate('End Session'),
      message: this.translation.translate("Ending a customer's session will clear their in-store cart. Are you sure you want to continue?"),
      buttons: [
        {
          text: this.translation.translate('Cancel'),
        },
        {
          text: this.translation.translate('End Session'),
          handler: () => {
            this.store.dispatch(new SetOrderHistory({ orderHistory: [] }));
            this.store.dispatch(new PrepareEmptyCart({}));
            this.customerDetails.partyName = '';
            this.customerDetails.primaryPhoneNumber = '';
            this.primaryEmail = {};
            this.primaryPhone = {};
            this.addresses = [];
            this.orders = [];
            this.selectedShipGroups = [];
            this.filteredOrders = [];
            this.storage.remove('browsedProducts');
            this.storage.remove('mostViewedProducts');
            this.storage.remove('suggestedProducts');
          },
        },
      ],
    });
    await alert.present();
  }

  async addAddress() {
    let addressModal = await this.modalCtrl.create({
      component: DeliveryAddressPage
    });
    await addressModal.present();
    addressModal.onDidDismiss().then((data) => {
      this.addresses = this.cart.address
      ? this.cart.address.filter(
          ele =>
            ele.address1 &&
            (ele.contactMechPurposeTypeId == 'PostalShippingDest' ||
              ele.contactMechPurposeTypeId == 'PostalPrimary'),
        )
      : [];
      this.widget.hideLoading();
    })
  }

  filterOrders(shipGroup?: string) {
    // While deselecting the shipGroup chip, that shipGroup should be removed from the selectedShipGroups list
    if (
      this.selectedShipGroups.length &&
      this.selectedShipGroups.includes(shipGroup)
    ) {
      this.selectedShipGroups = this.selectedShipGroups.filter(
        el => el !== shipGroup,
      );
    } else {
      // Otherwise pushed the shipGroup in the list
      if (shipGroup) this.selectedShipGroups.push(shipGroup);
    }
    // While selecting and deselecting the chips, if none of the shipGroup is selected then assign the default orders list
    if(this.selectedShipGroups.length == 0) {
      this.filteredOrders = this.orders;
      return;
    }
    this.filteredOrders = []
    this.orders.forEach(order => {
      if ((this.selectedShipGroups.includes('delivery') && this.customerDataProvider.ifDeliveryItems(order)) ||
        (this.selectedShipGroups.includes('pickup') && this.customerDataProvider.ifStorePickupItems(order)) ||
        (this.selectedShipGroups.includes('instore') && this.customerDataProvider.ifInStoreItems(order))) {
          this.filteredOrders.push(order);
      }
    })
  }

  orderDetail(order) {
    this.router.navigate(["tabs/customer/order-detail"], { state: {...order}} );
  }

  async searchCustomer() {
    const modal = await this.modalCtrl.create({
      component: SearchCustomerPage
    })
    modal.onDidDismiss().then((props) => {
      if (props.data == 'searchedParty') {
        /* After force stop if we navigate to customers tab then we may not get the value of customerId because we are not storing this in storage. Hence
        used the value of billToCustomerPartyId because it can be accessible via storage*/
        this.customerId$.pipe(take(1)).subscribe((customerId) => {
          if (customerId != '_NA_') {
            this.widget.showLoading('');
            this.getCustomerDetail(customerId);
            this.addresses = this.cart.address
              ? this.cart.address.filter(
                  ele =>
                    ele.address1 &&
                    (ele.contactMechPurposeTypeId == 'PostalShippingDest' ||
                      ele.contactMechPurposeTypeId == 'PostalPrimary'),
                )
              : [];
          }

        })
      }
    });
    return await modal.present();
  }

  async editEmail() {
    this.customerId$.pipe(take(1)).subscribe(async (customerId) => {
      const modal = await this.modalCtrl.create({
        component: EditEmailPage,
        componentProps: {
          data: {
            primaryEmail: this.primaryEmail,
            partyId: customerId
          }
        }
      })
    modal.onDidDismiss().then((props: any) => {
      if(props.data && props.data.result) {
        let customerCart = JSON.parse(
          JSON.stringify(this.cart),
        );
        if (props.data.result.contactMechId) {
          // After updating email we need to set the updated detail in the shared variable
          customerCart.address
          .filter(
            ele =>
              ele.infoString &&
              ele.contactMechPurposeTypeId == 'EmailPrimary',
          )
          .map(email => {
            email.contactMechId = props.data.result.contactMechId;
            email.infoString = props.data.updatedEmail;
          });
        }
        // After creating email we need to set the detail in the shared variable
        if (props.data.result.body && props.data.result.body.contactMechId) {
          this.primaryEmail = {
            partyId: customerId,
            infoString: props.data.updatedEmail,
            contactMechId: props.data.result.body.contactMechId,
            contactMechPurposeTypeId: 'EmailPrimary',
            partyTypeId: 'PERSON',
            contactMechTypeId: 'CmtEmailAddress',
            verified: 'Y',
            statusId: 'PARTY_ENABLED',
          };
          customerCart.address.push(
            this.primaryEmail,
          );
        }
        // After updating email we need to set the updated detail in the shared variable
        this.primaryEmail.infoString = props.data.updatedEmail
        customerCart['customer']['emailAddress'] = props.data.updatedEmail;
        // After creating/updating email, set the updated details to the storage using saveCart method.
        this.store.dispatch(new UpdateCart({ cart: customerCart }));
      }
    })
    return await modal.present();
    });
  }

  async editPhone() {
    this.customerId$.pipe(take(1)).subscribe(async (customerId) => {
      const modal = await this.modalCtrl.create({
        component: EditPhonePage,
        componentProps: {
          data: {
            primaryPhone: this.primaryPhone,
            partyId: customerId
          }
        }
      })
      modal.onDidDismiss().then((props: any) => {
      if(props.data && props.data.result) {
        let customerCart = JSON.parse(
          JSON.stringify(this.cart),
        );
        // After updating phoneNumber we need to set the updated detail in the shared variable
        if (props.data.result.contactMechId) {
          customerCart.address
            .filter(
              ele =>
                ele.contactNumber &&
                ele.contactMechPurposeTypeId == 'PhonePrimary',
            )
            .map(phone => {
              phone.contactMechId = props.data.result.contactMechId;
              phone.contactNumber = props.data.updatedPhone;
          });
        }
        // After creating phoneNumber we need to set the detail in the shared variable
        if (props.data.result.body && props.data.result.body.contactMechId) {
          this.primaryPhone = {
            partyId: customerId,
            contactNumber: props.data.updatedPhone,
            contactMechId: props.data.result.body.contactMechId,
            contactMechPurposeTypeId: 'PhonePrimary',
            partyTypeId: 'PERSON',
            contactMechTypeId: 'CmtTelecomNumber',
            verified: 'Y',
            statusId: 'PARTY_ENABLED',
          };
          customerCart.address.push(
            this.primaryPhone,
          );
        }
        // After updating phoneNumber we need to set the updated detail in the shared variable
        this.primaryPhone.contactNumber = props.data.updatedPhone;
        customerCart['customer'][
          'phoneNumber'
        ] = props.data.updatedPhone;
        // After creating/updating phoneNumber, set the updated details to the storage using saveCart method.
        this.store.dispatch(new UpdateCart({ cart: customerCart }));
      }
    });
    return await modal.present();
    });
  }

  searchOrder(event) {
    if (event && event.key === "Enter") {
      this.keyword = event.target.value;
      this.getOrderHistory();
    }
  }

  clearSearchbar() {
    // To get the default list of orders after clearing the searchbar
    this.filteredOrders = this.orders;
  }
}
