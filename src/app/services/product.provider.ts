import { Injectable } from '@angular/core';
import { HcProvider } from './hc.provider';
import { ShoppingCartItem } from '../models/shopping-cart/shopping.cart.item';
import { CustomerDataModel } from '../models/customer.data.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductProvider {
  productId: any;
  product: any;
  viewIndex = 0;
  showAllReviews = false;
  cartItem: ShoppingCartItem;
  activeCustomer: CustomerDataModel = null;
  parentCategories: any = [];
  categories: any =[];
  categoriesFilter = {};

  constructor(private hcProvider: HcProvider) {}

  public getReviews(productId, viewSize, viewIndex, event?) {
    let params = {
      productId: productId,
      viewSize: viewSize,
      viewIndex: viewIndex,
    };
    return new Promise((resolve, reject) => {
      this.hcProvider
        .callRequest('get', 'product-reviews', params, 'product-reviews')
        .subscribe(
          (reviews: any) => {
            if (Object.keys(reviews).length > 0) {
              this.viewIndex = Math.ceil(
                (this.viewIndex * viewSize + 1) / viewSize,
              );
              resolve(reviews);
            }
            if (event) {
              event.target.complete();
            }
          },
          err => {
            console.log(err);
          },
        );
    });
  }

  public prepareProduct() {
    return {
      orderItemSeqId: '',
      primaryProductCategoryId: this.product.primaryProductCategoryId,
      productId: '',
      brandName: this.product.brandName,
      productName: this.product.productName
        ? this.product.productName
        : this.product.name /* TODO use only name as APIs are consistent */,
      parentProductId: this.product.productId,
      quantity: 1,
      listPrice: this.product.price.listPrice,
      unitPrice: this.product.price.basePrice,
      isSale: this.product.price.isSale,
      imageUrl: this.product.images.main
        ? this.product.images.main.detail
        : this.product.images
            .detail /* TODO use only product.images.main as APIs are consistent */,
      mainFeat: '',
      features: '',
      alternateImage: '',
      secondaryFeat: '',
      itemAdjustments: [],
      orderItemPriceInfos: [],
      attributes: {},
      contactMechId: '',
      facilityId: '',
      productStock: 0,
    };
  }

  public getKeys(arr): any[] {
    let keys = [];
    if (arr) {
      keys = Object.keys(arr);
    }
    return keys;
  }

    /**
   * Method calls the search products API to get products list
   *
   * @param {Object} payload payload object containing sortBy, viewSize, viewIndex,
   * keyword, productStoreId and categoryId to filter products.
   *
   *
   * @return {Observable<Response>} Returns instance of Observable<Response> returned by Http.post()
   */
  findProducts(params, cacheKey?) {
    return this.hcProvider.callRequest(
      'get',
      'searchProducts',
      params,
      cacheKey ? cacheKey : 'searchProducts',
    );
  }

  /**
   * Method calls the search products API to get specific product
   *
   * @param {String} productId
   *
   *
   * @return {Observable<Response>} Returns instance of Observable<Response> returned by Http.post()
   */
  getProduct(productId) {
    let endPoint = 'searchProducts/' + productId;
    return this.hcProvider.callRequest('get', endPoint, '', 'searchProducts');
  }

  getSoldProduct(productSku) {
    let filters = {
      internalName: productSku
    }
    let params = new HttpParams().set("filters", JSON.stringify(filters));
    return this.hcProvider.callRequest('get', 'products', params, 'sold-product', '', 'OMS_URL')
  }

  getDiscountPercentage(originalPrice, discountedPrice): any {
    return (originalPrice - discountedPrice) / originalPrice
  }

}
