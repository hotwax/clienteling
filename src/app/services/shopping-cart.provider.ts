import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HcProvider } from './hc.provider';
import { environment } from '../../environments/environment'

/**
 * Provider specific to shopping cart specific operations
 */
@Injectable({
  providedIn: 'root',
})
export class ShoppingCartProvider {

  constructor(
    public http: HttpClient,
    private hcProvider: HcProvider,
  ) {}

  /**
   * Method calls the doPromotion API to sync cart with backend and apply promotions
   *
   * @param {Object} payload payload object containing cart.
   *
   *
   * @return {Observable<Response>} Returns instance of Observable<Response> returned by Http.post()
   */
  syncCart(payload) {
    return this.hcProvider.callRequest('post', 'doPromotion', payload);
  }

  /**
   * Method calls the doTaxation API to sync cart with backend and apply tax
   *
   * @param {Object} payload payload object containing cart.
   *
   *
   * @return {Observable<Response>} Returns instance of Observable<Response> returned by Http.post()
   */
  applyTax(payload) {
    return this.hcProvider.callRequest('post', 'doTaxation', payload);
  }

    /**
   * Method calls the applyCoupon API to apply promo code to cart
   *
   * @param {Object} payload payload object containing cart and coupon code.
   *
   *
   * @return {Observable<Response>} Returns instance of Observable<Response> returned by Http.post()
   */
  applyCoupon(payload) {
    return this.hcProvider.callRequest('post', 'applyCoupon', payload);
  }

    /**
   * Method checks if there are in store items in cart
   *
   * @param {ShoppingCart} cart  
   *
   *
   * @return {boolean} Returns true or false
   */
  ifInStoreItems(cart){
    return cart.orderItemShipGroupInfo.some(orderItemShipGroup => {
      return this.isInStoreShipGroup(orderItemShipGroup);
    })
  }

   /**
   * Method checks if there are in delivery items in cart
   *
   * @param {ShoppingCart} cart  
   *
   *
   * @return {boolean} Returns true or false
   */
  ifDeliveryItems(cart){
    return cart.orderItemShipGroupInfo.some(orderItemShipGroup => {
      return this.isDeliveryShipGroup(orderItemShipGroup);
    })
  }

   /**
   * Method checks if there are store pickup items in cart
   *
   * @param {ShoppingCart} cart  
   *
   *
   * @return {boolean} Returns true or false
   */
  ifStorePickupItems(cart){
    return cart.orderItemShipGroupInfo.some(orderItemShipGroup => {
      return this.isStorePickupShipGroup(orderItemShipGroup);
    })
  }

   /**
   * Method returns list of in store items in cart
   *
   * @param {ShoppingCart} cart  
   *
   *
   * @return {Array} Returns list of instore items
   */
  getInStoreItems(cart){
    let shipGroups = cart.orderItemShipGroupInfo.filter(orderItemShipGroup => {
      return this.isInStoreShipGroup(orderItemShipGroup);
    }).map(assoc => assoc.shipGroupSeqId);
    let assocItemSeqIds = shipGroups.length ? 
          cart.orderItemShipGroupAssoc.filter(assoc => shipGroups.includes(assoc.shipGroupSeqId)).map(assoc => assoc.orderItemSeqId) 
          : [];
    return assocItemSeqIds.length ? cart.items.filter(item => assocItemSeqIds.includes(item.orderItemSeqId)) : [];
  }

   /**
   * Method returns list of in delivery items in cart
   *
   * @param {ShoppingCart} cart  
   *
   *
   * @return {Array} Returns list of delivery items
   */
  getDeliveryItems(cart){
    let shipGroups = cart.orderItemShipGroupInfo.filter(orderItemShipGroup => {
      return this.isDeliveryShipGroup(orderItemShipGroup);
    }).map(assoc => assoc.shipGroupSeqId);
    let assocItemSeqIds = shipGroups.length ? 
          cart.orderItemShipGroupAssoc.filter(assoc => shipGroups.includes(assoc.shipGroupSeqId)).map(assoc => assoc.orderItemSeqId) 
          : [];
    return assocItemSeqIds.length ? cart.items.filter(item => assocItemSeqIds.includes(item.orderItemSeqId)) : [];
  }

   /**
   * Method returns list of store pickup items in cart
   *
   * @param {ShoppingCart} cart  
   *
   *
   * @return {Array} Returns list of store pickup items
   */
  getStorePickupItems(cart){
    let shipGroups = cart.orderItemShipGroupInfo.filter(orderItemShipGroup => {
      return this.isStorePickupShipGroup(orderItemShipGroup);
    }).map(assoc => assoc.shipGroupSeqId);
    let assocItemSeqIds = shipGroups.length ? 
          cart.orderItemShipGroupAssoc.filter(assoc => shipGroups.includes(assoc.shipGroupSeqId)).map(assoc => assoc.orderItemSeqId) 
          : [];
    return assocItemSeqIds.length ? cart.items.filter(item => assocItemSeqIds.includes(item.orderItemSeqId)) : [];
  }

   /**
   * Method checks if shipgroup is for delivery item
   *
   * @param {OrderItemGroups} shipGroup  
   *
   *
   * @return {boolean} Returns true or false
   */
  isDeliveryShipGroup(shipGroup){
    return shipGroup.carrierPartyId === environment.DELIVERY_CARRIER_PARTY &&
    shipGroup.shipmentMethodTypeId === environment.DELIVERY_SHIP_METH;
  }

   /**
   * Method checks if shipgroup is for instore item
   *
   * @param {OrderItemGroups} shipGroup  
   *
   *
   * @return {boolean} Returns true or false
   */
  isInStoreShipGroup(shipGroup){
    return shipGroup.carrierPartyId === environment.INSTORE_CARRIER_PARTY &&
    shipGroup.shipmentMethodTypeId === environment.INSTORE_SHIP_METH;
  }

   /**
   * Method checks if shipgroup is for store pickup item
   *
   * @param {OrderItemGroups} shipGroup  
   *
   *
   * @return {boolean} Returns true or false
   */
  isStorePickupShipGroup(shipGroup){
    return shipGroup.carrierPartyId === environment.PICKUP_CARRIER_PARTY &&
        shipGroup.shipmentMethodTypeId === environment.PICKUP_SHIP_METH;
  }


  // TODO Handle it in better way
  getDiscountedPrice(basePrice, adjustment): any {
    /* Used to display the discounted price on the UI, if there is no discount then return the basePrice with discountPrice as zero.
    For now use the first adjustments because in real scenario there will not be more than one discount on a specific product.*/

    // If the adjustment exist then assign the value in displayPrice otherwise assign to zero
    let discountPrice = adjustment[0] ? adjustment[0].amount : 0;
    // As per the response of API the value of amount(discountPrice) is negative hence added to the basePrice
    return basePrice + discountPrice;
  }
}
