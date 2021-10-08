import { Component, Inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HcProvider } from '../../services/hc.provider';
import { ViewOrderPage } from '../view-order/view-order';
import { AuthState } from '../../shared/store/auth/auth.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WidgetUtils } from '../../shared/widget.util';
import { Router } from '@angular/router';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import * as moment from "moment-timezone";


@Component({
  styleUrls: ['order-fulfillment.scss'],
  templateUrl: 'order-fulfillment.html',
})
export class OrderFulfillmentPage {
  @Select(AuthState.getCurrentStore) currentStoreData$: Observable<any>;

  orders: any[] = [];
  packedOrders: any[] = [];
  pickupSegment: string = 'orders';
  currentStoreData: any;
  viewSize: number = 10;
  pickupViewIndex: number = 0;
  packedViewIndex: number = 0;
  orderId = "";
  moment: any = moment;

  constructor(
    private hcProvider: HcProvider,
    private widget: WidgetUtils,
    public translation: L10nTranslationService,
    private modalCtrl: ModalController,
    public router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) { }

  clearSearchbar() {
    this.orderId = ""; // TODO Check why the value of orderId is not changed when the search bar is cleared
    this.search();
  }

  search() {
    this.pickupSegment === 'orders' ? this.getPickupOrders() : this.getPackedOrders();
  }

  ionViewWillEnter() {
    this.currentStoreData$.subscribe(currentStoreData => {
      this.currentStoreData = currentStoreData;
    });
    if(!this.widget.isLoading) this.widget.showLoading('');
    this.pickupSegment === 'orders' ? this.getPickupOrders() : this.getPackedOrders();
  }

  pickupSegmentChanged(ev) {
    this.pickupSegment = ev.detail.value;
    this.pickupSegment === 'orders' ? this.getPickupOrders() : this.getPackedOrders(); if(!this.widget.isLoading) this.widget.showLoading('');
  }

  getPickupOrders(viewIndex?, event?) {
    let vIndex = viewIndex ? viewIndex : '0';
    let params = {
      sortBy: 'orderDate',
      sortOrder: 'Desc',
      viewSize: this.viewSize,
      viewIndex: vIndex,
      facilityId: this.currentStoreData.externalFacilityId
    };
    if (this.orderId) params["orderId"] = this.orderId;
    this.hcProvider
      .callRequest('get', 'wms-orders', params, '', '', 'OMS_URL')
      .subscribe((data: any) => {
        if(event && data.docs) {
          this.orders.push.apply(this.orders, data.docs);
          event.target.complete();
        } else {
          if(data && data.docs) this.orders = data.docs;
        }
        this.widget.hideLoading();
      }, err => {
        // If there is some error in API response then also we need to complete an event
        if (event) {
          event.target.complete();
        }
        console.log(err)
        this.widget.hideLoading();
      });
  }

  getPackedOrders(viewIndex?, event?) {
    let vIndex = viewIndex ? viewIndex : '0';
    let params = {
      sortBy: 'createdDate',
      sortOrder: 'Desc',
      viewSize: this.viewSize,
      viewIndex: vIndex,
      facilityId: this.currentStoreData.externalFacilityId
    };
    if (this.orderId) params["orderId"] = this.orderId;
    this.hcProvider
      .callRequest('get', 'readytoshiporders', params, '', '', 'OMS_URL')
      .subscribe((data: any) => {
        if (event && data.docs) {
          this.packedOrders.push.apply(this.packedOrders, data.docs);
          event.target.complete();
        } else {
          if(data && data.docs) this.packedOrders = data.docs;
        }
        this.widget.hideLoading();
      }, err => {
        console.log(err)
        if(event) {
          event.target.complete();
        }
        this.widget.hideLoading();
      });
  }

  getShipGroups(items) {
    // To get unique shipGroup, further it will use on ion-card iteration
    return Array.from(new Set(items.map(ele => ele.shipGroupSeqId)))
  }

  getShipGroupItems(shipGroupSeqId, items) {
    // To get all the items of same shipGroup, further it will use on pickup-order-card component to display line items
    return items.filter(item => item.shipGroupSeqId == shipGroupSeqId)
  }

  getShipmentMethod(shipGroupSeqId, items) {
   /* To display the button label as per the shipmentMethodTypeId, this will only used on orders segment.
      Because we get the shipmentMethodTypeId on items level in wms-orders API.
      As we already get shipmentMethodTypeId on order level in readytoshiporders API hence we will not use this method on packed orders segment.
   */
    return items.find(ele => ele.shipGroupSeqId == shipGroupSeqId).shipmentMethodTypeId
  }

  loadMorePickupOrders(event) {
    this.pickupViewIndex = Math.ceil((this.pickupViewIndex * this.viewSize + 1) / this.viewSize);
    this.getPickupOrders(this.pickupViewIndex, event)
  }

  loadMorePackedOrders(event) {
    this.packedViewIndex = Math.ceil((this.packedViewIndex * this.viewSize + 1) / this.viewSize);
    this.getPackedOrders(this.packedViewIndex, event)
  }

  quickShipEntireShipGroup(order, shipGroupSeqId) {
    // In case of success this loader will be hide in getPickupOrders method
    this.widget.showLoading('')
    /* As per the scope of app, order with single ship group will be listed in the app. But to manage the corner case scenario we will call
     quickShipEntireShipGroup API along with the shipGroupSeqId.
    */
    let params = {
      orderId: order.orderId,
      setPackedOnly: 'Y',
      dimensionUomId: 'WT_kg',
      shipmentBoxTypeId: 'YOURPACKNG',
      weight: '1',
      weightUomId: 'WT_kg',
      facilityId: this.currentStoreData.externalFacilityId,
      shipGroupSeqId: shipGroupSeqId
    }
    this.hcProvider.callRequest('post', 'quickShipEntireShipGroup', params, '', '', 'OMS_URL')
      .subscribe((data: any) => {
        if(data.body._EVENT_MESSAGE_) {
          // As per the recent improvements on the server side, we need to explicitly pack the delivery items.
          if(this.getShipmentMethod(shipGroupSeqId, order.items) !== 'STOREPICKUP') {
            let shipmentId = data.body._EVENT_MESSAGE_.match(/\d+/g)[0]
            this.packDeliveryItems(shipmentId).subscribe((data: any) => {
              if(!data.body._EVENT_MESSAGE_) this.widget.showToast(this.translation.translate('Something went wrong'));
            })
          }
          this.getPickupOrders();
          this.widget.showToast(this.translation.translate('Order packed and ready for delivery'));
        } else {
          this.widget.hideLoading();
          this.widget.showToast(this.translation.translate('Something went wrong'));
        }
    }, err => {
      console.log(err)
      this.widget.hideLoading();
    });
  }

  packDeliveryItems(shipmentId) {
    let params = {
      shipmentId: shipmentId,
      statusId: 'SHIPMENT_PACKED'
    }
    return this.hcProvider.callRequest('post', 'updateShipment', params, '', '', 'OMS_URL')
  }

  deliverShipment(order) {
    // In case of success this loader will be hide in getPackedOrders method
    this.widget.showLoading('');
    let params = {
      shipmentId: order.shipmentId,
      statusId: 'SHIPMENT_SHIPPED'
    }
    this.hcProvider.callRequest('post', 'updateShipment', params, '', '', 'OMS_URL').subscribe((data: any) => {
      if(data.body._EVENT_MESSAGE_) {
        this.getPackedOrders();
        let msg = this.translation.translate('Order delivered to') + ' ' + order.customerName;
        this.widget.showToast(msg);
      } else {
        this.widget.hideLoading();
        this.widget.showToast(this.translation.translate('Something went wrong'));
      }
    }, err => {
      console.log(err)
      this.widget.hideLoading();
    })
  }

  async viewPickupOrder(orderId, items) {
    const modal = await this.modalCtrl.create({
      component: ViewOrderPage,
      componentProps: {
        data: {
          orderId: orderId,
          items: items
        }
      }
    })
    modal.onDidDismiss().then((props) => {
      if (props.data == 'refreshPickupOrders') {
        this.getPickupOrders();
      }
    });
    return await modal.present();
  }

  dashboard() {
    this.router.navigate(['/dashboard'])
  }

}
