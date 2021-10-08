import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { WidgetUtils } from '../../widget.util';
import { SoldItems } from './sold-item.model';
import { AddSoldItem, ClearRegisteredItems, RemoveSoldItem, ClearSoldItemsData } from './sold-item.action';
import { HttpErrorResponse } from '@angular/common/http';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { ProductProvider } from '../../../services/product.provider';

@State<SoldItems>({
  name: 'soldItems',
  defaults: {
    list: []
  },
})
@Injectable({
  providedIn: 'root',
})
export class SoldItemState {
  /**
   * Memoized selector that returns the list of sold items
   */
  @Selector()
  static getSoldItems(state: SoldItems): any[] | null {
    return JSON.parse(JSON.stringify(state.list));
  }

  constructor(
    private dialog: WidgetUtils,
    private translation: L10nTranslationService,
    private productProvider: ProductProvider,
  ) {}

  @Action(AddSoldItem)
  addSoldItem(ctx: StateContext<SoldItems>, action: AddSoldItem) {
    return this.productProvider.getSoldProduct(action.payload.productSku).pipe(
      tap(
        (response: any) => {
          if(response && response.docs.length > 0) {
            let product = JSON.parse(JSON.stringify(response.docs[0]))
            product.quantity = -1;
            let currentState = ctx.getState();
            ctx.patchState({
              list: currentState.list.concat(product)
            });
          } else {
            this.dialog.showToast(this.translation.translate('Product not found'));
          }
          this.dialog.hideLoading();
        },
        (errorResponse: HttpErrorResponse) => {
          this.dialog.showToast(this.translation.translate('Product not found'));
          this.dialog.hideLoading();
        },
      ),
    );
  }

  @Action(RemoveSoldItem)
  removeSoldItem(ctx: StateContext<SoldItems>, action: RemoveSoldItem) {
    const products = ctx.getState();
    let index = products.list.findIndex(ele => ele.sku === action.payload.product.sku)
    products.list.splice(index, 1)
    ctx.patchState(products)
    return;
  }

  @Action(ClearSoldItemsData)
  clearSoldItemsData(ctx: StateContext<SoldItems>, action: ClearSoldItemsData) {
    ctx.patchState({
      list: []
    });
  }

  @Action(ClearRegisteredItems)
  clearRegisteredItems(ctx: StateContext<SoldItems>, action: ClearRegisteredItems) {
    const products = ctx.getState();
    let registeredItems = products.list.filter(product => {
      return !(action.payload.products.includes(product.sku))
    })
    ctx.patchState({list: registeredItems})
    return;
  }

}