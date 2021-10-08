import { Component, Inject } from '@angular/core';
import { CustomerDataProvider } from '../../services/customerdata.provider';
import { HcProvider } from '../../services/hc.provider';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { AuthState } from '../../shared/store/auth/auth.state';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { L10N_LOCALE, L10nLocale } from 'angular-l10n';

@Component({
  selector: 'page-return-items',
  templateUrl: 'return-items.html',
})
export class ReturnItemsPage {
  order: any = {};
  selectedItems: string[] = [];
  selectedReason: string = this.customerDataProvider.returnReasons[0].id;
  @Select(AuthState.getCurrentStore) currentStoreData$: Observable<any>;
  constructor(
    public customerDataProvider: CustomerDataProvider,
    private hcProvider: HcProvider,
    public router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    if(this.router.getCurrentNavigation().extras.state) this.order = this.router.getCurrentNavigation().extras.state
  }

  ionViewWillEnter() {
    if (this.order && this.order.items.length) {
      // TODO Need to check why items from the returnable items assigned to
      // return items
      this.checkReturnableItems(this.order.items).subscribe(
        data => (this.customerDataProvider.returnOrder.returnItems = data),
      );
      this.currentStoreData$.pipe(take(1)).subscribe(currentStoreData => {
        for (let part of this.order.parts) {
          if (
            part.shipmentMethodEnumId === environment.INSTORE_SHIP_METH &&
            part.facilityId === currentStoreData['facilityId']
          ) {
            this.order.items
              .filter(el => el.orderPartSeqId === part.orderPartSeqId)
              .map(e => (e['posfacilityName'] = part.facilityName));
          } else if (
            part.shipmentMethodEnumId === environment.PICKUP_SHIP_METH &&
            part.facilityId !== currentStoreData['facilityId']
          ) {
            this.order.items
              .filter(el => el.orderPartSeqId === part.orderPartSeqId)
              .map(e => (e['facilityName'] = part.facilityName));
          } else {
            this.order.items
              .filter(el => el.orderPartSeqId === part.orderPartSeqId)
              .map(e => (e['shippingAddress'] = part.shippingAddress));
          }
        }
      });
    }
  }

  selectReturnItem(item) {
    if (
      this.selectedItems.some(
        (el: any) => el.orderItemSeId == item.orderItemSeId,
      )
    ) {
      this.customerDataProvider.returnOrder.eligibleReturnAmount -= parseFloat(
        item.returnableTotal,
      );
      let removeItemId = this.selectedItems.findIndex(
        (el: any) => el.orderItemSeId == item.orderItemSeId,
      );
      this.selectedItems.splice(removeItemId, 1);
    } else {
      this.customerDataProvider.returnOrder.eligibleReturnAmount += parseFloat(
        item.returnableTotal,
      );
      this.selectedItems.push(item);
    }
  }

  initReturn() {
    this.customerDataProvider.returnOrder.currencyUomId = this.order.currencyUomId;
    this.customerDataProvider.returnOrder.returnReasonEnumId = this.selectedReason;
    this.customerDataProvider.returnOrder.returnItems = this.selectedItems;
    this.router.navigate(["process-return"], { state:{...this.customerDataProvider.returnOrder}} );
  }

  checkReturnableItems(orderItems: any[]): Observable<any> {
    let returnableItems = orderItems.map((item: any) => {
      return this.hcProvider
        .callRequest('get', 'returns/returnableItem', {
          orderId: this.order.orderId,
          orderItemSeqId: item.orderItemSeId,
        }).pipe(map((el: any) => {
          item['returnableTotal'] = el.returnableTotal;
          item['returnableQuantity'] = el.returnableQuantity;
          return item;
        }),
        catchError(err => {
          throw 'error ' + err;
        })
      )
    });
    return forkJoin(returnableItems);
  }
}
