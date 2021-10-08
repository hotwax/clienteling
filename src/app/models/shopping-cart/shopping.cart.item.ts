export interface ShoppingCartItem {
  orderItemSeqId: string;
  primaryProductCategoryId: string;
  productId: string;
  productName: string;
  parentProductId: string;
  quantity: number;
  listPrice: number;
  unitPrice: number;
  imageUrl: string;
  mainFeat: string;
  secondaryFeat: string;
  features?: any;
  attributes?: any;
  productStock: number;
  returnReasonId?: string;
  returnPaymentMethodId?: string;
  facilityName?: string;
  address?: string;
}
