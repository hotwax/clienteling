import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ProductReviewsPage } from './product-reviews';
import { L10nTranslationModule } from 'angular-l10n';
// import { StarRatingModule } from 'ionic3-star-rating';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { ProductReviewsPageRoutingModule } from './product-reviews-routing.module';

@NgModule({
  declarations: [ProductReviewsPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    // StarRatingModule,
    TruncateModule,
    ProductReviewsPageRoutingModule,
    CommonModule
  ],
  exports: [ProductReviewsPage],
})
export class ProductReviewsModule {}
