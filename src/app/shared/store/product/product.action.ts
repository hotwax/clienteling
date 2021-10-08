// Defined all the actions for Products

export class FindProducts {
  static readonly type = '[Product] Fetch Products';
  constructor(
    public payload: {
      viewSize: string;
      viewIndex: string;
      sortBy?: string;
      keyword?: string;
      categoryId?: any;
      event?: any;
    },
  ) {}
}
export class SetCurrent {
  static readonly type = '[Product] Set Current Product';
  constructor(public payload: { productId: string, storePreviousProduct?: boolean, previousProducts?: any[] }) {}
}
