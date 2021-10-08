import { Action, Select, Selector, State, StateContext, Store } from '@ngxs/store';
import { catchError, mergeMap, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ShoppingCartProvider } from '../../../services/shopping-cart.provider';
import { WidgetUtils } from '../../widget.util';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { ApplyTax, AddToCart, ClearCartItems, PrepareCart, PrepareEmptyCart, RemoveCartItem, SyncCart, UpdateCart, UpdateCartItem, ApplyCoupon } from './shopping-cart.actions';
import { AuthState } from '../auth/auth.state';
import { Observable } from 'rxjs';
import { CustomerDataProvider } from '../../../services/customerdata.provider';
import { PaymentProvider } from '../../../services/payment.provider';
import { environment } from '../../../../environments/environment'
import { ClearCustomerData, SetIsSearched } from '../customer/customer.action';
import { ShoppingCart } from "../../../models/shopping-cart/shopping.cart";

@State<ShoppingCart>({
  name: 'cart',
  defaults: {
    workEffortId: '',
    miscellaneousCharges: '',
    salesChannelEnumId: '',
    billToCustomerPartyId: '',
    billingAccountId: '',
    orderAdjustments: [],
    orderItemContactMechs: [],
    cartTotal: 0,
    orderProductPromoCodes: [],
    orderInternalNotes: [],
    workEfforts: [],
    itemDesiredDeliveryDate: null,
    partyId: '',
    autoCloseDate: null,
    allTaxesByType: {},
    billFromVendorPartyId: '',
    grandTotal: 0,
    shippingInstructions: {},
    autoOrderShoppingListId: {},
    orderTerms: [],
    transactionId: '',
    endUserCustomerPartyId: '',
    placingCustomerPartyId: '',
    currencyUom: '',
    orderNotes: [],
    orderPartyId: '',
    additionalPartyRoleMap: {},
    orderDate: null,
    items: [],
    orderItemAttributes: [],
    shippingApplies: true,
    orderItemGroups: [],
    orderAttributes: [],
    orderProductPromoUses: '',
    orderTypeId: 'SALES_ORDER',
    terminalId: '',
    orderOtherAdjustmentTotal: '',
    orderItemShipGroupInfo: [],
    orderContactMechs: {},
    totalShipping: '',
    orderPaymentInfo: [],
    contactPersonCustomerPartyId: '',
    orderName: '',
    webSiteId: '',
    prodCatalogId: '',
    totalSalesTax: '',
    shipGroupFacilityId: '',
    maySplit: '',
    externalId: '',
    correspondingPoId: '',
    firstAttemptOrderId: '',
    originFacilityId: '',
    orderItemPriceInfos: [],
    shipToCustomerPartyId: '',
    supplierPartyId: '',
    productStore: {},
    internalCode: '',
    customer: {
      emailAddress: '',
      partyName: '',
      partyId: '',
      phoneNumber: ''
    },
    productStoreId: '',
    orderItemShipGroupAssoc: [],
    address: [],
    isModified: false,
    orderId: '',
  }
})
@Injectable({
  providedIn: 'root',
})
export class ShoppingCartState {

  @Select(AuthState.getCurrentStore) selectedStoreData$: Observable<any>;

  /**
   *
   * Memoized selector that returns the cart
   * @param state current shopping cart
   */
  @Selector()
  static getCart(state: ShoppingCart): any {
    return JSON.parse(
      JSON.stringify(
        state
      )
    );
  }

  /**
   *
   * Memoized selector that returns the cart item count
   * @param state current shopping cart state
   */
  @Selector()
  static getItemCount(state: ShoppingCart): any {
    return state.items.reduce((acc, item) => acc += (item ? item.quantity : 0), 0);
  }

  /**
   *
   * Memoized selector that returns the cart Currency Uom
   * @param state current shopping cart state
   */
  @Selector()
  static getCurrencyUom(state: ShoppingCart): any {
    return state.currencyUom;
  }
  /**
   * Memoized selector that returns the customer partyId value
   */
  @Selector()
  static getCustomerId(state: ShoppingCart): string | null {
    return state.billToCustomerPartyId;
  }


  constructor(
    private shoppingCartProvider: ShoppingCartProvider,
    private widget: WidgetUtils,
    private translation: L10nTranslationService,
    private store: Store,
    private customerDataProvider: CustomerDataProvider,
    public paymentProvider: PaymentProvider,
    ) {}

  @Action(ClearCartItems)
  clearCartItems(ctx: StateContext<ShoppingCart>, action: ClearCartItems) {
    ctx.patchState({
      items: [],
      orderItemShipGroupAssoc: [],
      orderItemShipGroupInfo: []
    });
  }
  @Action(PrepareCart)
  prepareCart(ctx: StateContext<ShoppingCart>, action: PrepareCart) {
    const currentState = ctx.getState();
    // This handles case to preserve the cart if already exist
    // If we have a instance of already prepared cart use it
    // else create an empty cart
    if (!currentState.billToCustomerPartyId) {
      this.store.dispatch(new PrepareEmptyCart({ customerPartyId: action.payload.customerPartyId }));
    }
  }
  @Action(PrepareEmptyCart)
  prepareEmptyCart(ctx: StateContext<ShoppingCart>, action: PrepareEmptyCart) {
    const customerPartyId = action.payload.customerPartyId ? action.payload.customerPartyId : '_NA_';
    this.selectedStoreData$.pipe(take(1)).subscribe((selectedStoreData) => {
      ctx.patchState({
        workEffortId: '',
        miscellaneousCharges: '',
        salesChannelEnumId: selectedStoreData.salesChannelEnumId,
        billToCustomerPartyId: customerPartyId,
        billingAccountId: '',
        orderAdjustments: [],
        orderItemContactMechs: [],
        cartTotal: 0,
        orderProductPromoCodes: [],
        orderInternalNotes: [],
        workEfforts: [],
        itemDesiredDeliveryDate: null,
        partyId: customerPartyId,
        autoCloseDate: null,
        allTaxesByType: {},
        billFromVendorPartyId: selectedStoreData.payToPartyId,
        grandTotal: 0,
        shippingInstructions: {},
        autoOrderShoppingListId: {},
        orderTerms: [],
        transactionId: '',
        endUserCustomerPartyId: '',
        placingCustomerPartyId: customerPartyId,
        currencyUom: selectedStoreData.currencyUomId,
        orderNotes: [],
        orderPartyId: '',
        additionalPartyRoleMap: {},
        orderDate: null,
        items: [],
        orderItemAttributes: [],
        shippingApplies: true,
        orderItemGroups: [],
        orderAttributes: [],
        orderProductPromoUses: '',
        orderTypeId: 'SALES_ORDER',
        terminalId: '',
        orderOtherAdjustmentTotal: '',
        orderItemShipGroupInfo: [],
        orderContactMechs: {},
        totalShipping: '',
        orderPaymentInfo: [],
        contactPersonCustomerPartyId: '',
        orderName: '',
        webSiteId: selectedStoreData.webSites && selectedStoreData.webSites.length > 0 ? selectedStoreData.webSites[0].webSiteId : '',
        prodCatalogId: selectedStoreData.webSites && selectedStoreData.webSites.length > 0 ? selectedStoreData.webSites[0].prodCatalogId : '',
        totalSalesTax: '',
        shipGroupFacilityId: selectedStoreData.facilityId,
        maySplit: '',
        externalId: '',
        correspondingPoId: '',
        firstAttemptOrderId: '',
        originFacilityId: selectedStoreData.facilityId,
        orderItemPriceInfos: [],
        shipToCustomerPartyId: customerPartyId,
        supplierPartyId: '',
        productStore: {},
        internalCode: '',
        customer: {
          emailAddress: '',
          partyName: '',
          partyId: customerPartyId,
          phoneNumber: ''
        },
        productStoreId: selectedStoreData.productStoreId,
        orderItemShipGroupAssoc: [],
        address: [],
        isModified: false,
        orderId: '',
      });

      // TODO Find a better way to handle it
      ctx.dispatch(new ClearCustomerData());
      ctx.dispatch(new SetIsSearched({ isSearched: false }));
      this.customerDataProvider.initReturnOrder()
      this.paymentProvider.payment = [];
      return;
    });
    
  }

  @Action(UpdateCart)
  updateCart(ctx: StateContext<ShoppingCart>, action: UpdateCart) {
    ctx.patchState(action.payload.cart);
    return;
  }

  @Action(AddToCart)
  addToCart(ctx: StateContext<ShoppingCart>, action: AddToCart) {
    const cart = ctx.getState();
    const item = action.payload.item;
    this.selectedStoreData$.pipe(take(1)).subscribe((selectedStoreData) => {
      let facilityId = action.payload.facilityId ? action.payload.facilityId : selectedStoreData.facilityId;
      let contactMechId = action.payload.contactMechId ? action.payload.contactMechId : '';
      item.contactMechId = contactMechId;
      item.facilityId = facilityId;
      let orderItemShipGroup = cart.orderItemShipGroupInfo.find(el => (el.facilityId == facilityId) && (el.contactMechId == contactMechId));
      let orderItemShipGroupAssocItemSeqId = orderItemShipGroup ? 
          cart.orderItemShipGroupAssoc.filter(assoc => assoc.shipGroupSeqId == orderItemShipGroup.shipGroupSeqId).map(assoc => assoc.orderItemSeqId) 
          : undefined;
      let cartItem = orderItemShipGroupAssocItemSeqId ? cart.items.find(currentItem => (item.productId === currentItem.productId && orderItemShipGroupAssocItemSeqId.includes(currentItem.orderItemSeqId))) : undefined;
      if (!cartItem) {
        item.orderItemSeqId = JSON.stringify(cart.items.length ? (parseInt(cart.items[cart.items.length - 1].orderItemSeqId, 10) + 1) : 1);
        item.orderItemSeqId = item.orderItemSeqId.padStart(2, '0');
        cart.items.push(item);
        cartItem = item;
      } else {
        cartItem.quantity++;
      }

      const facilityName = action.payload.facilityName;
      const shipByDate = action.payload.shipByDate;
      const shipAfterDate = action.payload.shipAfterDate;
      const address = action.payload.address;
      if (!(contactMechId || facilityId)) {
        // If either contactMechId or facilityId is not passed,
        // it is in store order
        contactMechId = '';
        facilityId = selectedStoreData.facilityId;
      }


      /*
      ShipGroup    | ShipmentMethod | CarrierParty |  ContactMechId | Facility
      In-Store     |    _NA_        |   _NA_       |       ''       |  In-store facility
      Delivery     |  ShMthGround   |   _NA_       |      Address   |  In-store facility
      Store-pickup |  ShMthPickUp   | STOREPICKUP  |       ''       |  Other-store facility
     */
      let shipGroup: any;
      let shipGroupSeqId;
      let carrierPartyId = '';
      let shipmentMethodTypeId = '';
      if (contactMechId) {
        // To create the shipGroup for deliverToAddress flow that carrierPartyId should be _NA_
        shipGroup = cart.orderItemShipGroupInfo.find(el => (el.contactMechId == contactMechId) && (el.carrierPartyId == environment.DELIVERY_CARRIER_PARTY));
        carrierPartyId = environment.DELIVERY_CARRIER_PARTY;
        shipmentMethodTypeId = environment.DELIVERY_SHIP_METH;
      }
      // Store pickup items
      else if(facilityId != cart.originFacilityId){
        shipGroup = cart.orderItemShipGroupInfo.find(el => (el.facilityId == facilityId) && (el.carrierPartyId == environment.PICKUP_CARRIER_PARTY));
        carrierPartyId = environment.PICKUP_CARRIER_PARTY;
        shipmentMethodTypeId = environment.PICKUP_SHIP_METH;
      }
      // In-store items
    else {
      shipGroup = cart.orderItemShipGroupInfo.find(
        el => !el.contactMechId && el.carrierPartyId == environment.INSTORE_CARRIER_PARTY,
      );
      carrierPartyId = environment.INSTORE_CARRIER_PARTY;
      shipmentMethodTypeId = environment.INSTORE_SHIP_METH;
    }

      /**
       * facility Id is available in both cases :
       * [1] product added using default facilityId - selectedStoreData.facilityId (default shipgroup)
       * [2] product added using other facility from store locator screen (create new shipgroup)
       */
      if (shipGroup) {
        let isShipGroupAssoc = cart.orderItemShipGroupAssoc
          .filter(
            ele =>
              ele.shipGroupSeqId == shipGroup.shipGroupSeqId &&
              ele.orderItemSeqId == cartItem.orderItemSeqId,
          )
          .map(el => (el.quantity = el.quantity + 1));
        if (!isShipGroupAssoc.length) {
          let orderItemShipGroupAssoc = {
            orderItemSeqId: cartItem.orderItemSeqId,
            quantity: 1,
            shipGroupSeqId: shipGroup.shipGroupSeqId,
          };
          cart['orderItemShipGroupAssoc'].push(
            orderItemShipGroupAssoc,
          );
        }
      } else {
        shipGroupSeqId = JSON.stringify(
          cart.orderItemShipGroupInfo.length
            ? parseInt(
                cart.orderItemShipGroupInfo[
                  cart.orderItemShipGroupInfo.length - 1
                ].shipGroupSeqId,
              ) + 1
            : 1,
        );
        shipGroupSeqId = shipGroupSeqId.padStart(2, '0');
        let shipGroup = {
          facilityId: facilityId,
          carrierPartyId: carrierPartyId,
          shipmentMethodTypeId: shipmentMethodTypeId,
          shipGroupSeqId: shipGroupSeqId,
          shipByDate: shipByDate ? shipByDate : '',
          shipAfterDate: shipAfterDate ? shipAfterDate : '',
          contactMechId: contactMechId,
          facilityName: facilityName,
          address: address,
        };

        cart.orderItemShipGroupInfo.push(shipGroup);
        //create orderItemShipGroupAssoc
        let orderItemShipGroupAssoc = {
          orderItemSeqId: cartItem.orderItemSeqId,
          quantity: 1,
          shipGroupSeqId: shipGroupSeqId,
        };
        cart.orderItemShipGroupAssoc.push(
          orderItemShipGroupAssoc,
        );
      }
      // TODO Discuss and fix it
      // To show store pickup facility name and delivery address on shopping cart and review order page 
      // we need this information with product
      cartItem.facilityName = facilityName;
      cartItem.address = address;

      cart.cartTotal = cart.items.reduce((acc, currentItem) => acc += (currentItem ? (currentItem.quantity * currentItem.listPrice) : 0), 0);
      ctx.patchState(cart);
      this.widget.showToast(this.translation.translate('Item added to cart'));
      return;
    });
  }

  @Action(RemoveCartItem)
  removeCartItem(ctx: StateContext<ShoppingCart>, action: RemoveCartItem) {
    const cart = ctx.getState();
    const item = action.payload.item;
    let foundAssoc = cart.orderItemShipGroupAssoc.find(ele => ele.orderItemSeqId == item.orderItemSeqId);
    let foundAssocIndex = cart.orderItemShipGroupAssoc.indexOf(foundAssoc);
    cart.orderItemShipGroupAssoc.splice(foundAssocIndex, 1);
    let sameShipGroupAssoc = cart.orderItemShipGroupAssoc.find(ele => ele.shipGroupSeqId == foundAssoc.shipGroupSeqId);
    if (!sameShipGroupAssoc) {
      cart.orderItemShipGroupInfo.splice(foundAssocIndex, 1);
    }
    let index = cart.items.findIndex((cartItem) => cartItem.orderItemSeqId == item.orderItemSeqId);
    cart.items.splice(index, 1);
    cart.cartTotal = cart.items.reduce((acc, currentItem) => acc += (currentItem ? (currentItem.quantity * currentItem.listPrice) : 0), 0);
    ctx.patchState(cart);
    this.widget.showToast(this.translation.translate('Item removed from cart'));
    return;
  }

  @Action(UpdateCartItem)
  UpdateCartItem(ctx: StateContext<ShoppingCart>, action: UpdateCartItem) {
    const cart = ctx.getState();
    const item = action.payload.item;
    const quantity = parseInt(action.payload.quantity);

    let assoc = cart.orderItemShipGroupAssoc.find(cartItem => item.orderItemSeqId == cartItem.orderItemSeqId);
    if (assoc) assoc.quantity = quantity;
    let cartItem = cart.items.find(cartItem => item.orderItemSeqId == cartItem.orderItemSeqId);
    if (cartItem) cartItem.quantity = quantity;
    cart.cartTotal = cart.items.reduce((acc, currentItem) => acc += (currentItem ? (currentItem.quantity * currentItem.listPrice) : 0), 0);
    ctx.patchState(cart);
    // TODO Make message consistent
    this.widget.showToast(this.translation.translate('Cart item updated successfully'));
    return;
  }

  @Action(SyncCart)
  syncCart(ctx: StateContext<ShoppingCart>, action: SyncCart) {
    const cart = ctx.getState();
    this.widget.showLoading('');
    this.selectedStoreData$.pipe(take(1),
      mergeMap((selectedStoreData) => {
        return this.shoppingCartProvider.syncCart({ cart }).pipe(map((syncCartResponse:any) => {
          return { selectedStoreData, cart: syncCartResponse.body.cart };
        }));
      }),
      catchError(err => {
        this.widget.showToast(this.translation.translate('Something went wrong'));
        this.widget.hideLoading();
        throw 'error ' + err;
      })
    ).subscribe((response: any) => {
      ctx.patchState(response.cart);
      this.widget.hideLoading();
    });
  }

  @Action(ApplyTax)
  applyTax(ctx: StateContext<ShoppingCart>, action: ApplyTax) {
    const cart = ctx.getState();
    this.widget.showLoading('');
    this.selectedStoreData$.pipe(take(1),
      mergeMap((selectedStoreData) => {
        return this.shoppingCartProvider.applyTax({ cart }).pipe(map((applyTaxResponse: any) => {
          return { selectedStoreData, cart: applyTaxResponse.body.cart };
        }));
      }),
      catchError(err => {
        this.widget.showToast(this.translation.translate('Something went wrong'));
        this.widget.hideLoading();
        throw 'error ' + err;
      })
    ).subscribe((response: any) => {
      ctx.patchState(response.cart);
      this.widget.hideLoading();
    });
  }

  @Action(ApplyCoupon)
  applyCoupon(ctx: StateContext<ShoppingCart>, action: ApplyCoupon) {
    const currentState = ctx.getState();
    const cart = currentState;
    this.widget.showLoading('');
    let payload = {
      couponCode: action.payload.couponCode,
      cart,
    };
    this.shoppingCartProvider.applyCoupon(payload)
    .subscribe(
      (result: any) => {
        /**
         * if code was appiled, api will retrun the same code in orderProductPromoCodes array
         * and the update grandTotol and promotion values hence initializing both
         * 'shoppingCartProvider.activeShoppingCart' and 'cart' with the responce cart
         */

        this.widget.showLoading('');
        let isApplied = result.body.cart.orderProductPromoCodes.find(
          ele => ele == result.body.couponCode,
        );
        if (isApplied) {
          ctx.patchState(result.body.cart);
          this.widget.hideLoading();
          this.widget.showToast(
            this.translation.translate('Coupon code applied successfully'),
          );
        } else {
          this.widget.hideLoading();
          this.widget.showToast(
            this.translation.translate('Couldn’t find this coupon'),
          );
        }
      },
      err => {
        this.widget.hideLoading();
        this.widget.showToast(
          this.translation.translate('Something went wrong'),
        );
      },
    );
  }
}
