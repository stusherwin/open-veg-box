import { Component, Input, Output, EventEmitter, ViewChild, forwardRef, Inject, ElementRef, OnInit, Renderer, ViewChildren, QueryList, Directive, HostListener, HostBinding, AfterViewInit, ContentChildren, ChangeDetectorRef } from '@angular/core';
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'

export class InputComponent {
}

export interface ValidationResult{
   [key:string]:boolean;
}