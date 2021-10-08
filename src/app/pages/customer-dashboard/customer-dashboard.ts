import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ProductProvider } from '../../services/product.provider';
import { environment } from '../../../environments/environment';
import { WidgetUtils } from '../../shared/widget.util';
import { Store, Select } from '@ngxs/store';
import { ProductState } from '../../shared/store/product/product.state';
import { SetCurrent } from '../../shared/store/product/product.action';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'page-customer-dashboard',
  templateUrl: 'customer-dashboard.html',
})
export class CustomerDashboardPage {
  data: any;
  public customerAnalytics = [];
  public pageTitle: any;
  public defaultCurrency: string;
  productSubscription: any;
  @Select(ProductState.getCurrentProduct) product$: Observable<any>;

  constructor(
    public navParams: NavParams,
    private productProvider: ProductProvider,
    private widget: WidgetUtils,
    private store: Store,
    public router: Router
  ) {
    if (this.navParams.get('data')) {
      this.data = this.navParams.get('data');
      this.customerAnalytics = this.data.customerAnalytics;
      this.pageTitle = this.data.pageTitle;
    }
    if (
      environment.hasOwnProperty('DEFAULT_CURRENCY') &&
      environment.DEFAULT_CURRENCY.trim() !== ''
    ) {
      this.defaultCurrency = environment.DEFAULT_CURRENCY;
    }
  }

  ngOnDestroy() {
    if(this.productSubscription) this.productSubscription.unsubscribe();
  }

  viewProduct(productId): void {
    this.widget.showLoading('');
    this.productProvider.productId = productId;
    this.store.dispatch(new SetCurrent({ productId: productId }));
    this.productSubscription = this.product$.subscribe((product) => {
      if (product) {
        if(this.productSubscription) this.productSubscription.unsubscribe();
        let productNavParams = {
          productId: productId,
        };
        if (product.productId !== productId) {
          productNavParams['variant'] = product.variants.find(el => el.productId === productId);
        }
        this.router.navigate(['/product', {productNavParams}]);
      } else if(product === null) {
        this.widget.hideLoading();
      }
    })
  }
}
