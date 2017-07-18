import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ForgeViewerComponent } from './components/forge-viewer/forge-viewer.component';
import { HttpModule } from '@angular/http';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { MainService } from './services/main.service';

@NgModule({
  declarations: [
    AppComponent,
    ForgeViewerComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    MainService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
