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
      // TODO get client_id and client_secret from env variables
      client_id: 'CLIENT_ID', // CLIENT_ID
      client_secret: 'CLIENT_SECRET', // CLIENT_SECRET
      grant_type: 'client_credentials',
      scope: 'data:read data:write bucket:create'
    })

    const headers = new Headers();
    /** No need to include Content-Type in Angular 4 */
    headers.append('Content-Type', 'application/json');

    const options: RequestOptionsArgs = {
      headers: headers
    }

    return this.http
      .post('https://developer.api.autodesk.com/authentication/v1/authenticate', dataBody, options)
  }

}
