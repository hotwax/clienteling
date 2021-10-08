import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { WidgetUtils } from '../shared/widget.util';
import { Store } from '@ngxs/store';
import { HcProvider } from './hc.provider';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { forkJoin, Observable} from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
// import { CustomerAnalyticsProvider } from 'customer-analytics';

@Injectable({
  providedIn: 'root',
})
export class CustomerDataProvider {
  public customerProfileUrl: string;
  private orderHistory$: Observable<any>;
  public returnReasons: any[];
  public returnOrder: any = {};
  public returnPaymentMethod = [];
  constructor(
    // private customerAnalyticsProvider: CustomerAnalyticsProvider,
    private widget: WidgetUtils,
    private hcProvider: HcProvider,
    private store: Store,
    private translation: L10nTranslationService,
  ) {
    if (
      environment.hasOwnProperty('CUSTOMER_ANALYTICS') &&
      environment.CUSTOMER_ANALYTICS.trim() !== ''
    ) {
      this.customerProfileUrl = environment.CUSTOMER_ANALYTICS;
    }
    this.orderHistory$ = this.store.select(
      state => state.customer.orderHistory,
    );
    // Assuming both list i.e returnReasons and returnPaymentMethod  will come from API
    this.returnReasons = environment.RETURN_REASONS;
    this.returnPaymentMethod = environment.RETURN_PAYMENT_METHODS;
  }

  getBrowsedProduct(email) {
    return new Promise((resolve, reject) => {
      /* this.customerAnalyticsProvider
        .getCustomerAnalytics(this.customerProfileUrl, 'raa_reco_browsing', email)
        .then((response: any) => {
          if (response.code == 1) {
            if (response.data.length > 0) {
              this.getProducts(response.data).subscribe(
                res => {
                  resolve(res);
                },
                err => {
                  console.log(err);
                  resolve([]);
                },
              );
            }
          } else {
            this.widget.showToast(response.message);
            resolve([]);
          }
        })
        .catch(error => {
          console.log(error);
          resolve([]);
        }); */
    });
  }

  getMostViewedProduct(email) {
    return new Promise((resolve, reject) => {
      /* this.customerAnalyticsProvider
        .getCustomerAnalytics(this.customerProfileUrl, 'raa_reco_trending', email)
        .then((response: any) => {
          if (response.code == 1) {
            if (response.data.length > 0) {
              this.getProducts(response.data).subscribe(
                res => {
                  resolve(res);
                },
                err => {
                  console.log(err);
                  resolve([]);
                },
              );
            }
          } else {
            this.widget.showToast(response.message);
            resolve([]);
          }
        })
        .catch(error => {
          console.log(error);
          resolve([]);
        }); */
    });
  }

  getSuggestedProduct(email) {
    return new Promise((resolve, reject) => {
      /* this.customerAnalyticsProvider
        .getCustomerAnalytics(this.customerProfileUrl, 'raa_reco_self', email)
        .then((response: any) => {
          if (response.code == 1) {
            if (response.data.length > 0) {
              this.getProducts(response.data).subscribe(
                res => {
                  resolve(res);
                },
                err => {
                  console.log(err);
                  resolve([]);
                },
              );
            }
          } else {
            this.widget.showToast(response.message);
            resolve([]);
          }
        })
        .catch(error => {
          console.log(error);
          resolve([]);
        }); */
    });
  }

  initReturnOrder() {
    this.returnOrder = {
      eligibleReturnAmount: 0,
      returnId: '',
      orderId: '',
      returnItems: [],
      returnReasonEnumId: '',
      returnResponseEnumId: '',
      returnQuantity: 1,
      currencyUomId: '',
    };
  }

  processReturn(returnId) {
    this.hcProvider
      .callRequest(
        'put',
        'returns/' + returnId + '/receiveReturnWithoutShipment',
        { returnId: returnId },
      )
      .subscribe(
        data => {
          let text = ` ${this.translation.translate('Return completed')} ${
            this.returnOrder.eligibleReturnAmount
          } ${this.translation.translate('Refunded').toLowerCase()}`;
          this.widget.showToast(text);
          this.initReturnOrder;
        },
        err => {
          console.log(err);
        },
      );
  }

  getProducts(products: any[]): Observable<any> {
    let productObservables = products.map((product: any) => {
      return this.hcProvider.callRequest('get', 'searchProducts/'+ product.sku, 'products').pipe(
        map((el: any) => {
          product['imageurl'] = el.images.main.small;
          return product;
        }),
        catchError(err => {
          throw 'error ' + err;
        })
      )
    });
    return forkJoin(productObservables);
  }

  getReturnReason(id): string {
    let reason = this.returnReasons.find(el => el.id == id);
    return reason ? reason.label : '';
  }

  getReturnPaymentMethod(id): string {
    let paymentMethod = this.returnPaymentMethod.find(el => el.id == id);
    return paymentMethod ? paymentMethod.label : '';
  }

  searchOrder(keyword: string): any[] {
    let filteredlist = [];
    this.orderHistory$.pipe(take(1)).subscribe(orderHistory => {
      filteredlist = orderHistory.filter(
      el =>
        el.orderId.includes(keyword) ||
        el.items.some(el =>
          el.itemDescription.toLowerCase().includes(keyword.toLowerCase()),
        ),
      );
    })
    return filteredlist;
  }

  /* * Following 3 methods are used to display the list-header as 'In-Store', 'Delivery' and 'Pickup items'
   *  on the order card as per the existence of items.
   */

  ifInStoreItems(order) {
    return order.parts.some(part => {
      return this.isInStoreShipGroup(part);
    })
  }

  ifDeliveryItems(order) {
    return order.parts.some(part => {
      return this.isDeliveryShipGroup(part);
    })
  }

  ifStorePickupItems(order) {
    return order.parts.some(part => {
      return this.isStorePickupShipGroup(part);
    })
  }

  /** Following 3 method are used to check the shipGroup of orderItems as per the shipmentMethodEnumId.
   * Implemented these method, so that in-future if we need to update the condition then these will be the
   * centralized place to maintain the code.
   */
  isInStoreShipGroup(part){
    return part.shipmentMethodEnumId === environment.INSTORE_SHIP_METH;
  }

  isDeliveryShipGroup(part){
    return part.shipmentMethodEnumId !== environment.PICKUP_SHIP_METH &&
    part.shipmentMethodEnumId !== environment.INSTORE_SHIP_METH;
  }

  isStorePickupShipGroup(part){
    return part.shipmentMethodEnumId === environment.PICKUP_SHIP_METH;
  }

  // Returns list of in store items in an order
  getInStoreItems(order) {
    let orderParts = order.parts.filter(part => {
      return this.isInStoreShipGroup(part);
    }).map(ele => ele.orderPartSeqId);
    let partItemSeqIds = orderParts.length ?
      order.items.filter(item => orderParts.includes(item.orderPartSeqId)).map(item => item.orderPartSeqId)
      : [];
    return partItemSeqIds.length ? order.items.filter(item => partItemSeqIds.includes(item.orderPartSeqId)) : [];
  }

  // Returns list of delivery items in an order
  getDeliveryItems(order) {
    let orderParts = [];
    for(let part of order.parts) {
      if (
        this.isDeliveryShipGroup(part)
      ) {
          // To display the dlivery address on the card, mapped data as per the orderParts
          orderParts = order.items.filter(el => el.orderPartSeqId === part.orderPartSeqId)
          .map(item => {
            (item['shippingAddress'] = part.shippingAddress)
            return item;
        });
      }
    }
    let partItemSeqIds = orderParts.length ? order.items.filter(item => orderParts.find( e => e.orderPartSeqId === item.orderPartSeqId))
      .map(item => item.orderPartSeqId) : [];
    return partItemSeqIds.length ? order.items.filter(item => partItemSeqIds.includes(item.orderPartSeqId)) : [];
  }

  // Returns list of store-pickup items in an order
  getStorePickupItems(order) {
    let orderParts = [];
    for(let part of order.parts) {
      if (
        this.isStorePickupShipGroup(part)
      ) {
          // To display the pickup facilityName on the card, mapped data as per the orderParts
          orderParts = order.items.filter(el => el.orderPartSeqId === part.orderPartSeqId)
            .map(item => {
            (item['facilityName'] = part.facilityName)
            return item;
        });
      }
    }
    let partItemSeqIds = orderParts.length ? order.items.filter(item => orderParts.find( e => e.orderPartSeqId === item.orderPartSeqId))
      .map(item => item.orderPartSeqId) : [];
    return partItemSeqIds.length ? order.items.filter(item => partItemSeqIds.includes(item.orderPartSeqId)) : [];
  }

}