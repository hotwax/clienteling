import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { from } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ProductProvider } from '../../../services/product.provider';
import { WidgetUtils } from '../../widget.util';
import { Product } from './product.model';
import { FindProducts, SetCurrent } from './product.action';
import { HttpErrorResponse } from '@angular/common/http';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { AuthState } from '../auth/auth.state';
import { SearchProvider } from '../../../services/search.provider';


@State<Product>({
  name: 'products',
  defaults: {
    list: [],
    current: undefined,
    totalProductCount: '',
    previousProducts: []
  },
})
@Injectable({
  providedIn: 'root',
})
export class ProductState {
  /**
   * Memoized selector that returns the list of products
   */
  @Selector()
  static getProducts(state: Product): any[] | null {
    return state.list;
  }

  /**
   * Memoized selector that returns the selected product
   */
  @Selector()
  static getCurrentProduct(state: Product): object | null {
    return state.current;
  }

  /**
   * Memoized selector that returns the totalCount of products
   */
  @Selector()
  static getTotalProductCount(state: Product): string | null {
    return state.totalProductCount;
  }

  /**
   * Memoized selector that returns the previous productId
   */
  @Selector()
  static getPreviousProducts(state: Product): any[] | null {
    return JSON.parse(
      JSON.stringify(
        state.previousProducts
      )
    );
  }

  constructor(
    private productProvider: ProductProvider,
    private widget: WidgetUtils,
    private translation: L10nTranslationService,
    private store: Store,
    private searchProvider: SearchProvider,
  ) {}

  @Action(FindProducts)
  findProducts(ctx: StateContext<Product>, action: FindProducts) {
    const currentStoreData = this.store.selectSnapshot(AuthState.getCurrentStore);
    // event object is needed in case of infinite scrolling
    let event = action.payload.event;
    // Need to delete it from payload object as it gives error
    // when passed to API call
    delete action.payload.event;
    // In the absence of event object i.e. non infinite scroll scenario
    // show screen loading element for the progress.
    if (!event && !this.widget.isLoading) this.widget.showLoading('');
    return this.productProvider.findProducts(action.payload, currentStoreData.facilityId).pipe(
      tap(
        (response: any) => {
          // In case of infinite scroll concat to current list
          // else replace it
          if (event) {
            var currentState = ctx.getState();
            ctx.patchState({
              list: currentState.list.concat(response.result.docs),
            });
            event.target.complete();
          } else {
            ctx.patchState({
              list: response.result.docs,
              totalProductCount: response.result.count
            });
            this.widget.hideLoading();
          }
          this.widget.hideLoading();
        },
        err => {
          // Using infinte scroll, when the list end the server sends empty response
          // it gives error handling the json which doesn't require a error message
          if (err.status !== 200) {
            this.widget.showToast(this.translation.translate('Error in fetching Products.'));
          }
          if (event) {
            event.target.complete();
          } else {
            this.widget.hideLoading();
          }
        },
      ),
    );
  }

  @Action(SetCurrent)
  setCurrent(ctx: StateContext<Product>, action: SetCurrent) {
    let currentState = ctx.getState();
    let previousProducts = action.payload.previousProducts ? action.payload.previousProducts : currentState.previousProducts;
    if(action.payload.storePreviousProduct) {
      previousProducts.push(currentState.current['productId'])
    }
    let product = currentState.list.find(
      product => product.productId == action.payload.productId,
    );
    // The value is undefined initially when this is changed to null
    // This is done because there no other way to handle error
    // in dispatch for 2.0 version of NGXS https://github.com/ngxs/store/issues/1145
    ctx.patchState({
      current: undefined,
    });
    if (product) {
      ctx.patchState({
        current: product,
        previousProducts
      });
      return;
    } else {
      if(!this.widget.isLoading) this.widget.showLoading('');
      const currentStoreData = this.store.selectSnapshot(AuthState.getCurrentStore);
      let queryParams = {
        queryString: undefined,
        filters: []
      };
      queryParams.filters.push({ key: 'configurable_children.sku', value: { 'eq': action.payload.productId } });
      
      return from(this.searchProvider.prepareQuery(queryParams)).pipe(mergeMap((request: any) => {
        let payload = {
          request
        };
        return this.productProvider.findProducts(payload, currentStoreData.facilityId).pipe(
          tap(
            (response: any) => {
              if ( response.result && response.result.docs && response.result.docs.length ) {
                ctx.patchState({
                  current: response.result.docs[0],
                  previousProducts
                });
              } else {
                ctx.patchState({
                  current: null,
                });
                this.widget.showToast(this.translation.translate('Product not found'));
                this.widget.hideLoading();
              }
            },
            (errorResponse: HttpErrorResponse) => {
              ctx.patchState({
                current: null,
              });
              this.widget.showToast(this.translation.translate('Product not found'));
              this.widget.hideLoading();
            },
          )
        );
      }));
    }
  }
}
