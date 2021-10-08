import { Component, Inject, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { ProductProvider } from '../../services/product.provider';
import { environment } from '../../../environments/environment';
import { HcProvider } from '../../services/hc.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { forkJoin, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'page-view-order',
  templateUrl: 'view-order.html',
})
export class ViewOrderPage {

  selectedItems: any = [];
  selectedReason: string = '';
  public unfillableReasons: any[];
  @Input() data: any;
  constructor(
    private modalCtrl: ModalController,
    public translation: L10nTranslationService,
    public productProvider: ProductProvider,
    private hcProvider: HcProvider,
    private widget: WidgetUtils,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.unfillableReasons = environment.UNFILLABLE_REASONS;
    this.selectedReason = this.unfillableReasons[0].id;
  }

  closeModal(): void {
    this.modalCtrl.dismiss({
      'dismissed': true
    })
  }

  selectUnfillableItem(item) {
    if (this.selectedItems.some((el: any) => el.orderItemSeId == item.orderItemSeId)) {
      let removeItemId = this.selectedItems.findIndex(
        (el: any) => el.orderItemSeId == item.orderItemSeId,
      );
      this.selectedItems.splice(removeItemId, 1);
    } else {
      this.selectedItems.push(item);
    }
  }

  unfillableOrderOrItem(items) {
    // Items can either be selected items or entire items of the order
    this.widget.showLoading('')
    this.rejectOrderItem(items).subscribe(responses => {
      let unfillableItems = 0;
      let refreshPickupOrders = responses.find(response => !(response.body._ERROR_MESSAGE_ || response.body._ERROR_MESSAGE_LIST_))
      if(refreshPickupOrders) {
        unfillableItems++;
        let msg = `${unfillableItems} ${unfillableItems == 1 ? this.translation.translate('item was') : this.translation.translate('items were')}` + ' ' + this.translation.translate('canceled from the order') + ' ' + this.data.orderId;
        this.widget.showToast(msg)
        // If we dont get any error in the response then dismiss the modal with param to refresh data on Orders segment
        this.modalCtrl.dismiss('refreshPickupOrders')
      } else {
        this.widget.showToast(this.translation.translate('Something went wrong'));
        this.closeModal();
      }
      this.widget.hideLoading()
    })
  }

  rejectOrderItem(items): Observable<any> {
    let params = {
      "payload": {
        "orderId":this.data.orderId,
        "rejectReason": this.selectedReason
      }
    }
    let unfillableItems = items.map((item: any) => {
      params['payload']['facilityId'] = item.facilityId
      params['payload']['orderItemSeqId'] = item.orderItemSeqId
      params['payload']['shipmentMethodTypeId'] = item.shipmentMethodTypeId
      params['payload']['quantity'] = parseInt(item.inventory[0].quantity)
      return this.hcProvider.callRequest('post', 'rejectOrderItem', params, '', '', 'OMS_URL').pipe(
        catchError(err => {
          throw 'error ' + err;
        })
      )
    });
    return forkJoin(unfillableItems);
  }

}
