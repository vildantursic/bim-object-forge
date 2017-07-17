import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {Http, RequestOptionsArgs, Headers} from '@angular/http';

@Component({
  selector: 'app-file-upload',
  template: '<input type="file" [multiple]="multiple" #fileInput>'
})
export class FileUploadComponent {
  @Input() multiple = false;
  @Input() access_token = '';
  @ViewChild('fileInput') inputEl: ElementRef;

  constructor(private http: Http) {}

  upload() {
    const inputEl: HTMLInputElement = this.inputEl.nativeElement;
    const fileCount: number = inputEl.files.length;
    const formData = new FormData();
    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        formData.append('file[]', inputEl.files.item(i));
      }

      const options: RequestOptionsArgs = {
        headers: new Headers({
          'Authentication': 'Bearer ' + this.access_token,
          'Content-Type': 'application/octet-stream'
        })
      }

      this.http
        .post('https://developer.api.autodesk.com/oss/v2/buckets/creation/objects/test.rvt', formData, options)
        .subscribe((data) => {
          console.log('FILE: ', data)
        })
      // do whatever you do...
      // subscribe to observable to listen for response
    }
  }
}
