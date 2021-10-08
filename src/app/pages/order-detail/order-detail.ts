import { Component, Inject } from '@angular/core';
import {
  ActionSheetController,
} from '@ionic/angular';
import { L10N_LOCALE, L10nLocale } from 'angular-l10n'
import { CustomerDataProvider } from '../../services/customerdata.provider';
import { Router } from '@angular/router';

@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  order: any = {};
  constructor(
    private actionSheetCtrl: ActionSheetController,
    public customerDataProvider: CustomerDataProvider,
    private router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    if(this.router.getCurrentNavigation().extras.state) this.order = this.router.getCurrentNavigation().extras.state
  }

  async options() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Return or exchange',
          icon: 'arrow-undo',
          handler: () => {},
        },
        {
          text: 'Reorder',
          icon: 'sync-outline',
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  }
}
