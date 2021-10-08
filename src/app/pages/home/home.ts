import { Component, Inject, OnInit } from '@angular/core';
import {
  ModalController,
  Platform
} from '@ionic/angular';
import { ProductProvider } from '../../services/product.provider';
import { BarcodeScannerPage } from '../barcode-scanner/barcode-scanner';
import { FilterProductsPage } from '../filter-products/filter-products';
import { L10nLocale, L10N_LOCALE } from 'angular-l10n';
import { ShoppingCartState } from "../../shared/store/shopping-cart/shopping-cart.state";
import { ShoppingCart } from '../../models/shopping-cart/shopping.cart';
import { CustomerDataProvider } from '../../services/customerdata.provider';
import { listAnimation } from '../../../animations';
import { Store, Select } from '@ngxs/store';
import { AuthState } from '../../shared/store/auth/auth.state';
import { ProductState } from '../../shared/store/product/product.state';
import { Observable } from 'rxjs';
import { PrepareCart } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { FindProducts, SetCurrent } from '../../shared/store/product/product.action';
import { environment } from '../../../environments/environment';
import { CustomerState } from '../../shared/store/customer/customer.state';
import { NavigationExtras, Router } from '@angular/router';
import { SearchProvider } from '../../services/search.provider';

@Component({
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
  animations: [listAnimation],
})
export class HomePage implements OnInit {
  keyword: string = '';
  parentCategories: any = [];
  selectedFacetNames: any = [];
  selectedFacetIds: any[] = [];
  categories: any = {}; // Used to manage the multi selection of categories.
  facetMap = new Map();
  cart: ShoppingCart;
  inactiveShoppingCarts: any = [];
  segment: string = 'search';
  currentStoreData: any = {};
  listSize = 0
  productListSubscription: any;
  totalProductCountSubscription: any;
  browsedProductsSubscription: any;
  suggestedProductsSubscription: any;
  mostViewedProductsSubscription: any;
  suggestedProducts = [];
  browsedProducts = [];
  mostViewedProducts = [];
  // We have used the count variable because we have to use the count at multiple places in html and currently we have
  // a list from form with all the categories with boolean value from checkbox. Whenever the filter is changes the count is also
  // calculated and stored to be used in html
  categoriesFilterCount = 0;

  @Select(ShoppingCartState.getCart) cart$: Observable<any>;
  @Select(AuthState.getCurrentStore) currentStoreData$: Observable<any>;
  @Select(ProductState.getProducts) productList$: Observable<any>;
  @Select(ProductState.getTotalProductCount) totalProductCount$: Observable<any>;
  @Select(CustomerState.getBrowsedProducts) browsedProducts$: Observable<any>;
  @Select(CustomerState.getSuggestedProducts) suggestedProducts$: Observable<any>;
  @Select(CustomerState.getMostViewedProducts) mostViewedProducts$: Observable<any>;
  slideOpts = {
    slidesPerView: 2.1,
  };

  constructor(
    private modalCtrl: ModalController,
    public productProvider: ProductProvider,
    public customerDataProvider: CustomerDataProvider,
    private store: Store,
    public platform: Platform,
    public router: Router,
    private searchProvider: SearchProvider,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.currentStoreData$.subscribe(currentStoreData => {
      this.currentStoreData = currentStoreData;
    });
    // Product list size is needed for list animations
    this.productListSubscription = this.productList$.subscribe(list => {
      this.listSize = list.length;
    });
    // We need to have individual subscription when we have a combined subscription of 
    // customer analytics we have values even when data other than analytics is updated
    this.browsedProductsSubscription = this.browsedProducts$.subscribe(browsedProducts => {
      this.browsedProducts = browsedProducts;
    })
    this.suggestedProductsSubscription = this.suggestedProducts$.subscribe(suggestedProducts => {
      this.suggestedProducts = suggestedProducts;
    })
    this.mostViewedProductsSubscription = this.mostViewedProducts$.subscribe(mostViewedProducts => {
      this.mostViewedProducts = mostViewedProducts;
    })
    this.store.dispatch(new PrepareCart({}));
  }

  ngOnInit(): void {
    // Initially call the API to get root level categories
    this.getProducts();
  }

  ngOnDestroy() {
    if(this.productListSubscription) this.productListSubscription.unsubscribe();
    if(this.totalProductCountSubscription) this.totalProductCountSubscription.unsubscribe();
    if(this.browsedProductsSubscription) this.browsedProductsSubscription.unsubscribe();
    if(this.suggestedProductsSubscription) this.suggestedProductsSubscription.unsubscribe();
    if(this.mostViewedProductsSubscription) this.mostViewedProductsSubscription.unsubscribe();
  }

  segmentChanged(ev) {
    this.segment = ev.detail.value;
  }

  loadMoreProducts(event) {
    this.getProducts(
      this.keyword,
      undefined,
      Math.ceil(this.listSize / 10).toString(),
      event,
    );
  }

  async scanBarcode() {
    // Open the scanner in modal to avoid the case where if we close the barcode scanner then loader display on home page
    const modal = await this.modalCtrl.create({
      component: BarcodeScannerPage,
      componentProps: {
        page: 'home'
      }
    })
    return await modal.present();
    // Reference: https://forum.ionicframework.com/t/barcode-scanner-closes-page-on-cancel/77475/8
  }

  searchProducts(event) {
    if (event && event.key === "Enter") {
      this.keyword = event.target.value;
      this.getProducts(this.keyword, undefined, '0');
    }
  }

  clearSearchbar() {
    // To get the default list of products after clearing the searchbar
    this.getProducts();
  }

  private getProducts(
    keyword?,
    viewSize?,
    viewIndex?,
    event?,
    productStoreId?,
  ) {
    let vSize = viewSize ? viewSize : environment.VIEW_SIZE;
    let vIndex = viewIndex ? viewIndex : '0';
    let params = {
      sortBy: 'brandName asc',
      viewSize: vSize,
      viewIndex: vIndex,
    };
    let queryParams = {
      queryString: undefined,
      filters: []
    };
    if (keyword) queryParams.queryString = keyword;
    if (this.currentStoreData.productStoreId)
      params['productStoreId'] = this.currentStoreData.productStoreId;
    if (this.productProvider.categoriesFilter && Object.keys(this.productProvider.categoriesFilter).length !== 0) {
      let selectedCategoryIds = Object.keys(this.productProvider.categoriesFilter).reduce((acc, category) => {
        if (this.productProvider.categoriesFilter[category]) acc.push(category);
        return acc;
      }, []);
      this.categoriesFilterCount = selectedCategoryIds.length;
      if (selectedCategoryIds.length) queryParams.filters.push({ key: 'category_ids', value: { 'in': selectedCategoryIds } });
    }
    queryParams.filters.push({ key: 'status', value: { 'in': [0,1] } });
    if (event) params['event'] = event;

    this.searchProvider.prepareQuery(queryParams).then((request) => {
      params['request'] = request;
      this.store.dispatch(new FindProducts(params));
    })
  }

  /* This will navigate customer to product detail page and also initialize customerId in provider and this provider will
    ready to call product rating API.*/
  public viewProduct(productId): void {
    this.productProvider.productId = productId;
    this.store.dispatch(new SetCurrent({ productId: productId }));
    let navigationExtras: NavigationExtras = {
      queryParams: { productId: productId }
    };
    this.router.navigate(["tabs/home/product"], navigationExtras);
  }

  async filterProducts() {
    const modal = await this.modalCtrl.create({
      component: FilterProductsPage
    })
    modal.onDidDismiss().then((data) => {
      this.getProducts(
        this.keyword,
        undefined,
        '0'
      );
    });
    return await modal.present();
  }

}
