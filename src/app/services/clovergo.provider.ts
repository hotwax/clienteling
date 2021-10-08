import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';

declare var clovergo: any;

@Injectable({
  providedIn: 'root',
})
export class ClovergoProvider {
  public cloverDeviceConnected: boolean = false;
  // As currently we do not have support for iOS we need to return
  // object with message key for consistency
  private notSupportedResponse = {
    message: this.translation.translate('Not Supported'),
  };

  constructor(
    private platform: Platform,
    private translation: L10nTranslationService,
  ) {}

  connect() {
    return new Promise((resolve, reject) => {
      if (this.platform.is('android') && typeof clovergo !== 'undefined') {
        clovergo.connect(
          (res: any) => {
            // Handled when the device is not found
            if (res.type == 'CLOVER_DEVICE_READY') {
              this.cloverDeviceConnected = true;
              resolve(res);
            } else {
              reject(res);
            }
          },
          (error: any) => {
            reject(error);
          },
        );
      } else {
        reject(this.notSupportedResponse);
      }
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      if (this.platform.is('android') && typeof clovergo !== 'undefined') {
        clovergo.disconnect(
          (res: any) => {
            this.cloverDeviceConnected = false;
            resolve(res);
          },
          (error: any) => {
            reject(error);
          },
        );
      } else {
        reject(this.notSupportedResponse);
      }
    });
  }

  init(cloverGoConfig) {
    if (this.platform.is('android')) {
      if (typeof clovergo !== 'undefined') clovergo.init(cloverGoConfig);
    }
  }

  sale(saleData) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('android')) {
        if (typeof clovergo !== 'undefined') {
          clovergo.sale(
            saleData,
            (res: any) => {
              resolve(res);
            },
            (error: any) => {
              reject(error);
            },
          );
        } else {
          reject(this.notSupportedResponse);
        }
      } else {
        reject(this.notSupportedResponse);
      }
    });
  }

  sign(signData) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('android') && typeof clovergo !== 'undefined') {
        // TODO make signature dynamic with signature pad plugin
        clovergo.sign(
          {
            signature: [
              [270, 857],
              [280, 844],
              [302, 817],
              [332, 780],
              [360, 743],
            ],
          },
          (signres: any) => {
            resolve(signres);
          },
          (signerror: any) => {
            reject(signerror);
          },
        );
      } else {
        reject(this.notSupportedResponse);
      }
    });
  }

  voidPayment(paymentInfo) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('android') && typeof clovergo !== 'undefined') {
        clovergo.voidPayment(
          paymentInfo,
          (res: any) => {
            resolve(res);
          },
          (error: any) => {
            reject(error);
          },
        );
      } else {
        reject(this.notSupportedResponse);
      }
    });
  }
}
