import { Component, Inject, ViewChild } from '@angular/core';
import {
  NavController,
  ModalController,
  AlertController,
  IonBackButtonDelegate,
  IonContent
} from '@ionic/angular';
import { DeliveryAddressPage } from '../delivery-address/delivery-address';
import { ShippingFormPage } from '../shipping-form/shipping-form';
import { ProductProvider } from '../../services/product.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { HcProvider } from '../../services/hc.provider';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { Select, Store } from '@ngxs/store';
import { AuthState } from '../../shared/store/auth/auth.state';
import { CustomerState } from '../../shared/store/customer/customer.state';
import { ProductState } from '../../shared/store/product/product.state';
import { forkJoin, from, Observable } from 'rxjs';
import { catchError, filter, map, mergeMap, take } from 'rxjs/operators';
import { AddToCart } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';
import { CustomerDataProvider} from '../../services/customerdata.provider';
import { SetCurrent } from '../../shared/store/product/product.action';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SearchProvider } from '../../services/search.provider';

@Component({
  styleUrls: ['product.scss'],
  templateUrl: 'product.html',
  animations: [
    trigger('chipAnimation', [
      transition('* => active', [
        style({
          opacity: 0,
        }),
        animate(
          '1000ms',
          style({
            opacity: 1,
          }),
        ),
      ]),
      transition('* => inactive', [
        style({
          opacity: 0,
        }),
        animate(
          '1000ms',
          style({
            opacity: 1,
          }),
        ),
      ]),
    ]),
  ],
})
export class ProductPage {
  @ViewChild(IonContent, {static: false}) content: IonContent;
  public reviews: any;
  public productFeatures: any;
  private selectedFeatures = new Map();
  primaryFeature = environment.PRIMARY_FETURE;
  public deliveryAddress: any[] = [];
  public alternateProducts: any[] = [];
  public productStock: number;
  selectedStoreData: any;
  product: any; // Used any type so that we can access key values in it
  productSubscription: any;
  browsedProducts = [];
  cart: any;
  cartSubscription: any;
  productListSubscription: any;
  browsedProductsSubscription: any;

  @Select(AuthState.getCurrentStore) currentStoreData$: Observable<any>;
  @Select(ProductState.getCurrentProduct) product$: Observable<any>;
  @Select(CustomerState.getBrowsedProducts) browsedProducts$: Observable<any>;
  @Select(ShoppingCartState.getCart) cart$: Observable<any>;
  @Select(ProductState.getPreviousProducts) previousProduct$: Observable<any>;
  @Select(CustomerState.getPartyId) customerPartyId$: Observable<any>;
  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;

  private searchedVariant: any;
  slideOpts = {
    slidesPerView: 2.1,
  };
  constructor(
    public productProvider: ProductProvider,
    private widget: WidgetUtils,
    private translation: L10nTranslationService,
    private hcProvider: HcProvider,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public customerDataProvider: CustomerDataProvider,
    private store: Store,
    public router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private activatedRoute: ActivatedRoute,
    private searchProvider: SearchProvider
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params.productId) this.productProvider.productId = params.productId
    });
    if(this.router.getCurrentNavigation().extras.state) this.searchedVariant = this.router.getCurrentNavigation().extras.state.variant;
    this.productSubscription = this.product$.subscribe(product => {
      if (product) {
        // When clicking the alternate product it should scroll to top
        // content object available when navigated from alternate product
        if (this.content) this.content.scrollToTop();
        // Assigned a copy of product object to mutate
        // so that inner properties of original object remains intact
        // If we use the original object it breaks the code when revisiting
        // as we are modifying the feature data.
        this.product = JSON.parse(JSON.stringify(product));
        this.productProvider.product = this.product;
        this.productFeatures = this.product.features;
        let productFeatureKeyList = Object.keys(this.productFeatures);

        let productFeatureList = [];
        for (let key of productFeatureKeyList) {
          productFeatureList.push([key, this.product.features[key]]);
          this.productFeatures[key].map((ele, index) => {
            if (this.searchedVariant && Object.keys(this.searchedVariant).length) {
              if (ele.description == (this.searchedVariant.COLOR && this.searchedVariant.COLOR.description) ||
                ele.description == (this.searchedVariant.SIZE && this.searchedVariant.SIZE.description)) {
                ele.status = 'active'
                this.selectedFeatures.set(key, ele);
              }
            } else if (!this.searchedVariant && index === 0) {
              ele.status = 'active'
              this.selectedFeatures.set(key, ele);
            } else {
              ele.status = 'inactive'
            }

          });
        }
        this.productProvider.product.features = productFeatureList;
        // Initially we need to check the stock of first selected feature hence pass the value of flag as true
        this.validateSelectedFeatures(true).then(() => {
          this.widget.hideLoading();
        }).catch(()=> {
          this.widget.hideLoading();
        })
        if(this.product.product_links && this.product.product_links.length) {
          // We will only have sku in the product_link hence invoked searchProducts API to get the product detail.
          this.getProducts(this.product.product_links.filter(product => product.link_type == 'alternate')).subscribe (products => {
            this.alternateProducts = products;
          })
        }
      }
    });
    this.browsedProductsSubscription = this.browsedProducts$.subscribe(browsedProducts => {
      this.browsedProducts = browsedProducts;
    })
    this.cartSubscription = this.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  ionViewDidEnter() {
    this.back();
  }

  back() {
    this.backButton.onClick = async () => {
      this.previousProduct$.pipe(take(1)).subscribe(products => {
        if(products.length) {
          this.productProvider.productId = products.pop();
          this.store.dispatch(new SetCurrent({ productId: this.productProvider.productId, previousProducts: products }));
          let navigationExtras: NavigationExtras = {
            queryParams: { productId: this.productProvider.productId }
          };
          this.router.navigate(["tabs/home/product"], navigationExtras);
        } else {
          this.router.navigate(["tabs/home"])
        }
      })
    };
  }

  ionViewWillEnter() {
    if (this.cart.address) {
      this.deliveryAddress = this.cart.address.filter(
        ele =>
          ele.address1 &&
          (ele.contactMechPurposeTypeId == 'PostalShippingDest' ||
            ele.contactMechPurposeTypeId == 'PostalPrimary'),
      );
    }
    this.productProvider
      .getReviews(this.productProvider.productId, 5, 0)
      .then((reviews: any) => {
        this.reviews = reviews;
      });
  }
  ngOnDestroy() {
    if(this.productSubscription) this.productSubscription.unsubscribe();
    if(this.browsedProductsSubscription) this.browsedProductsSubscription.unsubscribe();
    if(this.cartSubscription) this.cartSubscription.unsubscribe();
  }

  getVariantProduct(features) {
    // Used to validate the selected variant from API response
    let variantProduct = {
      productId: '',
      secondaryFeatures: [],
    };
    for (let variant of this.productProvider.product.variants) {
      // This flag is used to assure the validation of all the features
      // e.g. selectedFeature.featureValue = TEXT_MIDDLE
      // e.g. variant[featureId].productFeatureId is variant[SIZE].productFeatureId = TEXT_MIDDLE
      let isSelectedVariant = !features.some(
        selectedFeature =>
          selectedFeature.productFeatureId !=
          variant[selectedFeature.featureId].productFeatureId,
      );
      //Once the variant is found return the variant.
      if (isSelectedVariant && variant.productId) {
        // This is to handle the case when product variant is discontinued and we dont get productId
        variantProduct.productId = variant ? variant.productId : '';
        variantProduct.secondaryFeatures = features;
        return variantProduct;
      }
    }
  }

  addToCart(): void {
    /**
     * Moved feature validation to generic method as we need it following cases:
     * [1] while adding it to cart.
     * [2] befor navigating to other stores modal.
     * [3] before navigating to shipping modal
     */
    // While adding product to the cart there is no need to check the in-store stock hence pass the value of flag as false
    this.validateSelectedFeatures(false)
      .then(async (product: any) => {
        if (product.productStock <= 0) {
          let alert = await this.alertCtrl.create({
            header: this.translation.translate('Product unavailable'),
            message: this.translation.translate('Currently this product is out of stock in this store.'),
            buttons: [
              {
                text: this.translation.translate('Dismiss'),
              },
              {
                text: this.translation.translate('Check other stores'),
                handler: () => {
                  this.storeLocator();
                },
              },
            ],
          });
          await alert.present();
          return;
        } else {
          this.store.dispatch(new AddToCart({ item: product }));
        }
      })
      .catch(err => {
        return;
      });
  }

  getProductStock(productId) {
    this.currentStoreData$.pipe(take(1)).subscribe(currentStoreData => {
      this.productStock = undefined;
      let params = {
        sku: productId,
        facilityId: currentStoreData.facilityId,
      };
      this.hcProvider
        .callRequest('get', 'stock/check', params)
        .subscribe(
          (data: any) => {
            if (data && data.result && data.result.qty >= 0) {
              this.productStock = data.result.qty;
            }
          },
          err => {
            this.widget.hideLoading();
            this.widget.showToast(this.translation.translate('Something went wrong'));
            console.log(err);
          },
        );
    });
  }

  viewProductReviews() {
    this.widget.showLoading('');
    this.router.navigate(['tabs/home/product/product-reviews']);
  }

  //TODO: will add stars Plugin.
  getAvgRating(avgRating): string {
    let rating = avgRating;
    if (rating && rating.indexOf('.') !== -1) {
      rating = parseFloat(rating).toFixed(1);
    }
    return rating;
  }

  // Updating feature based on featureId, for now either size or color.
  setFeature(featureId, feature): void {
    this.widget.showLoading('');
    this.productFeatures[featureId].map(ele => (ele.status = 'inactive'));
    this.productFeatures[featureId]
      .filter(ele => ele.productFeatureId == feature.productFeatureId)
      .map(item => (item.status = 'active'));
    this.selectedFeatures.set(featureId, feature);
    // While changing the feature we need to update the value of productStock as per variantProductId hence pass the value of flag as true
    this.validateSelectedFeatures(true).then((selectedFeature: any) => {
      this.product.variants.filter((variant: any) => {
        if(variant.productId == selectedFeature.productId) {
          if(variant.price.listPrice) this.product.price.listPrice = variant.price.listPrice;
          if(variant.price.basePrice) this.product.price.basePrice = variant.price.basePrice
          if(variant.price.isSale) this.product.price.isSale = variant.price.isSale
          this.widget.hideLoading();
        }
      })
    }).catch(()=> {
      this.widget.hideLoading();
    })
  }

  getReviews(): any[] {
    let reviews = [];
    reviews = this.reviews.review.filter(ele => ele.review.length > 0);
    return reviews;
  }

  storeLocator(): void {
    // While checking the product on other store, there is no need to check the in-store stock hence pass the value of flag as false
    this.validateSelectedFeatures(false)
      .then(product => {
        let data = {
          item: product,
          partyName:
          this.cart.customer.partyName ||
          '',
        }
        this.router.navigate(["tabs/home/product/store-locator"], { state: {...data} });
      })
      .catch(err => {
        return;
      });
  }

  async addAddress() {
    let addressModal = await this.modalCtrl.create({
      component: DeliveryAddressPage,
      componentProps: {
        product: this.productProvider.cartItem,
      }
    });
    addressModal.onDidDismiss().then(() => {
      /* NOTE: below code is never used,as in success callback data is always null for both anonymous and customer flow. 
         Hence commented the code.*/
      /* this.storage.get('Address').then((data) => {
        if(data){
          this.deliveryAddress = data.filter( (el:any)=> ((el.partyId == this.cart.billToCustomerPartyId) ||(el.partyId == '_NA_')));
        }
      }) */
      this.deliveryAddress = this.cart.address.filter(
        ele =>
          ele.address1 && ele.contactMechPurposeTypeId == 'PostalShippingDest',
      );
      this.widget.hideLoading();
    });
    return await addressModal.present();
  }

  async shipToAddress(address: any) {
    let fullAddress = `${address.address1}, ${address.city} ${address.postalCode}`;
    // On ship-to-address flow there is no need to check in-store stock hence pass the value of flag as false
    this.validateSelectedFeatures(false).then(product => {
      this.customerPartyId$.pipe(take(1)).subscribe(async customerPartyId => {
      if (
        customerPartyId !==
        '_NA_'
      ) {
        const modal = await this.modalCtrl.create({
          component: ShippingFormPage,
          componentProps: {
            data: {
              item: product,
              contactMechId: address.contactMechId,
              address: fullAddress,
              phoneNumber: address.phoneNumber
            }
          }
        })
        return await modal.present();
      } else {
        this.store.dispatch(new AddToCart({ item: product, contactMechId: address.contactMechId}));
      }
    });
    });
  }

  validateSelectedFeatures(checkProductStock, productVariant?) {
    return new Promise((resolve, reject) => {
      let features = [];
      this.selectedFeatures.forEach((value, key) => {
        // Selected features push into the feature array to validate the variant from API response
        features.push(value);
        features
          .filter(ele => ele.description == value.description)
          .map(item => (item.featureId = key));
      });
      // Now check all the existing feature selected or not.
      for (let selectedFeature of features) {
        if (!selectedFeature.productFeatureId) {
          this.widget.showAlert(
            'Please select a ' + selectedFeature.featureId.toLowerCase(),
          );
          reject(true);
          return;
        }
      }
      if (features.length) {
        // If features exist then call getVariantProduct method to validate the variant
        let variant = productVariant
          ? productVariant
          : this.getVariantProduct(features);
        if (variant) {
          // If get the variant the set the productId and features
          this.productProvider.cartItem = this.productProvider.prepareProduct();
          this.productProvider.cartItem.productId = variant.productId;
          this.productProvider.cartItem.productStock = this.productStock;
          this.productProvider.cartItem.features = variant.secondaryFeatures;
        } else {
          // If variant product is discontinued then show toast and return
          //this.widget.showToast(this.translation.translate('Product is not available'));
          return;
        }
      } else {
        this.productProvider.cartItem = this.productProvider.prepareProduct();
        this.productProvider.cartItem.features = [];
        this.productProvider.cartItem.productId = this.productProvider.product.productId;
        this.productProvider.cartItem.productStock = this.productStock;
      }
      if (checkProductStock) {
        this.getProductStock(this.productProvider.cartItem.productId);
      }
      resolve(this.productProvider.cartItem);
    });
  }

  getProducts(products: any[]): Observable<any> {
    const currentStoreData = this.store.selectSnapshot(AuthState.getCurrentStore);
    let productObservables = products.map((product: any) => {
      let queryParams = {
        queryString: undefined,
        filters: []
      };
      queryParams.filters.push({ key: 'sku', value: { 'eq': product.linked_product_sku }});
      return from(this.searchProvider.prepareQuery(queryParams)).pipe(mergeMap((request: any) => {
        let payload = {
          request
        };
        return this.productProvider.findProducts(payload, currentStoreData.facilityId).pipe(
          filter((resp: any) =>  resp.result && resp.result.docs && resp.result.docs.length), // Ensure that SKU is found
          map((resp: any) => {
            const el = resp.result.docs[0];
            //We will need following properties on product-card component. Hence mapped the data accrodingly.
            product['name'] = el.name ? el.name : '';
            product['uf_price'] = el.price.basePrice ? el.price.basePrice : '';
            product['productid'] = el.productId ? el.productId : '';
            product['brand'] = el.brandName ? el.brandName : '';
            product['imageurl'] = el.images.small ? el.images.small : '';
            return product;
          }),
          catchError(err => {
            throw 'error ' + err;
          })
        );
      }));
    });
    return forkJoin(productObservables);
  }

  shipToStore() {
    this.currentStoreData$.subscribe(currentStoreData => {
      let fullAddress = `${currentStoreData.address.address1}, ${currentStoreData.address.city} ${currentStoreData.address.postalCode}`;
      // On ship-to-address flow there is no need to check in-store stock hence pass the value of flag as false
      this.validateSelectedFeatures(false).then(async product => {
        const modal = await this.modalCtrl.create({
          component: ShippingFormPage,
          componentProps: {
            data: {
              item: product,
              contactMechId: currentStoreData.address.id,
              address: fullAddress,
              phoneNumber: currentStoreData.address.phoneNumber
            }
          }
        })
        return await modal.present();
      });
    });
  }

}
