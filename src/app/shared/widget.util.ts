import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Injectable } from '@angular/core';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';

@Injectable({
  providedIn: 'root',
})
export class WidgetUtils {
  isLoading;
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private translation: L10nTranslationService,
  ) {
    this.isLoading = false;
  }

  async showAlert(message) {
    const alert = await this.alertCtrl.create({
      message: message + '.',
      buttons: ['OK'],
    });
    alert.present();
  }

  async showLoading(msg) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: msg,
      backdropDismiss: true
    }).then(loader => {
      loader.present().then(() => {
        if (!this.isLoading) {
          loader.dismiss();
        }
      });
    });
  }

  async hideLoading() {
    this.isLoading = false;
    while (await this.loadingCtrl.getTop() !== undefined) {
      return await this.loadingCtrl.dismiss();
    }
  }

  // Customize toast position to show above tabs: https://github.com/ionic-team/ionic/issues/17499
  async showToast(message) {
    let toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  setAutoFocus(el) {
    // Initially the focus in just blink hence added setTimeout to make it stable
    setTimeout(() => {
      el.setFocus();
    }, 500);
  }
}
