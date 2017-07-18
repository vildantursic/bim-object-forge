import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { MainService } from "../../services/main.service";


@Component({
  selector: 'app-file-upload',
  template: `
    <input type="file" (change)="fileChange($event)" placeholder="Upload file">
    <!--<input type="file" [multiple]="multiple" #fileInput>-->
  `
})
export class FileUploadComponent {
  @Input() multiple = false;
  @Input() access_token = '';
  // @ViewChild('fileInput') inputEl: ElementRef;

  @Output('onObjectLoad') onObjectLoad: EventEmitter<any> = new EventEmitter();

  constructor(private http: Http, private service: MainService) {}

  fileChange(event) {
    debugger;
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const reader = new FileReader();
      reader.onerror = (e) => {
        console.error(e);
      };
      reader.onloadend = (e) => {

        const headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Content-Type', 'application/octet-stream');
        headers.append('Authorization', 'Bearer ' + this.access_token);
        const options = new RequestOptions({ headers: headers });
        this.http
          .put('https://developer.api.autodesk.com/oss/v2/buckets/creation/objects/test.rvt',
            event.target.files[0],
            options
          )
          .map((response: Response) => response.json())
          .subscribe((data: any) => {

            this.service.translateModel(this.access_token, btoa(data.objectId)).subscribe((dt: any) => {
              this.service.trackTranslationOfModel(this.access_token, btoa(data.objectId)).subscribe((objectId: any) => {
                this.onObjectLoad.emit(objectId);
              })
            })
          })
      }
      reader.readAsArrayBuffer(fileList[0]);

    }
  }
}
