import { Injectable } from '@angular/core';
import { SearchQuery, elasticsearch, ElasticsearchQueryConfig } from 'storefront-query-builder'
import bodybuilder from 'bodybuilder/lib'
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class SearchProvider {
    config:ElasticsearchQueryConfig;
  
    /**
   * Method to prepare search query 
   *
   * @param {Object} params object to prepare query.
   *
   *
   * @return {String} Returns query
   */
  prepareQuery(params) {
    return new Promise((resolve, reject) => {
        this.config = environment.SEARCH_CONFIG;

          const searchQuery = new SearchQuery()
          if (params.queryString) {
            searchQuery.setSearchText(params.queryString);
          }

          if (params.filters) {
            params.filters.forEach((filter: any) => {
                searchQuery.applyFilter(filter);
            });
          }
          // TODO Handle error
          elasticsearch.buildQueryBodyFromSearchQuery({ config:this.config , queryChain: bodybuilder(), searchQuery: searchQuery }).then(elasticSearchQuery => {
            resolve(JSON.stringify(elasticSearchQuery));
          });

    })
  }
}

