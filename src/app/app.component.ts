import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // let viewer;
  // // application token
  // let options = {
  //   env: 'AutodeskProduction',
  //   accessToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6Imp3dF9zeW1tZXRyaWNfa2V5In0.eyJjbGllbnRfaWQiOiJsOXZHbXU0VTF3QkxMcEt0a0pSeHdzOG8yZmZkNXhlYiIsImV4cCI6MTQ5OTg2MDEzMiwic2NvcGUiOlsiZGF0YTpyZWFkIiwiZGF0YTp3cml0ZSIsImRhdGE6Y3JlYXRlIiwiYnVja2V0OmNyZWF0ZSIsImJ1Y2tldDpyZWFkIl0sImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tL2F1ZC9qd3RleHA2MCIsImp0aSI6ImVESk1pTXM0RkZuWVJaa1NBZVZtSndOTHhuakFDT0owRFJxMjhFR050d1Bwa3BEWXluYm1TUTZKUlFqNlJQSlIifQ.6dGsQEkjp4dmQkvjitbQNUbDqxR-P5sUKzBls_19VbM'
  // };
  // // URN id
  // let documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Y3JlYXRpb24vdGVzdC5ydnQ';
  // let bucketName = 'creation';
  //
  // let settings = {
  //   "async": true,
  //   "crossDomain": true,
  //   "url": "https://developer.api.autodesk.com/oss/v2/buckets/creation/objects/test.rvt",
  //   "method": "PUT",
  //   "headers": {
  //     "authorization": "Bearer " + options.accessToken,
  //     "content-type": "application/octet-stream",
  //     "cache-control": "no-cache",
  //     "postman-token": "e47d83ed-ed1f-fa3d-0e28-406fa2e07113"
  //   }
  // }
  //
  // $.ajax(settings).done(function (response) {
  //   console.log(response);
  // });
  //
  // Autodesk.Viewing.Initializer(options, function onInitialized(){
  //   Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  // });
  //
  // /**
  //  * Autodesk.Viewing.Document.load() success callback.
  //  * Proceeds with model initialization.
  //  */
  // function onDocumentLoadSuccess(doc) {
  //
  // // A document contains references to 3D and 2D viewables.
  // let viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {'type':'geometry'}, true);
  // if (viewables.length === 0) {
  //   console.error('Document contains no viewables.');
  //   return;
  // }
  //
  // // Choose any of the avialble viewables
  // let initialViewable = viewables[0];
  // let svfUrl = doc.getViewablePath(initialViewable);
  // let modelOptions = {
  //   sharedPropertyDbPath: doc.getPropertyDbPath()
  // };
  //
  // let viewerDiv = document.getElementById('MyViewerDiv');
  //   viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
  //   viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);
  // }
  //
  // /**
  //  * Autodesk.Viewing.Document.load() failuire callback.
  //  */
  // onDocumentLoadFailure(viewerErrorCode) {
  //   console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
  // }
  //
  // /**
  //  * viewer.loadModel() success callback.
  //  * Invoked after the model's SVF has been initially loaded.
  //  * It may trigger before any geometry has been downloaded and displayed on-screen.
  //  */
  // onLoadModelSuccess(model) {
  //   console.log('onLoadModelSuccess()!');
  //   console.log('Validate model loaded: ' + (viewer.model === model));
  //   console.log(model);
  // }
  //
  // /**
  //  * viewer.loadModel() failure callback.
  //  * Invoked when there's an error fetching the SVF file.
  //  */
  // onLoadModelError(viewerErrorCode) {
  //   console.error('onLoadModelError() - errorCode:' + viewerErrorCode);
  // }

}
