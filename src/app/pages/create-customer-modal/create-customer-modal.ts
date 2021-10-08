import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { L10nTranslationService, L10nLocale, L10N_LOCALE } from 'angular-l10n';
import { HcProvider } from '../../services/hc.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { PhoneNumberPipe } from '../../pipes/phone-number/phone-number';
import { Select } from '@ngxs/store';
import { AuthState } from '../../shared/store/auth/auth.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-create-customer-modal',
  templateUrl: 'create-customer-modal.html',
})
export class CreateCustomerModalPage implements OnInit {
  createCustomerForm: FormGroup;
  phoneNumber = '';
  currentStoreData: any;
  @Input() customerName: any
  @Select(AuthState.getCurrentStore) currentStoreData$: Observable<any>;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private translation: L10nTranslationService,
    private hcProvider: HcProvider,
    private widget: WidgetUtils,
    private phone: PhoneNumberPipe,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {}

  ngOnInit() {
    this.customerName = this.customerName.split(' ');
    this.createCustomerForm = this.formBuilder.group({
      firstName: [
        this.customerName.length ? this.customerName[0] : '',
        Validators.required,
      ],
      lastName: [
        this.customerName.length && this.customerName[1] ? this.customerName[1] : '',
        Validators.required,
      ],
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
    };
    this.hcProvider
      .callRequest('post', 'createCommerceCustomer', params)
      .subscribe(
        (data: any) => {
          if (data.body.partyId) {
            // If we get the data then we will hide the loader on SearchCustomer component under onDidDismiss event
            let props = { partyId: data.body.partyId, isSearched: true };
            this.modalCtrl.dismiss(props);
          } else {
            this.widget.hideLoading();
            this.widget.showToast(
              this.translation.translate('Error while creating customer'),
            );
            this.closeModal();
          }
        },
        err => {
          this.widget.hideLoading();
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
