import { Component, Inject, ViewChild } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';
import { HcProvider } from '../../services/hc.provider';
import { CreateCustomerModalPage } from '../create-customer-modal/create-customer-modal';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { WidgetUtils } from '../../shared/widget.util';
import { CustomerDataProvider } from '../../services/customerdata.provider';
import { SetIsSearched, SetPartyId } from '../../shared/store/customer/customer.action';
import { Store } from '@ngxs/store';

@Component({
  selector: 'page-search-customer',
  templateUrl: 'search-customer.html',
})
export class SearchCustomerPage {
  @ViewChild('autoFocus') autoFocus: any;
  public customers: any = [];
  private viewIndex: any = 0;
  isSearched = false;
  keyword: string = '';

  constructor(
    private hcProvider: HcProvider,
    private widget: WidgetUtils,
    private translation: L10nTranslationService,
    private modalCtrl: ModalController,
    public customerDataProvider: CustomerDataProvider,
    private store: Store,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {}

  public getCustomers(keyword, viewIndex) {
    /* As keyup.enter is not supported in iOS v13.0 and above hence replacing it with key press*/
    return new Promise((resolve, reject) => {
      let params = { viewIndex: viewIndex, keyword: keyword };
      this.hcProvider
        .callRequest('get', 'searchCustomers', params, 'searchCustomers', 'all')
        .subscribe(
          (data: any) => {
            resolve(data);
          },
          err => {
            this.widget.showToast(
              this.translation.translate('Something went wrong'),
            );
            reject(err);
          },
        );
    });
  }

  searchCustomer(event) {
    if (event && event.key === "Enter") {
      this.keyword = event.target.value;
      this.isSearched = true;
      this.viewIndex = 0;
      this.customers = [];
      this.widget.showLoading('');
      this.getCustomers(this.keyword, this.viewIndex).then((data: any) => {
        if (data.docs.length) {
          this.customers = data.docs;
        }
        this.widget.hideLoading();
      }).catch(err => {
        this.widget.hideLoading()
        console.error(err);
      });
    }
  }

  clearSearchbar() {
    this.keyword = '';
    this.customers = [];
  }

  loadMoreCustomer(event, keyword) {
    this.viewIndex = this.viewIndex + 1;
    this.getCustomers(keyword, this.viewIndex).then((data: any) => {
      if (data.docs.length) {
        this.customers = this.customers.concat(data.docs);
      }
      event.target.complete();
    }).catch(err => {
      event.target.complete();
      console.error(err);
    });
  }

  ionViewWillEnter() {
    this.widget.setAutoFocus(this.autoFocus);
  }

  public getCustomerDetail(partyId): void {
    // As per design mockup we dont need to navigate to customer page instead, customer page will be a root page on the second tab.
    this.store.dispatch(new SetIsSearched({ isSearched: this.isSearched }));
    this.store.dispatch(new SetPartyId({ partyId }));
    // TODO Check why isSearched is needed
    this.modalCtrl.dismiss('searchedParty')
  }

  async createCustomer() {
    const modal = await this.modalCtrl.create({
      component: CreateCustomerModalPage,
      componentProps: {
        customerName: this.keyword
      }
    })
    modal.onDidDismiss().then((props: any) => {
      if (props.data) {
        this.store.dispatch(new SetIsSearched({ isSearched: props.data.isSearched }));
        this.store.dispatch(new SetPartyId({ partyId: props.data.partyId }));
        // TODO Check why isSearched is needed
        this.modalCtrl.dismiss('searchedParty')
        this.widget.hideLoading();
      }
    });
    return await modal.present();
  }

  back(): void {
    this.modalCtrl.dismiss({
      'dismissed': true
    })
  }
}
