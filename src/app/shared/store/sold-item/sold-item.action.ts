export class AddSoldItem {
    static readonly type = '[Sold Item] Add sold item';
    constructor(public payload: { productSku: string }) {}
}

export class RemoveSoldItem {
    static readonly type = '[Sold Item] Remove sold Item';
    constructor(public payload: { product: any }) {}
}

export class ClearSoldItemsData {
    static readonly type = '[Sold Item] Clear sold items data';
}

export class ClearRegisteredItems {
    static readonly type = '[Sold Item] Clear registered item';
    constructor(public payload: { products: any }) {}
}