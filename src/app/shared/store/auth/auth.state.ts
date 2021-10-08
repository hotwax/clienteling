import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Auth } from './auth.model';
import {
  Login,
  Logout,
  FetchStores,
  SetCurrentStore,
  SetCurrentLocale,
} from './auth.actions';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../../../services/auth.provider';
import { HttpResponse } from '@angular/common/http';
import { WidgetUtils } from '../../widget.util';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { PrepareEmptyCart } from '../shopping-cart/shopping-cart.actions';
import { ClearSoldItemsData } from '../sold-item/sold-item.action';
import { FirebaseProvider } from '../../../services/firebase.provider';

@State<Auth>({
  name: 'auth',
  defaults: {
    token: null,
    stores: [],
    currentStore: {},
    currentLocale: null
  },
})
@Injectable({
  providedIn: 'root',
})
export class AuthState {
  /**
   * Memoized selector that returns the token value
   */
  @Selector()
  static getToken(state: Auth): string | null {
    return state.token;
  }

  /**
   * Memoized selector that returns the list of all the associated stores
   */
  @Selector()
  static getStores(state: Auth): any[] | null {
    return state.stores;
  }

  /**
   * Memoized selector that returns the current store
   */
  @Selector()
  static getCurrentStore(state: Auth): any | null {
    return state.currentStore;
  }

  /**
   * Memoized selector that returns the authenticated state
   */
  @Selector()
  static isAuthenticated(state: Auth): boolean {
    // TODO
    // As per the current implementation, we allowed the user to log in into
    // the app only when both these conditions are met
    // This need to be improved the API should only authenticate
    // when the user is associated with the store
    return !!state.token && state.stores.length > 0;
  }
 
  /**
   * Memoized selector that returns the selected locale
   */
   @Selector()
   static getCurrentLocale(state: Auth): string | null {
     return state.currentLocale;
   }

  constructor(
    private authProvider: AuthProvider,
    private store: Store,
    private dialog: WidgetUtils,
    private translation: L10nTranslationService,
    private firebaseProvider: FirebaseProvider
  ) {}

  @Action(Login)
  login(ctx: StateContext<Auth>, action: Login) {
    this.dialog.showLoading('');
    return this.authProvider.login(action.payload).pipe(
      tap(
        (response: HttpResponse<any>) => {
          ctx.patchState({
            token: response.body.token,
          });
          this.store.dispatch(new FetchStores());
        },
        err => {
          // TODO Need to check if this is needed
          if (err.error.hasOwnProperty('_ERROR_MESSAGE_')) {
            this.dialog.showToast(err.error._ERROR_MESSAGE_);
          } else {
            let error =
              err.status == 401 || err.status == 400
                ? this.translation.translate('Sorry, your username or password is incorrect. Please try again.')
                : this.translation.translate('Something went wrong');
            this.dialog.showToast(error);
          }
          this.dialog.hideLoading();
        },
      ),
    );
  }

  @Action(FetchStores)
  fetchStores(ctx: StateContext<Auth>) {
    return this.authProvider.fetchStores().pipe(
      tap(
        (response: any) => {
          if(response.docs.length) {
            const currentStore =
            response.docs.length > 0 ? response.docs[0] : {};
            ctx.patchState({
              stores: response.docs,
              currentStore,
            });
            if (currentStore) {
              this.firebaseProvider.subscribe(currentStore.facilityId);
            }
            this.store.dispatch(new PrepareEmptyCart({}));
            this.dialog.hideLoading();
          } else {
            this.dialog.hideLoading();
            this.dialog.showToast(this.translation.translate('You do not have permission to use the app'));
          }
        },
        err => {
          this.dialog.hideLoading();
          this.dialog.showToast(this.translation.translate('Something went wrong'));
        },
      ),
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<Auth>) {
    ctx.patchState({
      token: null,
      stores: [],
      currentStore: {},
    });
    ctx.dispatch(new ClearSoldItemsData());
    this.firebaseProvider.unregister();
  }

  @Action(SetCurrentStore)
  setCurrentStore(ctx: StateContext<Auth>, action: SetCurrentStore) {
    let currentStore = ctx.getState().currentStore;
    if (currentStore) {
      this.firebaseProvider.unsubscribe(currentStore.facilityId);
    }
    currentStore = ctx
      .getState()
      .stores.find(store => store.facilityId === action.payload.facilityId);
    ctx.patchState({
      currentStore,
    });
    if (currentStore) {
      this.firebaseProvider.subscribe(currentStore.facilityId);
    }

    this.store.dispatch(new PrepareEmptyCart({}));
  }

  @Action(SetCurrentLocale)
  setCurrentLocale(ctx: StateContext<Auth>, action: SetCurrentLocale) {
    ctx.patchState({
      currentLocale: action.payload.locale
    });
  }
}
