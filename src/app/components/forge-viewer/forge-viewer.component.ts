import { Component, ViewChild, OnInit, OnDestroy, ElementRef, Input, AfterViewInit } from '@angular/core';
import {Http, Headers, RequestOptionsArgs} from '@angular/http';
import { stringify } from 'querystring';

// We need to tell TypeScript that Autodesk exists as a variables/object somewhere globally
declare const Autodesk: any;

@Component({
  selector: 'app-forge-viewer',
  templateUrl: 'forge-viewer.component.html',
  styleUrls: ['forge-viewer.component.css'],
})
export class ForgeViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  private selectedSection: any = null;
  @ViewChild('viewerContainer') viewerContainer: any;
  private viewer: any;

  myUrn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y3JlYXRpb24vdGVzdC5ydnQ';
  access_token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJsOXZHbXU0VTF3QkxMcEt0a0pSeHdzOG8yZmZkNXhlYiIsImV4cCI6MTUwMDMwMTM5MCwic2NvcGUiOlsiZGF0YTpyZWFkIiwiZGF0YTp3cml0ZSIsImJ1Y2tldDpjcmVhdGUiXSwiYXVkIjoiaHR0cHM6Ly9hdXRvZGVzay5jb20vYXVkL2p3dGV4cDYwIiwianRpIjoiSVJ2a0ViQ3NpUk1LQ3VlTXVDMmJyNFowVVVZd0dnVDR3RUFTVXFHM1pkdWlkNHFIemNlMEp2cnJ5Z25RQ3ZaQSJ9.nYUp8nBgY6Cu7kqDt9fRgAni7wbGKJDrqp9A43dUne8';
  expires_in = 3599;

  constructor(private elementRef: ElementRef, private http: Http) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.launchViewer();
  }

  ngOnDestroy() {
    if (this.viewer && this.viewer.running) {
      this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.selectionChanged);
      this.viewer.tearDown();
      this.viewer.finish();
      this.viewer = null;
    }
  }

  private launchViewer() {
    if (this.viewer) {
      return;
    }

    const options = {
      env: 'AutodeskProduction',
      getAccessToken: (onSuccess) => { this.getAccessToken(onSuccess) },
    };

    this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(this.viewerContainer.nativeElement); // Headless viewer

    // Check if the viewer has already been initialised - this isn't the nicest, but we've set the env in our
    // options above so we at least know that it was us who did this!
    if (!Autodesk.Viewing.Private.env) {
      Autodesk.Viewing.Initializer(options, () => {
        this.viewer.initialize();
        this.loadDocument();
      });
    } else {
      // We need to give an initialised viewing application a tick to allow the DOM element to be established before we re-draw
      setTimeout(() => {
        this.viewer.initialize();
        this.loadDocument();
      });
    }
  }

  private loadDocument() {
    const urn = `urn:${this.myUrn}`;

      Autodesk.Viewing.Document.load(urn, (doc) => {
        const geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {type: 'geometry'}, true);

        if (geometryItems.length === 0) {
          return;
        }

        this.viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.geometryLoaded);
        this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, (event) => this.selectionChanged(event));

        this.viewer.load(doc.getViewablePath(geometryItems[0]));
      },
      errorMsg => console.error);
  }

  private geometryLoaded(event: any) {
    const viewer = event.target;

    viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.geometryLoaded);
    viewer.setLightPreset(8);
    viewer.fitToView();
    // viewer.setQualityLevel(false, true); // Getting rid of Ambientshadows to false to avoid blackscreen problem in Viewer.
  }

  private selectionChanged(event: any) {
    const model = event.model;
    const dbIds = event.dbIdArray;

    // Get properties of object
    this.viewer.getProperties(dbIds[0], (props) => {
      // Do something with properties
    });
  }

  private getAccessToken(onSuccess: any) {
    const { access_token, expires_in } = { access_token: this.access_token, expires_in: this.expires_in };
      // TODO do authentication
      const dataBody = stringify({ client_id: 'l9vGmu4U1wBLLpKtkJRxws8o2ffd5xeb',
        client_secret: 'F8hHFQYAGmtbX90M',
        grant_type: 'client_credentials',
        scope: 'data:read data:write bucket:create' })

      const options: RequestOptionsArgs = {
        method: 'POST',
        body: dataBody,
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      }

      this.http.request('https://developer.api.autodesk.com/authentication/v1/authenticate', options)
      .subscribe((data) => {
        console.log(data)
      });

      onSuccess(access_token, expires_in);
  }

  addObject(): void {
    const options: RequestOptionsArgs = {
      method: 'POST',
      body: {},
      headers: new Headers({
        'Authentication': 'Bearer ' + this.access_token,
        'Content-Type': 'application/octet-stream'
      })
    }

    this.http.request('https://developer.api.autodesk.com/oss/v2/buckets/creation/objects/test.rvt', options)
      .subscribe((data) => {
        console.log(data)
      });
  }
}
