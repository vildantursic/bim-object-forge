import { Component, ViewChild, OnInit, OnDestroy, ElementRef, Input, AfterViewInit } from '@angular/core';
import {Http, Headers, RequestOptionsArgs} from '@angular/http';
import { stringify } from 'querystring';
import {MainService} from '../../services/main.service';
import {ColorsDisplay} from 'jasmine-spec-reporter/built/display/colors-display';
import { reduce } from 'lodash';

// We need to tell TypeScript that Autodesk exists as a variables/object somewhere globally
declare const Autodesk: any;
declare const THREE: any;
declare const ace: any;

@Component({
  selector: 'app-forge-viewer',
  templateUrl: 'forge-viewer.component.html',
  styleUrls: ['forge-viewer.component.css'],
})
export class ForgeViewerComponent implements OnInit, AfterViewInit, OnDestroy {

  mm = 0.001;

  private selectedSection: any = null;
  @ViewChild('viewerContainer') viewerContainer: any;
  private viewer: any;

  myUrn = localStorage.getItem('urn');
  access_token = localStorage.getItem('access_token');
  expires_in = 3599;

  editor;
  sidebarActive = true;

  constructor(private elementRef: ElementRef, private http: Http, private service: MainService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.launchViewer();
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/monokai');
    this.editor.getSession().setMode('ace/mode/javascript');
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

  configureMaterial(color: ColorsDisplay, name: string): any {
    // create material red
    const material = new THREE.MeshPhongMaterial({ color: color });
    // add material red to collection
    this.viewer.impl.matman().addMaterial('ADN-Material' + name, material, true);

    return material
  }
  generateObjects(objects: Array<{width: number, height: number; thickness: number, position?: any, material?: any}>): any {
    const setOfObjects = [];

    objects.forEach((obj, index) => {
      if (obj.width && obj.height && obj.thickness) {
        let material;
        if (obj.material) {
          material = this.configureMaterial(obj.material.color, obj.material.name);
        } else {
          material = this.configureMaterial(0xcdcdcd, 'gray');
        }

        const mesh = new THREE.Mesh(new THREE.BoxGeometry(obj.width / 1000, obj.height / 1000, obj.thickness / 1000), material);
        if (obj.position) {
          mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
        } else {
          console.log((reduce(objects.slice(0, index), (sum, n) => {
            return sum + (n.thickness * this.mm);
          }, 0)))
          mesh.position.set(((obj.width / 2) * this.mm), ((obj.height / 2) * this.mm), (reduce(objects.slice(0, index), (sum, n) => {
            return sum + (n.thickness * this.mm);
          }, 0)) + (obj.thickness / 2 * this.mm));
        }

        setOfObjects.push(mesh);
      }
    });

    return setOfObjects;
  }
  addSphere() {

    // get bounding box of the model
    const boundingBox = this.viewer.model.getBoundingBox();
    const maxpt = boundingBox.max;
    const minpt = boundingBox.min;

    const xdiff = maxpt.x - minpt.x;
    const ydiff = maxpt.y - minpt.y;
    const zdiff = maxpt.z - minpt.z;

    const items: Array<any> = this.generateObjects([
      { width: 1000, height: 1000, thickness: 10, material: {color: 0x0000ff, name: 'blue'}},
      { width: 1200, height: 1200, thickness: 10, material: {color: 0x00ff00, name: 'green'}},
      { width: 1400, height: 1400, thickness: 100, material: {color: 0xff0000, name: 'red'}},
      { width: 1600, height: 1600, thickness: 10, material: {color: 0xffff00, name: 'n'}},
      { width: 1800, height: 1800, thickness: 10, material: {color: 0xff00ff, name: 'u'}},
    ]);

    // create  sphere2 and place it at
    // min point of boundingBox
    // const sphere_minpt = new THREE.Mesh(new THREE.SphereGeometry(niceRadius, 20), material_green);
    // sphere_minpt.position.set(minpt.x, minpt.y, minpt.z);

    // code from editor input
    eval(this.editor.getValue());

    // add two spheres to scene
    items.forEach((item) => {
      this.viewer.impl.scene.add(item);
    })

    // update the viewer
    this.viewer.impl.invalidate(true, true, false);
  }

  loadFromUrn(urn: string): void {
    this.myUrn = urn;
    this.loadDocument();
  }

  sidebar(): void {
    if (!this.sidebarActive) {
      this.sidebarActive = true;
    } else {
      this.sidebarActive = false
    }
  }

}
