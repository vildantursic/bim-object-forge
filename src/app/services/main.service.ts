import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Http, Headers } from '@angular/http';
import { stringify } from 'querystring';

@Injectable()
export class MainService {

  constructor(private http: Http) { }

  translateModel(access_token: string, urn: string): any {

    const data = {
      'input': {
        'urn': urn
      },
      'output': {
        'formats': [
          {
            'type': 'svf',
            'views': ['2d', '3d']
          }
        ]
      }
    }

    const headers = new Headers();
    /** No need to include Content-Type in Angular 4 */
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + access_token);

    const options: RequestOptionsArgs = {
      headers: headers,
    }

    return this.http
      .post('https://developer.api.autodesk.com/modelderivative/v2/designdata/job', data, options)
  }

  trackTranslationOfModel(access_token: string, urn: string): any {

    const headers = new Headers();
    /** No need to include Content-Type in Angular 4 */
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + access_token);

    const options: RequestOptionsArgs = {
      headers: headers
    }

    return this.http
      .get('https://developer.api.autodesk.com/modelderivative/v2/designdata/' + urn + '/manifest', options)
  }

  authenticate(): any {
    // TODO hide client id and secret
    const dataBody = stringify({
      client_id: 'l9vGmu4U1wBLLpKtkJRxws8o2ffd5xeb',
      client_secret: 'F8hHFQYAGmtbX90M',
      grant_type: 'client_credentials',
      scope: 'data:read data:write bucket:create'
    })

    const options: RequestOptionsArgs = {
      method: 'POST',
      body: dataBody,
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }

    return this.http
      .request('https://developer.api.autodesk.com/authentication/v1/authenticate', options)
  }

}
