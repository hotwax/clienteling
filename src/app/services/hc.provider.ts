import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CacheService } from 'ionic-cache';
@Injectable({
  providedIn: 'root',
})
export class HcProvider {
  public baseUrl: string;
  public googleMyBusinessURL: string;
  public googleAccount: string;

  constructor(private http: HttpClient, private cache: CacheService) {
    if (
      environment.hasOwnProperty('BASE_URL') &&
      environment.BASE_URL.trim() !== ''
    ) {
      this.baseUrl = environment.BASE_URL.endsWith('/')
        ? environment.BASE_URL
        : environment.BASE_URL + '/';
    }
    if (
      environment.hasOwnProperty('GOOGLE_MY_BUSINESS_URL') &&
      environment.GOOGLE_MY_BUSINESS_URL.trim() !== ''
    ) {
      this.googleMyBusinessURL = environment.GOOGLE_MY_BUSINESS_URL;
    }
    if (
      environment.hasOwnProperty('GOOGLE_ACCOUNT') &&
      environment.GOOGLE_ACCOUNT.trim() !== ''
    ) {
      this.googleAccount = environment.GOOGLE_ACCOUNT;
    }
  }

  processRequest(request): any {
    let body: any = request.body;
    let url: any = request.url;
    let parmas: any = request.params;
    // TODO: We should use 'request' method instead of 'GET' or 'POST'. At present we are getting some internal error in http.js method ((method.toUpperCase))
    return this.http.post(url, body, parmas);
  }

  callRequest(type, endPoint, params?, groupKey?, delayType?, url?) {
    // Cache: (key, observable, groupKey, ttl, delayType)
    // ttl set the cache TTL for this request
    // Default is 'expired', setting delayType as 'all' send a new request to the server every time,
    // you can also set it to 'none' which indicates that it should only send a new request when it's expired
    let baseUrl = url ? environment[url] : this.baseUrl;
    if (type == 'get') {
      if (groupKey) {
        let cacheKey = baseUrl + endPoint;
        let request = this.http.get(baseUrl + endPoint);
        if (params) {
          // If params exist then update the value of cacheKey and request with params
          cacheKey += '?params=' + JSON.stringify(params);
          request = this.http.request(type, baseUrl + endPoint, {
            params: params,
          });
        }
        // delayType = 'all' indicates that it should send a new request to the server every time but initially serve from cache
        if (delayType)
          return this.cache.loadFromDelayedObservable(
            cacheKey,
            request,
            groupKey,
            undefined,
            delayType,
          );
        return this.cache.loadFromDelayedObservable(
          cacheKey,
          request,
          groupKey,
        );
      } else {
        if (params)
          return this.http.request(type, baseUrl + endPoint, {
            params: params,
          });
        return this.http.request(type, baseUrl + endPoint);
      }
    } else {
      let parameters = {};
      if(params) {
        if (params == 'cart') params = JSON.stringify(params);
        parameters = type === 'post' ? { body: params, observe: 'response' } : { params: params }
      }
      return this.http.request(type, baseUrl + endPoint, parameters);
    }
  }

  getStore(keyword) {
    keyword = keyword || ''; // keyword is null or defined
    let url =
      this.googleMyBusinessURL +
      this.googleAccount +
      `locations?filter=address.postal_code=*${keyword}+AND+address.administrative_area=*${keyword}+AND+address.locality=*${keyword}+AND+open_info.status=OPEN`;
    let cacheKey = url;
    let request = this.http.get(url);
    let groupKey = 'location';
    return this.cache.loadFromDelayedObservable(cacheKey, request, groupKey);
  }
}
