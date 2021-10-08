import { Component, OnInit,  ViewChild, ElementRef, Inject } from '@angular/core';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';

@Component({
  templateUrl: 'dashboard.html',
  styleUrls: ['dashboard.scss'],
})
export class DashboardPage implements OnInit {
  @ViewChild("totalOrders") totalOrders: ElementRef;
  @ViewChild("processedOrders") processedOrders: ElementRef;
  public totalOrdersChart: Chart;
  public processedOrdersChart: Chart;

  constructor(
    public router: Router,
    public translation: L10nTranslationService,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) { }

  ionViewWillEnter() {
    // Currently used the hard coded values for Starting, Before cutoff and After cutoff orders.
    this.totalOrdersChart = this.generateChart(this.totalOrders.nativeElement, [7,10,3])
    this.processedOrdersChart = this.generateChart(this.processedOrders.nativeElement, [7,10,3])
  }

  generateChart(element, orders) {
    let colorVariables = window.getComputedStyle(document.body);
    return new Chart(element, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: orders,
            backgroundColor: [
              colorVariables.getPropertyValue('--ion-color-primary'),
              colorVariables.getPropertyValue('--ion-color-secondary'),
              colorVariables.getPropertyValue('--ion-color-tertiary')
            ],
          }
        ]
      },
      options: {
        responsive: true
      }
    });
  }

  back() {
    this.router.navigate(['tabs/order-fulfillment']);
  }

  ngOnInit() {}

}
