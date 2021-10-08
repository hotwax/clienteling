import { Component, Inject, Input, NgZone, OnInit } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { MapsAPILoader } from '@agm/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HcProvider } from '../../services/hc.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { PhoneNumberPipe } from '../../pipes/phone-number/phone-number'
import { take } from 'rxjs/operators';
import { Select, Store  } from '@ngxs/store';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';
import { ShoppingCart } from '../../models/shopping-cart/shopping.cart';
import { Observable } from 'rxjs';
import { AddToCart, UpdateCart } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { CustomerState } from '../../shared/store/customer/customer.state';

declare var google: any;

@Component({
  selector: 'page-delivery-address',
  templateUrl: 'delivery-address.html',
})
export class DeliveryAddressPage implements OnInit {
  addAddress: FormGroup;
  addressObj: any;
  countries: any[] = [];
  states: any;
  @Input() product: any = {};
  cart: ShoppingCart;
  @Select(ShoppingCartState.getCart) cart$: Observable<any>;
  @Select(CustomerState.getPartyId) customerId$: Observable<any>;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private translation: L10nTranslationService,
    private modalCtrl: ModalController,
    public zone: NgZone,
    private formBuilder: FormBuilder,
    private hcProvider: HcProvider,
    public widget: WidgetUtils,
    private phone: PhoneNumberPipe,
    private store: Store,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
  this.cart$.pipe(take(1)).subscribe((cart) => {
  this.cart = cart;
    this.addressObj = {
      toName:
          cart.customer.partyName.split(
          ' ',
        )[0] || '',
      attnName:
          cart.customer.partyName.split(
          ' ',
        )[1] || '',
      route: '',
      sublocality_level_1: '',
      administrative_area_level_2: '',
      administrative_area_level_1: '',
      postal_code: '',
      country: '',
      deliveryInDays: 'five',
      payment : 'payNow',
      isBusinessAddress : false,
      phoneNumber:
        this.phone.transform(
          cart.customer.phoneNumber,
        ) || '',
    };
    if (
      cart.billToCustomerPartyId !==
      '_NA_'
    ) {
      this.addAddress = this.formBuilder.group({
        toName: [
          this.addressObj.toName || '',
          [Validators.required, Validators.minLength(2)],
        ],
        attnName: [this.addressObj.attnName || ''],
        phoneNumber: [
          this.addressObj.phoneNumber || '',
          [
            Validators.maxLength(14),
            Validators.minLength(10),
            Validators.pattern(
              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
            ),
          ],
        ],
        address1: ['', [Validators.required, Validators.minLength(2)]],
        address2: [''],
        city: ['', Validators.required],
        stateProvinceGeoId: [''],
        countryGeoId: new FormControl({value: [''], disabled: true}),
        postalCode: ['', Validators.required],
        partyId: [''],
        contactMechPurposeTypeId: [''],
        latitude: [''],
        longitude: [''],
        contactMechId: [''],
        isBusinessAddress: [],
      });
    } else {
      this.addAddress = this.formBuilder.group({
        toName: [''],
        attnName: [''],
        phoneNumber: [
          '',
          [
            Validators.maxLength(14),
            Validators.minLength(10),
            Validators.pattern(
              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
            ),
          ],
        ],
        address1: ['', [Validators.required, Validators.minLength(2)]],
        address2: [''],
        city: ['', Validators.required],
        stateProvinceGeoId: [''],
        countryGeoId: new FormControl({value: [''], disabled: true}),
        postalCode: ['', Validators.required],
        partyId: [''],
        contactMechPurposeTypeId: [''],
        latitude: [''],
        longitude: [''],
        contactMechId: [''],
        isBusinessAddress: [],
      });
    }
    this.hcProvider.callRequest('post', 'DoingBusinessInCountries').subscribe(
      (data: any) => {
        if (data) {
          this.countries = data.doingBusinessInCountries;
          if (this.countries.length) {
            for (let country of this.countries) {
              let code = country.geoId;
              this.states = data.stateAssocMap[code];
            }
          }
        }
        this.addressObj.administrative_area_level_1 = this.states
          ? this.states[0].geoName
          : '';
        this.addressObj.country = this.countries
          ? this.countries[0].geoName
          : '';
      },
      err => {
        this.widget.showToast(this.translation.translate('Something went wrong'));
      });
    });

    this.addAddress.get('phoneNumber').valueChanges.subscribe(val => {
      let formatePhoneNumber = this.phone.transform(val);
      this.addressObj.phoneNumber = formatePhoneNumber;
    });
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      let nativeHomeInputBox = document
        .getElementById('searching')
        .getElementsByTagName('input')[0];
      let autocomplete = new google.maps.places.Autocomplete(
        nativeHomeInputBox,
        {
          types: ['address'],
        },
      );
      autocomplete.addListener('place_changed', () => {
        this.zone.run(() => {
          let place = {};
          let placeObj = autocomplete.getPlace().address_components;
          placeObj.map((el: any) => (place[el.types[0]] = el.long_name));
          this.addressObj['route'] = place['street_number']
            ? `${place['street_number']} ${place['route']}`
            : place['route'];
          this.addressObj['sublocality_level_1'] =
            place['sublocality_level_1'] || '';
          this.addressObj['administrative_area_level_2'] =
            place['locality'] || place['administrative_area_level_2'] || '';
          this.addressObj['administrative_area_level_1'] =
            place['administrative_area_level_1'] || '';
          this.addressObj['postal_code'] = place['postal_code'] || '';
          this.addressObj['country'] = place['country'] || '';
        });
      });
    });
  }

  /* getMyLocation(autocomplete) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy,
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  } */

  saveAddress(form: any, address: any): void {
    this.product.attributes = {
      TRUSTEE_NAME: this.addressObj.toName,
      TRUSTEE_PHONE: this.addressObj.phoneNumber,
    };
    form['stateProvinceGeoId'] = this.states.find(
      el => el.geoName == address.administrative_area_level_1,
    )['geoId'];
    form['countryGeoId'] = this.countries.find(
      el => el.geoName == address.country,
    )['geoId'];
    form[
      'partyId'
    ] = this.cart.billToCustomerPartyId;
    form['contactMechPurposeTypeId'] = 'PostalShippingDest';
    delete form.isBusinessAddress;
    this.hcProvider
      .callRequest('post', 'createPartyPostalAddress', form)
      .subscribe(
        (data: any) => {
          this.widget.showLoading('');
          data.body['phoneNumber'] = form.phoneNumber;
          this.cart.address.push(data.body);
          this.store.dispatch(new UpdateCart({ cart: this.cart }));
          if (this.product && this.product.productId) {
            let address = `${data.body.address1}, ${data.body.city} ${data.body.postalCode}`;
            this.store.dispatch(new AddToCart({ 
              item: this.product, 
              contactMechId: data.body.contactMechId, 
              address: address
            }));
          }
          this.closeModal();
        },
        err => {
          this.widget.showToast(this.translation.translate('Something went wrong'));
        },
      );
  }

  closeModal(): void {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
