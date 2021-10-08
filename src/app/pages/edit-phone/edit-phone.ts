import { Component, ViewChild, Input, Inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { PhoneNumberPipe } from '../../pipes/phone-number/phone-number';
import { environment } from '../../../environments/environment'
import { HcProvider } from '../../services/hc.provider';
import { WidgetUtils } from '../../shared/widget.util';

@Component({
  selector: 'page-edit-phone',
  templateUrl: 'edit-phone.html',
})
export class EditPhonePage implements OnInit{

  @ViewChild('autoFocus') autoFocus: any;
  @Input() data: any;
  phoneNumber: string = '';
  isValid: boolean = false;

  constructor(
    private translation: L10nTranslationService,
    private modalCtrl: ModalController,
    private phoneNumberPipe: PhoneNumberPipe,
    private hcProvider: HcProvider,
    private widget: WidgetUtils,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {}

  ngOnInit() {
    this.phoneNumber = this.data.primaryPhone.contactNumber ? this.data.primaryPhone.contactNumber : '';
  }

  ionViewWillEnter() {
    this.widget.setAutoFocus(this.autoFocus);
  }

  closeModal(): void {
    this.modalCtrl.dismiss({
      'dismissed': true
    })
  }

  validatePhone(phoneNumber) {
    this.isValid = phoneNumber.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) ? true : false
  }

  editPhone() {
    this.widget.showLoading('');
    let params = {
      areaCode: this.phoneNumberPipe.unMaskPhoneNumber(this.phoneNumber).substring(0,3),
      contactNumber: this.phoneNumberPipe.unMaskPhoneNumber(this.phoneNumber).substring(3, 10),
      countryCode: this.phoneNumberPipe.getCountryCode(environment.DEFAULT_COUNTRY),
      partyId: this.data.partyId,
      contactMechPurposeId: 'PhonePrimary'
    };
    let method = 'post';
    if (this.data.primaryPhone && this.data.primaryPhone.contactMechId) {
      // For updating phoneNumber, improve the in-param and method type accordingly
      params['contactMechId'] = this.data.primaryPhone.contactMechId;
      method = 'put';
    }
    this.hcProvider.callRequest(method, 'telecomNumber', params)
      .subscribe((result: any) => {
        if((result && result.contactMechId) || (result.body && result.body.contactMechId)) {
          if('CmtlNew' == (result.trustLevelEnumId || result.body.trustLevelEnumId)) {
            let data = { result: result, updatedPhone: this.phoneNumber }
            this.modalCtrl.dismiss(data);
          } else {
            this.widget.showToast(result.messages);
            this.closeModal();
          }
        }
        this.widget.hideLoading();
      }, err => {
        this.widget.hideLoading();
        this.closeModal();
        this.widget.showToast(
          this.translation.translate('Something went wrong'),
        );
      }
    )
  }

}
