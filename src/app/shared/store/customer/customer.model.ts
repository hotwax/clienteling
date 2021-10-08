export interface Customer {
    partyId: string | null;
    isSearched: boolean | null;
    orderHistory: any | null;
    browsedProducts: any | null;
    suggestedProducts: any | null;
    mostViewedProducts: any | null;
}