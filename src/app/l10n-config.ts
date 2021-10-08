import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { L10nConfig, L10nLoader, L10nTranslationLoader, L10nProvider } from 'angular-l10n';

export const l10nConfig: L10nConfig = {
  format: 'language-region',
  providers: [{ name: 'app', asset: '../assets/i18n/app', options: { version: '10.0.0' } }],
  cache: true,
  keySeparator: '',
  defaultLocale: {
    language: 'en-US',
    currency: 'USD',
    timeZone: 'America/Los_Angeles'
  },
  // Note: The text should be in the locale only as it will be displayed in language selection setting.
  // User should be able identify the text in it's local language to identify it better
  schema: [
    {
      locale: {
        language: 'en-US',
        currency: 'USD',
        timeZone: 'America/Los_Angeles'
      },
      dir: 'ltr',
      text: 'United States'
    },
    {
      locale: { language: 'it-IT', currency: 'EUR', timeZone: 'Europe/Rome' },
      dir: 'ltr',
      text: 'Italia'
    }
  ]
};

export function initL10n(l10nLoader: L10nLoader): () => Promise<void> {
  return () => l10nLoader.init();
}

@Injectable()
export class HttpTranslationLoader implements L10nTranslationLoader {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(@Optional() private http: HttpClient) { }
  public get(language: string, provider: L10nProvider): Observable<{ [key: string]: any }> {
    const url = `${provider.asset}-${language}.json`;
    const options = {
        headers: this.headers,
        params: new HttpParams().set('v', provider.options.version)
    };
    return this.http.get(url, options);
  }
}