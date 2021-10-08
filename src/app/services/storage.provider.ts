import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageProvider {
  constructor() {}

  /* Set specific key in local storage */
  setLocalStorageItem(key: string, value: any) {
    this[key] = value;
    // Setting the value is done mostly done during initialisation
    // So we can make it async.
    // We have also stored it locally and returned in getToken method
    // so there will not be any synchronisation issues.
    return Promise.resolve().then(function () {
      localStorage.setItem(key, value);
    });
  }

  /* Get specific key in local storage */
  getLocalStorageItem(key: string) {
    if (!this[key]) {
      this[key] = localStorage.getItem(key);
    }
    return this[key];
  }

  /* Clear specific key value in local storage  */
  removeLocalStorageItem(key: string) {
    this[key] = undefined;
    localStorage.removeItem(key);
  }

  // TODO
  /* Clear all key value  in local storage  */
  removeAllLocalStorageItems() {}

  /* Set specific key in session storage */
  setSessionStorageItem(key: string, value: any) {
    this[key] = value;
    // Setting the value is done mostly done during initialisation
    // So we can make it async.
    // We have also stored it locally and returned in getToken method
    // so there will not be any synchronisation issues.
    return Promise.resolve().then(function () {
      sessionStorage.setItem(key, value);
    });
  }

  /* Get specific key in session storage */
  getSessionStorageItem(key: string) {
    if (!this[key]) {
      this[key] = sessionStorage.getItem(key);
    }
    return this[key];
  }

  /* Clear specific key value in session storage  */
  removeSessionStorageItem(key: string) {
    this[key] = undefined;
    // Not done with promise with assumption that it may give wrong results
    // with get api called in next fraction of seconds
    sessionStorage.removeItem(key);
  }

  // TODO
  /* Clear all key value  in session storage  */
  removeAllSessionStorageItems() {}
}
