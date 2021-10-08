import { Component, Inject } from '@angular/core';
import { ProductProvider } from '../../services/product.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { L10N_LOCALE, L10nLocale } from 'angular-l10n';

@Component({
  selector: 'page-product-reviews',
  templateUrl: 'product-reviews.html',
})
export class ProductReviewsPage {
  reviews: any = {};
  reviewList: any = [];
  averageRating: any = '0';
  viewSize: number = 5;
  viewIndex: number = 0;

  constructor(
    private productProvider: ProductProvider,
    private widget: WidgetUtils,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {}

  ionViewWillEnter() {
    /*This is not working right now so get review is called one's from constructor. */
    this.getReview(this.viewSize, this.viewIndex);
  }

  // This will get the review from product provider which return promise.
  getReview(viewSize, viewIndex, event?): void {
    this.productProvider
      .getReviews(this.productProvider.productId, viewSize, viewIndex)
      .then((reviews: any) => {
        if (!reviews.error && Object.keys(reviews).length > 0) {
          this.reviews = reviews;
          this.averageRating = this.getAvgRating(
            reviews.aggregatedRating.averageRating,
          );
          this.reviewList.push.apply(this.reviewList, this.reviews.review);
        }
        if (event) {
          event.target.complete();
        }
        this.widget.hideLoading();
        this.reviewList.map(
          ele =>
            (ele.limit = ele.review.length > 125 ? 125 : ele.review.length),
        );
      });
  }

  //average rating.
  getAvgRating(avgRating): string {
    let rating = avgRating + '';
    if (rating && rating.indexOf('.') !== -1) {
      rating = parseFloat(rating).toFixed(1);
    }
    return rating;
  }

  loadMoreReviews(event) {
    this.viewIndex = Math.ceil(
      (this.viewIndex * this.viewSize + 1) / this.viewSize,
    );
    this.getReview(this.viewSize, this.viewIndex, event);
  }

  getReviews(): any[] {
    let reviews = [];
    reviews = this.reviewList.filter(ele => ele.review.length > 0);
    return reviews;
  }
}
