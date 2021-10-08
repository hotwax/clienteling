import { Component, Input } from '@angular/core';
import { L10nUserLanguage, L10nTranslationService } from 'angular-l10n';
import { WidgetUtils } from '../../shared/widget.util';
import { Store, Select } from '@ngxs/store';
import { ProductState } from '../../shared/store/product/product.state';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';
import { SetCurrent } from '../../shared/store/product/product.action';
import { Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'product-card',
  templateUrl: 'product-card.html'
})
export class ProductCardComponent {

  @Input() product: any;
  @Input() storePreviousProduct: boolean;
  productSubscription: any;
  currencySubscription: any;
  currencyUom: any;
  @Select(ProductState.getCurrentProduct) product$: Observable<any>;
  @Select(ShoppingCartState.getCurrencyUom) cartCurrencyUom$: Observable<any>;

  constructor(
    public translation: L10nTranslationService,
    private widget: WidgetUtils,
    private store: Store,
    public router: Router
  ) {
    this.currencySubscription = this.cartCurrencyUom$.subscribe((currencyUom) => {
      this.currencyUom = currencyUom;
    });

  }

  ngOnDestroy() {
    if(this.currencySubscription) this.currencySubscription.unsubscribe();
  }

  public viewProduct(sku) {
    if (sku) {
      this.widget.showLoading('');
      this.store.dispatch(new SetCurrent({ productId: sku, storePreviousProduct: this.storePreviousProduct }));
      this.productSubscription = this.product$.subscribe((product) => {
        if (product) {
          if(this.productSubscription) this.productSubscription.unsubscribe();
          if(product.productId !== sku) {
            let data = {
              variant: product.variants.find(el => el.productId === sku)
            }
            this.router.navigate(["tabs/home/product"], { state: {...data} });
            this.widget.hideLoading();
          } else {
            let navigationExtras: NavigationExtras = {
              queryParams: {
                productId: sku,
              }
            };
            this.router.navigate(["tabs/home/product"], navigationExtras);
            this.widget.hideLoading();
          }
        } else if(product === null) {
          this.widget.hideLoading();
        }
      })
      
    }
  }

}