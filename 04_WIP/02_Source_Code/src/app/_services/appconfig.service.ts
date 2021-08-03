import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppconfigService {
  private appConfig: any;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get('/assets/config/UrlConfig.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
  }

  // This is an example property ... you can make it however you want.
  get apiBaseUrl() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.apiBaseUrl;
  }
}
