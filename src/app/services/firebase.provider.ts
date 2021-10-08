import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { EMPTY } from 'rxjs';
import { isEmpty } from 'rxjs/operators';

/*
  Provider for Firebase specific operations
*/
@Injectable({
  providedIn: 'root',
})

export class FirebaseProvider {

  constructor(
    private firebase: FirebaseX, 
    private platform: Platform
    ) {}

  isFirebaseEnabled() {
    return this.platform.is('cordova')
        && environment.hasOwnProperty('FIREBASE_NOTIFICATIONS_ENABLED') 
        && environment.FIREBASE_NOTIFICATIONS_ENABLED;
  }

  init() {
    // TODO Fix this return empty promise for disable case
    if (this.isFirebaseEnabled()) {
      this.initialisePermissions().then(() => {
        this.firebase.getToken().then(
          (token) => { 
            //  TODO save the token to server
          }
        ).catch(
          (error) => { console.log('Error Getting notification token:', error); }
        );
    
        this.firebase.onTokenRefresh().subscribe(
          (token: string) => {
            // TODO Save the new token on server
          }
        );
      })
    }
  }

  initialisePermissions() {
    return new Promise((resolve, reject) => {
      if (this.platform.is('ios')) {
        this.firebase.hasPermission().then(hasPermission => {
          if (!hasPermission) {
            this.firebase.grantPermission().then(success => {
              resolve(true);
            }).catch(error => {
              reject(false);
              console.log("Permission error:", error);
            });
          } else {
            resolve(true);
          }
        });
      } else {
        resolve(true);
      }
    })
  }

  onNotificationOpen() {
    if (this.isFirebaseEnabled()) {
      return this.firebase.onMessageReceived();
    } else {
      // Reference: https://rxjs-dev.firebaseapp.com/api/operators/isEmpty
      return EMPTY.pipe(isEmpty());
    }
  }

  subscribe(topic) {
    // TODO Fix this return empty promise for disable case
    if (this.isFirebaseEnabled()){
      return this.firebase.subscribe(topic);
    } 
  }
  
  unsubscribe(topic) {
    // TODO Fix this return empty promise for disable case
    if (this.isFirebaseEnabled()) return this.firebase.unsubscribe(topic);
  }

  unregister() {
    // TODO Fix this return empty promise for disable case
    if (this.isFirebaseEnabled()) return this.firebase.unregister();
  }

}
