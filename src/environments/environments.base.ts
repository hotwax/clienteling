export const environment = {
    production: false,
    "appId": "co.hotwax.clienteling-dev",
    "appName": "Clienteling Dev",
    "version": "0.0.0",
    "PRIMARY_FETURE": "COLOR",
    "GOOGLE_ACCOUNT": "__Please use your own Account ID__",
    "GOOGLE_MY_BUSINESS_URL": "https://mybusiness.googleapis.com/v4/",
    "CUSTOMER_ANALYTICS":
      "__Create your own analytics uri with analito__",
    "BASE_URL": "https://dev-dc.hotwax.io/rest/s1/clienteling/v1",
    "RESOURCE_URL": "https://dev-resources.hotwax.io/",
    "DEFAULT_CURRENCY": "USD",
    "CLOVER_APP_ID": "__Please use your APP__",
    "CLOVER_APP_VERSION": "1.0.0",
    "CLOVER_ENVIRONMENT": "SANDBOX",
    "CLOVER_GO_API_KEY": "__Please use your API KEY__",
    "CLOVER_GO_SECRET":
      "__Please use your own secrets__",
    "CLOVER_ACCESS_TOKEN": "__Please use own access token__",
    "CLOVER_CLIENT_ID": "__Please use your own ID__",
    "CLOVER_CLIENT_SECRET": "__Please use your own secret__",
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
    "SHOPIFY_API_KEY": "___Please Put Your Own KEY___",
    "SHOPIFY_REDIRECT_URI": "___Please Put Your Own URI___",
    "SHOPIFY_SCOPES": "read_products,read_content" // TODO Define it based upon the use
  };