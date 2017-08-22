import { Component, ViewChild, OnInit, OnDestroy, ElementRef, Input, AfterViewInit } from '@angular/core';
import {Http, Headers, RequestOptionsArgs} from '@angular/http';
import { stringify } from 'querystring';
import {MainService} from '../../services/main.service';

// We need to tell TypeScript that Autodesk exists as a variables/object somewhere globally
declare const Autodesk: any;
declare const THREE: any;

@Component({
  selector: 'app-forge-viewer',
  templateUrl: 'forge-viewer.component.html',
  styleUrls: ['forge-viewer.component.css'],
})
export class ForgeViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  private selectedSection: any = null;
  @ViewChild('viewerContainer') viewerContainer: any;
  private viewer: any;

  myUrn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bW9kZWwyMDE3LTA4LTIyLTA2LTIzLTIwLWQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlL0dhdGVIb3VzZS5ud2Q';
  access_token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJsOXZHbXU0VTF3QkxMcEt0a0pSeHdzOG8yZmZkNXhlYiIsImV4cCI6MTUwMzM5MTM2Niwic2NvcGUiOlsiZGF0YTpyZWFkIiwiZGF0YTp3cml0ZSIsImRhdGE6Y3JlYXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIl0sImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9qd3RleHA2MCIsImp0aSI6InFMTVJ6QlBmOHZEZDI4a0N6ZFJ6eFF3SFJVTmVUeVRSWFR0VDNjMUdKYXU0NUp4blB3dVp5cmhVNkhRblBoZ3UifQ.rEGRx6_yzlHKV-PD_zIFo8Dy0vM-lsd515C2IiQPRE4';
  expires_in = 3599;

  constructor(private elementRef: ElementRef, private http: Http, private service: MainService) { }

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

  objLoad(event): void {
    this.myUrn = event;
    this.loadDocument();
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
    // TODO add auth from service and get token
    this.service.authenticate().map(res => res.json()).subscribe((data: any) => {
      console.log(data);
    })

    onSuccess(access_token, expires_in);
  }

  addSphere() {

    //create material red
    var material_red =
      new THREE.MeshPhongMaterial(
        { color: 0xff0000 });
    //add material red to collection
    this.viewer.impl.matman().addMaterial(
      'ADN-Material' + 'red',
      material_red,
      true);

    //create material green
    var material_green =
      new THREE.MeshPhongMaterial(
        { color: 0x00FF00 });
    //add material green to collection
    this.viewer.impl.matman().addMaterial(
      'ADN-Material' + 'green',
      material_green,
      true);

    //get bounding box of the model
    var boundingBox =
      this.viewer.model.getBoundingBox();
    var maxpt = boundingBox.max;
    var minpt = boundingBox.min;

    var xdiff =    maxpt.x - minpt.x;
    var ydiff =    maxpt.y - minpt.y;
    var zdiff =    maxpt.z - minpt.z;

    //set a nice radius in the model size
    var niceRadius =
      Math.pow((xdiff * xdiff +
      ydiff * ydiff +
      zdiff * zdiff), 0.5) / 10;

    //createsphere1 and place it at max point of boundingBox
    var sphere_maxpt =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          niceRadius, 20),
        material_red);
    sphere_maxpt.position.set(maxpt.x,
      maxpt.y,
      maxpt.z);

    //create  sphere2 and place it at
    //min point of boundingBox
    var sphere_minpt =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          niceRadius, 20),
        material_green)
    sphere_minpt.position.set(minpt.x,
      minpt.y,
      minpt.z);


    //add two spheres to scene
    this.viewer.impl.scene.add(sphere_maxpt);
    this.viewer.impl.scene.add(sphere_minpt);

    //update the viewer
    this.viewer.impl.invalidate(true);

  }

}
