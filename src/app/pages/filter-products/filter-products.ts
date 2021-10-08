import { Component, Inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HcProvider } from '../../services/hc.provider';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { ProductProvider } from '../../services/product.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'page-filter-products',
  templateUrl: 'filter-products.html',
})
export class FilterProductsPage {

  filters: string = 'categories';
  filterProductsForm: FormGroup;
  categoriesList
  // TODO check if we can overide the onchange event and remove the use of flag
  // Currently when we change the value of parent or child categories programatically it triggers the
  // the ion change event due to which we are in loop for calling the same function
  // the flag ensures we execute the code only once at a time
  isCategoryUpdating = false;

  constructor(
    public hcProvider: HcProvider,
    public translateService: L10nTranslationService,
    private modalCtrl: ModalController,
    public productProvider: ProductProvider,
    private widget: WidgetUtils,
    private formBuilder: FormBuilder,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.getCategories()
    // Initially assigned last stored form values
    this.filterProductsForm = this.formBuilder.group(this.productProvider.categoriesFilter);
  }

  public getCategories() {
    let params = {
      size: 50
    }
    this.widget.showLoading('');
    this.hcProvider.callRequest('get', 'category/_search', params, 'categories').subscribe(
      (data: any) => {
        if(data) {
          // Get all the categories whose product_count or children_count is greater than zero.
          this.productProvider.categories = data.hits.hits.filter(
            category => category._source.product_count > 0 || category._source.children_count > 0,
          );

          // Added all the categories as form control and updated the current selection based upon the filter
          // state stored in provider variable
          this.filterProductsForm = this.formBuilder.group(Object.assign({}, this.productProvider.categories.reduce(function(acc, category, i) {
            acc[category._source.id] = false;
            return acc;
          }, {}), this.productProvider.categoriesFilter));

          // Get parent-categories from all the categories by filtering the records with level 2
          this.productProvider.parentCategories = this.productProvider.categories.filter(category => category._source.level == 2).map(ele => ele._source)
        }
        this.widget.hideLoading();
      },
      err => {
        this.widget.hideLoading();
        this.widget.showToast(
          this.translateService.translate('Something went wrong'),
        );
      },
    );
  }

  getCategoryName(categoryId) {
    return this.productProvider.categories.find(category => category._source.id == categoryId)._source.name;
  }

  selectCategory(event,category) {
    // TODO check if we can overide the onchange event and remove the use of flag
    if (!this.isCategoryUpdating) {
      this.isCategoryUpdating = true;
      let selectedCategory = this.productProvider.categories.find(categoryItem => {
        return categoryItem._source.id === category.id
      });
      // Recursively updates the state of childrens
      this.checkChildCategory(event, selectedCategory._source.children_data)
      let parentCategory = this.productProvider.categories.find(categoryItem => {
        return categoryItem._source.id === selectedCategory._source.parent_id;
      });
      if (parentCategory) {
        // Recursively updates parents if required
        this.checkParentCategory(parentCategory);
      }
      this.isCategoryUpdating = false;
    }
  }

  checkChildCategory(event, children_data) {
    children_data.forEach(element => {
      this.filterProductsForm.get(element.id).patchValue(event.detail.checked, { emitViewToModelChange: false });
      this.checkChildCategory(event, element.children_data);
    });
  }

  checkParentCategory(category) {
    let currentValue = this.filterProductsForm.value[category._source.id];
    let calculatedValue = !category._source.children_data.some(childCategory => {
      return !this.filterProductsForm.value[childCategory.id];
    })
    // if the current value and the value based upon the change is same
    // there is no need to propagate the change to it's parent
    if (currentValue !== calculatedValue) {
      this.filterProductsForm.controls[category._source.id].patchValue(calculatedValue, { emitViewToModelChange: false });
      let parentCategory = this.productProvider.categories.find(categoryItem => {
        return categoryItem._source.id === category._source.parent_id;
      });
      if (parentCategory) this.checkParentCategory(parentCategory);
    }

  }

  clearFilters() {
    // Apply false to all the category filter values
    this.filterProductsForm.patchValue(this.productProvider.categories.reduce(function(acc, category, i) {
      acc[category._source.id] = false;
      return acc;
    }, {}));
  }

  closeModal(): void {
    // When closing the modal using done button the categoriesFilter variable will be assigned the
    // the current state of the form for persistence
    this.productProvider.categoriesFilter = this.filterProductsForm.value
    this.modalCtrl.dismiss({
      'dismissed': true
    })
  }

}
