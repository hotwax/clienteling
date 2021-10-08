import { Injectable } from '@angular/core';
import { HcProvider } from './hc.provider';

/**
 * Provider specific to authentication specific operations
 */

@Injectable({
  providedIn: 'root',
})
export class AuthProvider {
  constructor(private hcProvider: HcProvider) {}

  /**
   * Method calls the login API to authenticate user
   *
   * @param {Object} payload payload object containing USERNAME and PASSWORD.
   *
   *
   * @return {Observable<Response>} Returns instance of Observable<Response> returned by Http.post()
   */
  login(payload) {
    return this.hcProvider.callRequest('post', 'login', payload);
  }

  /**
   * Method calls the Stores API to get associated stores for current loggedin user
   *
   *
   * @return {Observable<Response>} Returns instance of Observable<Response> returned by Http.get()
   */
  fetchStores() {
    return this.hcProvider.callRequest('get', 'me/stores');
  }
  /**
   * Method calls the updatePassword API to update user password
   *
   * @param {Object} payload payload object containing oldPassword, newPassword and newPasswordVerify.
   *
   *
   * @return {Observable<Response>} Returns instance of Observable<Response> returned by Http.post()
   */
  updatePassword(payload) {
    return this.hcProvider.callRequest('post', 'updatePassword', payload);
  }
}
