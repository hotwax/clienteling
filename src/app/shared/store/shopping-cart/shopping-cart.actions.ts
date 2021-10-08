export class AddToCart {
    static readonly type = '[Shopping Cart] Add to Cart';
    constructor(public payload: { item: any, contactMechId?: string, facilityId?: string, facilityName?: string, shipByDate?: string, shipAfterDate?: string, address?: string}) {}
}
export class RemoveCartItem {
    static readonly type = '[Shopping Cart] Remove Cart Item';
    constructor(public payload: { item: any }) {}
}
export class UpdateCartItem {
    static readonly type = '[Shopping Cart] Update Cart Item';
    constructor(public payload: { item: any, quantity: any }) {}
}
export class PrepareCart {
    static readonly type = '[Shopping Cart] Prepare Cart';
    constructor(public payload: { customerPartyId?: string }) {}
}
export class PrepareEmptyCart {
    static readonly type = '[Shopping Cart] Prepare Empty Cart';
    constructor(public payload: { customerPartyId?: string}) {}
}
export class SyncCart {
    static readonly type = '[Shopping Cart] Sync Cart';
}
export class ApplyTax {
    static readonly type = '[Shopping Cart] Apply Taxation to Cart';
}
export class ApplyCoupon {
    static readonly type = '[Shopping Cart] Apply Coupon';
    constructor(public payload: { couponCode: any}) {}
}
export class UpdateCart {
    static readonly type = '[Shopping Cart] Update Cart';
    constructor(public payload: { cart: any}) {}
}
export class ClearCartItems {
    static readonly type = '[Shopping Cart] Clear Cart Items';
}