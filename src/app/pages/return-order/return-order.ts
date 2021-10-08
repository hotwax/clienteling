import { Component, Inject } from '@angular/core';
import { CustomerDataProvider } from '../../services/customerdata.provider';
import { HcProvider } from '../../services/hc.provider';
import { CustomerState } from '../../shared/store/customer/customer.state';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';
import { Store, Select } from '@ngxs/store';
import { ShoppingCart } from '../../models/shopping-cart/shopping.cart';
import {
  SetOrderHistory
} from '../../shared/store/customer/customer.action';
import { Router } from '@angular/router';
import { L10N_LOCALE, L10nLocale} from 'angular-l10n'
import { WidgetUtils } from '../../shared/widget.util';

@Component({
  selector: 'page-return-order',
  templateUrl: 'return-order.html',
})
export class ReturnOrderPage {
  orders: any[] = [];
  filteredOrders: any[] = []
  keyword: string = '';
  @Select(CustomerState.getOrderHistory) orderHistory$: Observable<any>;
  cart: ShoppingCart;
  @Select(ShoppingCartState.getCart) cart$: Observable<any>;
  @Select(CustomerState.getPartyId) customerPartyId$: Observable<any>;
  constructor(
    private customerDataProvider: CustomerDataProvider,
    public hcProvider: HcProvider,
    private store: Store,
    public router: Router,
    public widget: WidgetUtils,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.customerDataProvider.initReturnOrder();
    this.cart$.pipe(take(1)).subscribe(cart => {
      this.cart = cart;
      let params = {
        vendorPartyId: cart.billFromVendorPartyId,
        customerPartyId: cart.billToCustomerPartyId,
      };
      this.hcProvider
        .callRequest('post', 'returns', params, 'returns', 'all')
        .subscribe((data: any) => {
          this.customerDataProvider.returnOrder.returnId = data.body.returnId;
        });
    })
  }

  ionViewWillEnter() {
    this.getOrderHistory();
  }

  getOrderHistory() {
    this.widget.showLoading('');
    this.customerPartyId$.pipe(take(1)).subscribe(customerPartyId => {
    let params = {
      customerPartyId: customerPartyId,
    };
    this.hcProvider
      .callRequest('get', 'orders', params, 'orders', 'all')
      .subscribe((data: any) => {
        if (data.ordersList && data.ordersList.length) {
          this.store.dispatch(new SetOrderHistory({ orderHistory: data.ordersList }));
          this.orders = data.ordersList;
          this.filteredOrders = this.orders;
          this.widget.hideLoading();
        } else {
          this.widget.hideLoading();
        }
      },
      err => {
        this.widget.hideLoading();
        console.log(err);
      },
    );
    })
  }

  returnItems(order) {
    this.cart$.pipe(take(1)).subscribe(cart => {
    this.hcProvider
      .callRequest(
        'post',
        'returns/' +
          this.customerDataProvider.returnOrder.returnId +
          '/approve',
        {},
      )
      .subscribe(
        data => {
          this.customerDataProvider.returnOrder.orderId = order.orderId;
          order.partName = cart.customer.partyName;
          this.router.navigate(["/return-items"], { state: {...order}} );
        },
        err => {
          console.log(err);
        },
      );
    })
  }

  searchOrder(event) {
    if (event && event.key === "Enter") {
      this.keyword = event.target.value;
      this.orderHistory$.pipe(take(1)).subscribe(orderHistory => {
        this.filteredOrders = orderHistory.filter(
          el =>
            el.orderId.includes(this.keyword) ||
            el.items.some(el =>
              el.itemDescription.toLowerCase().includes(this.keyword.toLowerCase()),
            ),
        );

      });
    }
  }

  clearSearchbar() {
    // To get the default list of orders after clearing the searchbar
    this.filteredOrders = this.orders;
  }
}
