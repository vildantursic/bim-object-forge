import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Http, RequestOptionsArgs, Headers, RequestOptions} from '@angular/http';
import {MainService} from "../../services/main.service";

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
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const reader = new FileReader();
      reader.onerror = (e) => {
        console.error(e);
      };
      reader.onloadend = (e) => {
        console.log(e);
        const headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Content-Type', 'application/octet-stream');
        const options = new RequestOptions({ headers: headers });
        this.http
          .post('https://developer.api.autodesk.com/oss/v2/buckets/creation/objects/test.rvt',
            new ArrayBuffer(event.target.files[0]),
            options
          )
          .subscribe((data: any) => {
            console.log(data);
            this.service.translateModel(this.access_token, btoa(data.objectId)).subscribe((dt: any) => {
              this.service.trackTranslationOfModel(this.access_token, btoa(data.objectId)).subscribe((objectId: any) => {
                this.onObjectLoad.emit(objectId);
              })
            })
          })
      }
      reader.readAsArrayBuffer(fileList[0]);
      // const formData: FormData = new FormData();
      // formData.append('uploadFile', file, file.name);

    }
  }
  //
  // upload() {
  //   const inputEl: HTMLInputElement = this.inputEl.nativeElement;
  //   const fileCount: number = inputEl.files.length;
  //   const formData = new FormData();
  //   if (fileCount > 0) { // a file was selected
  //     for (let i = 0; i < fileCount; i++) {
  //       console.log(inputEl.files);
  //       formData.append('file[]', inputEl.files.item(i));
  //     }
  //     console.log(formData);
  //
  //     const options: RequestOptionsArgs = {
  //       headers: new Headers({
  //         'Authentication': 'Bearer ' + this.access_token,
  //         'Content-Type': 'application/octet-stream'
  //       })
  //     }
  //
  //     this.http
  //       .post('https://developer.api.autodesk.com/oss/v2/buckets/creation/objects/test.rvt', formData, options)
  //       .subscribe((data) => {
  //         console.log('FILE: ', data)
  //       })
  //     // do whatever you do...
  //     // subscribe to observable to listen for response
  //   }
  // }
}
