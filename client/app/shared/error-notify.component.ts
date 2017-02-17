import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, Renderer, AfterViewInit } from '@angular/core';
import { ErrorService } from './error.service';
@Component({
  selector: 'cc-error-notify',
  template: `
    <div *ngIf="latestError" [class.hidden]="hidden" class="error-notify">
      <span><i class="icon-warning"></i> {{ latestError.error }}</span>
      <a (click)="dismiss()"><i class="icon-cancel"></i></a>
    </div>
  `
}) 
export class ErrorNotifyComponent implements OnInit {
  latestError: any;
  hidden: boolean = true;

  @ViewChild('error')
  error: ElementRef;

  constructor(private renderer: Renderer, private _errorService: ErrorService) {
  }

  ngOnInit() {
    this._errorService.error.subscribe(e => {
       if(e == null) {
         this.hidden = true;
       } else {
         console.log(e);
         //TODO: will this always be valid JSON?
         let error = JSON.parse(e._body);
         this.latestError = error;
         this.hidden = false;
       }
    });
  }

  dismiss() {
    this._errorService.dismissError();
  }
}