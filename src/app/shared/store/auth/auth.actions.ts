// Defined all the actions for AuthState

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { USERNAME: string; PASSWORD: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class FetchStores {
  static readonly type = '[Auth] Fetch Stores';
}
export class SetCurrentStore {
  static readonly type = '[Auth] Set Current Store';
  constructor(public payload: { facilityId: string }) {}
}
export class SetCurrentLocale {
  static readonly type = '[Auth] Set Current Locale';
  constructor(public payload: { locale: any }) {}
}