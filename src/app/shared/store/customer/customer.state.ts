import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Customer } from './customer.model';
import {
  ClearCustomerData,
  ClearCustomerAnalytics,
  SetPartyId,
  SetIsSearched,
  SetOrderHistory,
  FetchBrowsedProduct,
  FetchSuggestedProduct,
  FetchMostViewedProduct
} from './customer.action';
import { Injectable } from '@angular/core';
import { CustomerDataProvider } from '../../../services/customerdata.provider';


@State<Customer>({
  name: 'customer',
  defaults: {
      partyId: "_NA_",
      isSearched: false,
      orderHistory: [],
      suggestedProducts: [],
      browsedProducts: [],
      mostViewedProducts: []
  },
})
@Injectable({
  providedIn: 'root',
})
export class CustomerState {

  /**
   * Memoized selector that returns the partyId value
   */
  @Selector()
  static getPartyId(state: Customer): string | null {
    return state.partyId;
  }
  /**
   * Memoized selector that returns the partyId value
   */
  @Selector()
  static getIsSearched(state: Customer): boolean | null {
    return state.isSearched;
  }
  /**
   * Memoized selector that returns the customer analytics
   */
  @Selector()
  static getCustomerAnalytics(state: Customer): any | null {
    return {
      suggestedProducts: state.suggestedProducts,
      browsedProducts: state.browsedProducts,
      mostViewedProducts: state.mostViewedProducts
    }
  }
  /**
   * Memoized selector that returns the browsedProducts
   */
  @Selector()
  static getBrowsedProducts(state: Customer): any | null {
    return state.browsedProducts;
  }
  /**
   * Memoized selector that returns the suggestedProducts
   */
  @Selector()
  static getSuggestedProducts(state: Customer): any | null {
    return state.suggestedProducts;
  }
  /**
   * Memoized selector that returns the mostViewedProducts
   */
  @Selector()
  static getMostViewedProducts(state: Customer): any | null {
    return state.mostViewedProducts;
  }
  /**
   * Memoized selector that returns the orderHistory value
   */
  @Selector()
  static getOrderHistory(state: Customer): boolean | null {
    return state.orderHistory;
  }

  constructor(
    private customerDataProvider: CustomerDataProvider,
  ) {}

  @Action(SetPartyId)
  setPartyId(ctx: StateContext<Customer>, action: SetPartyId) {
    ctx.patchState({
      partyId: action.payload.partyId
    });
  }

  @Action(SetIsSearched)
  setIsSearched(ctx: StateContext<Customer>, action: SetIsSearched) {
    ctx.patchState({
      isSearched: action.payload.isSearched
    });
  }

  @Action(SetOrderHistory)
  setOrderHistory(ctx: StateContext<Customer>, action: SetOrderHistory) {
    ctx.patchState({
      orderHistory: action.payload.orderHistory
    });
  }

  @Action(FetchBrowsedProduct)
  async fetchBrowsedProduct(ctx: StateContext<Customer>, action: FetchBrowsedProduct) {
    let email = action.payload.email;
    let browsedProducts = await this.customerDataProvider.getBrowsedProduct(email);
    ctx.patchState({
      browsedProducts
    });
  }

  @Action(FetchMostViewedProduct)
  async fetchMostViewedProduct(ctx: StateContext<Customer>, action: FetchMostViewedProduct) {
    let email = action.payload.email;
    let mostViewedProducts = await this.customerDataProvider.getMostViewedProduct(email);
    ctx.patchState({
      mostViewedProducts
    });
  }

  @Action(FetchSuggestedProduct)
  async fetchSuggestedProduct(ctx: StateContext<Customer>, action: FetchSuggestedProduct) {
    let email = action.payload.email;
    let suggestedProducts = await this.customerDataProvider.getSuggestedProduct(email);
    ctx.patchState({
      suggestedProducts
    });
  }

  @Action(ClearCustomerData)
  clearCustomerData(ctx: StateContext<Customer>, action: ClearCustomerData) {
    ctx.patchState({
      partyId: "_NA_",
      isSearched: false,
      orderHistory: [],
      suggestedProducts: [],
      browsedProducts: [],
      mostViewedProducts: []
    });
  }

  @Action(ClearCustomerAnalytics)
  clearCustomerAnalytics(ctx: StateContext<Customer>, action: ClearCustomerAnalytics) {
    ctx.patchState({
      suggestedProducts: [],
      browsedProducts: [],
      mostViewedProducts: []
    });
  }

}
