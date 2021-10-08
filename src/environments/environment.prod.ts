import { environment as base } from "./environments.base"
export const environment = {
    ...base,
    production: true,
    "appId": "co.hotwax.clienteling",
    "appName": "Clienteling",
    "version": "0.0.0",
    "BASE_URL": "https://demo-dc.hotwax.io/rest/s1/clienteling/v1",
    "RESOURCE_URL": "https://demo-resources.hotwax.io/",
    "OMS_URL": "https://demo-hc.hotwax.io/api/",
    "SHOPIFY_API_KEY": "b327acf76b4fcb5c235b14bdca05267a",
    "SHOPIFY_REDIRECT_URI": "https://hotwax-clienteling.firebaseapp.com/shopify",
};