import { Component, Inject } from '@angular/core';
import { CustomerDataProvider } from '../../services/customerdata.provider';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HcProvider } from '../../services/hc.provider';
import { PaymentProvider } from '../../services/payment.provider';
import { L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { Router } from '@angular/router';

@Component({
  selector: 'page-process-return',
  templateUrl: 'process-return.html',
})
export class ProcessReturnPage {
  useCreditOnNextPurchase: boolean = true;
  returnItems = [];
  returnOrder: any = {};
  returnResponseEnumId: string = this.customerDataProvider.returnPaymentMethod[0].id;
  constructor(
    public customerDataProvider: CustomerDataProvider,
    private hcProvider: HcProvider,
    public paymentProvider: PaymentProvider,
    public router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    if(this.router.getCurrentNavigation().extras.state) this.returnOrder = this.router.getCurrentNavigation().extras.state
  }

  addReturnToCart() {
    if (this.useCreditOnNextPurchase) {
      this.prepareReturnItems().then((returnItems: any[]) => {
        // As per the discussion we will replace the display of returnItems with the returnCredit hence no need to add items in cart object.
        // ToDo: We will add payment as per the preference to show the returnCredit on cart page if useCreditOnNextPurchase is selected
        let returnAmount = returnItems.reduce(function(sum, item) {
          return sum + item.unitPrice;
        }, 0);
        let payment = this.paymentProvider.payment.find(paymentItem => paymentItem.paymentMethodTypeId === 'PiOther' );
        if (payment) {
          // There should be only 1 return credit
          payment.maxAmount += returnAmount;
        } else {
          this.paymentProvider.payment.push({
            paymentMethodName: 'Return Credit', // TODO Use appropriate name
            paymentMethodTypeId: 'PiOther', // TODO Use apt method type
            maxAmount: returnAmount,
            iconName: 'account_balance_wallet', // TODO
          });
        }
      });
    }
    this.addItemToReturn().subscribe(data => {
      this.customerDataProvider.processReturn(this.returnOrder.returnId);
      this.router.navigate(['tabs/shopping-cart']);
    });
  }

  prepareReturnItems() {
    return new Promise((resolve, reject) => {
      if (this.returnOrder.returnItems.length) {
        for (let product of this.returnOrder.returnItems) {
          let item = {
            productId: product.productId,
            productName: product.itemDescription,
            parentProductId: product.productId,
            quantity: 1,
            listPrice: product.returnableTotal,
            unitPrice: product.returnableTotal,
            isSale: false,
            imageUrl: product.image,
            features: [],
            alternateImage: '',
            itemAdjustments: [],
            orderItemPriceInfos: [],
            attributes: {},
            contactMechId: '',
            facilityId: '',
            productStock: 0,
            returnReasonId: this.returnOrder.returnReasonEnumId,
            returnPaymentMethodId: this.returnResponseEnumId,
          };
          if (product.size)
            item.features.push({
              description: product.size,
              featureId: 'SIZE',
            });

          if (product.color)
            item.features.push({
              description: product.color,
              featureId: 'COLOR',
            });

          this.returnItems.push(item);
        }
        resolve(this.returnItems);
      }
    });
  }

  addItemToReturn(): Observable<any> {
    let params = {
      returnId: this.returnOrder.returnId,
      orderId: this.returnOrder.orderId,
      returnQuantity: this.returnOrder.returnQuantity,
      returnReasonEnumId: this.returnOrder.returnReasonEnumId,
      returnResponseEnumId: this.returnResponseEnumId,
    };
    let addedReturnItems = this.returnOrder.returnItems.map((el: any) => {
      return this.hcProvider
        .callRequest(
          'post',
          `returns/${this.returnOrder.returnId}/items/orderItem`,
          { ...params, orderItemSeqId: el.orderItemSeId },
        ).pipe(
          catchError(err => {
          throw 'error ' + err;
        })
      )
    });
    return forkJoin(addedReturnItems);
  }
}
