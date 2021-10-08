export const environment = {
    production: false,
    "appId": "co.hotwax.clienteling-dev",
    "appName": "Clienteling Dev",
    "version": "0.0.0",
    "PRIMARY_FETURE": "COLOR",
    "GOOGLE_ACCOUNT": "accounts/100642139089425989218/",
    "GOOGLE_MY_BUSINESS_URL": "https://mybusiness.googleapis.com/v4/",
    "CUSTOMER_ANALYTICS":
      "https://www.enalito.com:8443/RAService/mobileapp/api/rest/getreco/5e68e969e4b0f1ea779f97dc",
    "BASE_URL": "https://dev-dc.hotwax.io/rest/s1/clienteling/v1",
    "RESOURCE_URL": "https://dev-resources.hotwax.io/",
    "DEFAULT_CURRENCY": "USD",
    "CLOVER_APP_ID": "ZDW1S25K67CZ4",
    "CLOVER_APP_VERSION": "1.0.0",
    "CLOVER_ENVIRONMENT": "SANDBOX",
    "CLOVER_GO_API_KEY": "OAFiGwUZWEIHlprCZZs2jmqrInLGURJ7",
    "CLOVER_GO_SECRET":
      "AA7116E19B85A462F6DCDCE0DA4EE55F9EE85728DE1CBD0BE73B77BEC5308D01",
    "CLOVER_ACCESS_TOKEN": "f6ac8eb6-c55a-e144-de4c-c97550b63ce7",
    "CLOVER_CLIENT_ID": "ZDW1S25K67CZ4",
    "CLOVER_CLIENT_SECRET": "0477ce63-99a8-a397-0aff-1c682987d9e1",
    "CLOVER_BASE_URL": "sandbox.dev.clover.com",
    "DEFAULT_IMAGE": "assets/imgs/defaultImage.png",
    "CACHE_DEFAULT_TTL": 3600,
    "DEFAULT_COUNTRY": "US",
    "RETURN_REASONS": [
      { "id": "RrsnDidNotWant", "label": "Did not Want/Like" },
      { "id": "RrsnDefective", "label": "Damaged in transit" }
    ],
    "RETURN_PAYMENT_METHODS": [
      { "id": "RrspRefund", "label": "Credit Card" },
      { "id": "RrspCredit", "label": "Gift Card" }
    ],
    "UNFILLABLE_REASONS": [
      { "id": "NOT_IN_STOCK", "label": "Not in Stock" },
      { "id": "INACTIVE_STORE", "label": "Inactive store" },
      { "id": "MISMATCH", "label": "Mismatch" },
      { "id": "WORN_DISPLAY", "label": "Worn Display" }
    ],
    "VIEW_SIZE": "10",
    "OMS_URL": "https://dev-hc.hotwax.io/api/",
    "DATE_FORMAT": "MM-DD-YYYY",
    "DELIVERY_SHIP_METH": "ShMthGround",
    "DELIVERY_CARRIER_PARTY": "_NA_",
    "PICKUP_SHIP_METH": "ShMthPickUp",
    "PICKUP_CARRIER_PARTY": "STOREPICKUP",
    "INSTORE_SHIP_METH": "_NA_",
    "INSTORE_CARRIER_PARTY": "_NA_",
    "FIREBASE_NOTIFICATIONS_ENABLED": true,
    "SALE_REASON": "POS_SALE",
    "SEARCH_CONFIG": {
      "elasticsearch": {
          "searchScoring": {
              "attributes": {
                  "attribute_code": {
                  "scoreValues": {
                      "attribute_value": {
                      "weight": 1
                      }
                  }
                  }
              },
              "fuzziness": 2,
              "cutoff_frequency": 0.01,
              "max_expansions": 3,
              "minimum_should_match": '75%25', // This is encoded form of 75% as this is passed directly &  server gives error on non encoded value in GET request
              "prefix_length": 2,
              "boost_mode": "multiply",
              "score_mode": "multiply",
              "max_boost": 100,
              "function_min_score": 1
          },
          "searchableAttributes": {
            "name": {
                "boost": 4
            },
            "sku": {
                "boost": 2
            },
            "category.name": {
                "boost": 1
            }
          }
      }
    },
    "SHOPIFY_API_KEY": "e3c434a3b45b883fcf2c92850174d114",
    "SHOPIFY_REDIRECT_URI": "https://clienteling-dev.firebaseapp.com/shopify",
    "SHOPIFY_SCOPES": "read_products,read_content" // TODO Define it based upon the use
  };