// Defined all the actions for CustomerState

export class SetPartyId {
    static readonly type = '[Customer] Set PartyId';
    constructor(public payload: { partyId: string; }) {}
}
export class SetIsSearched {
    static readonly type = '[Customer] Set IsSearched';
    constructor(public payload: { isSearched: boolean; }) {}
}

export class SetOrderHistory {
    static readonly type = '[Customer] Set OrderHistory';
    constructor(public payload: { orderHistory: any; }) {}
}
export class FetchBrowsedProduct {
    static readonly type = '[Customer] Fetch Browsed Product';
    constructor(public payload: { email: string; }) {}
}
export class FetchMostViewedProduct {
    static readonly type = '[Customer] Fetch Most Viewed Product';
    constructor(public payload: { email: string; }) {}
}
export class FetchSuggestedProduct {
    static readonly type = '[Customer] Fetch Suggested Product';
    constructor(public payload: { email: string; }) {}
}
export class ClearCustomerAnalytics {
    static readonly type = '[Customer] Clear Customer Analytics';
}
export class ClearCustomerData {
    static readonly type = '[Customer] Clear Customer Data';
}