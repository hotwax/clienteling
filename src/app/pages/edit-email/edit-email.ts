import { Component, ViewChild, Input, Inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { HcProvider } from '../../services/hc.provider';
import { WidgetUtils } from '../../shared/widget.util';


@Component({
  selector: 'page-edit-email',
  templateUrl: 'edit-email.html',
})
export class EditEmailPage implements OnInit {

  @ViewChild('autoFocus') autoFocus: any;
  @Input() data: any;
  emailAddress: string = '';
  isValid: boolean = false;

  constructor(
    private translation: L10nTranslationService,
    private modalCtrl: ModalController,
    private hcProvider: HcProvider,
    private widget: WidgetUtils,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {}

  ngOnInit() {
    this.emailAddress = this.data.primaryEmail.infoString ? this.data.primaryEmail.infoString : '';
  }

  ionViewWillEnter() {
    this.widget.setAutoFocus(this.autoFocus);
  }

  closeModal(): void {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  validateEmail(email): void {
    this.isValid = email.match('[A-Za-z0-9._%+-]{2,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})') ? true : false;
  }

  editEmail() {
    let params = {
      emailAddress: this.emailAddress,
      partyId: this.data.partyId,
      contactMechPurposeId: 'EmailPrimary'
    };
    let method = 'post';
    if (this.data.primaryEmail && this.data.primaryEmail.contactMechId) {
    // For updating emailAddress, improve the in-param and method type accordingly
      params['contactMechId'] = this.data.primaryEmail.contactMechId;
      params['infoString'] = this.emailAddress;
      method = 'put';
    }
    this.hcProvider.callRequest(method, 'emailAddress', params)
    .subscribe((result: any) => {
        if((result && result.contactMechId) || (result.body && result.body.contactMechId)) {
          let props = { result: result, updatedEmail: this.emailAddress }
          this.modalCtrl.dismiss(props);
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
