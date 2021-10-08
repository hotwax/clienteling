import { Component, Inject } from '@angular/core';
import {
  NavParams,
  ModalController,
} from '@ionic/angular';
import { L10nLocale, L10N_LOCALE} from 'angular-l10n';

@Component({
  selector: 'page-stores',
  templateUrl: 'stores.html',
})
export class StoresPage {
  stores: any = [];
  filteredStore: any;
  isStoreSelected: boolean = false;
  selectedStore: any;

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    if (this.navParams.get('data')) {
      this.stores = this.navParams.get('data');
      this.filteredStore = this.stores;
    }
  }

  getFilteredStore(ev) {
    // Reset filteredStore back to all of the stores
    this.filteredStore = this.stores;
    // set enteredStore to the value of the ev target
    let enteredStore = ev.target.value;
    //if the value is an empty string don't filter the items
    if (enteredStore && enteredStore.trim() != '') {
      this.filteredStore = this.stores.filter(item => {
        return (
          item.storeName.toLowerCase().indexOf(enteredStore.toLowerCase()) > -1
        );
      });
    }
  }

  back(): void {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  setStore(store) {
    this.modalCtrl.dismiss(store)
  }

  checkStatus(): void {
    // Initially the save button will be disabled using isStoreSelected flag, after selecting the store set the value of flag to true
    if (this.selectedStore) {
      this.isStoreSelected = true;
    }
  }
}
