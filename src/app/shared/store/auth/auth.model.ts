export interface Auth {
  token: string | null;
  stores: any[] | null;
  currentStore: any | null;
  currentLocale: any | null;
}
