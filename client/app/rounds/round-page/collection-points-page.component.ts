import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { RoundCustomersComponent } from './round-customers-new.component';
import { RoundPageService } from './round-page.component'
import { EditableService } from '../../shared/editable.service'
import { RoundService, Round, CollectionPoint } from '../round.service'
import { EditableTextComponent } from '../../shared/editable-text.component'
import { EditableHeadingComponent } from '../../shared/editable-heading.component'
import { EditableTextAreaComponent } from '../../shared/editable-textarea.component'
import { ButtonComponent } from '../../shared/button.component'
import { TextComponent } from '../../shared/text.component'
import { TextAreaComponent } from '../../shared/textarea.component'
import { Arrays } from '../../shared/arrays'
import { Control, Validators, FORM_DIRECTIVES, FormBuilder, ControlGroup } from '@angular/common'

export class CollectionPointModel {
  constructor(
    public id: number,
    public name: string,
    public address: string,
    private _model: CollectionPointsModel
  ) {
  }

  remove() {
    this._model.remove(this);
  }

  update(params: any) {
    this._model.update(this, params);
  }
}

export class CollectionPointsModel {
  loaded = false;
  adding = false;
  addingName: string = '';
  addingAddress: string = '';
  collectionPoints: CollectionPointModel[] = [];

  constructor(
    private _round: Round,
    private _service: RoundService) {
  }

  load(collectionPoints: CollectionPoint[]) {
    this.collectionPoints = collectionPoints.map(c => new CollectionPointModel(c.id, c.name, c.address, this))
    this.loaded = true;
  }

  startAdd() {
    this.adding = true;
    this.addingName = '';
    this.addingAddress = '';
  }

  completeAdd() {
    this._service.addCollectionPoint(this._round.id,
      {name: this.addingName, address: this.addingAddress}).subscribe(id => 
      this.collectionPoints.unshift(new CollectionPointModel(id, this.addingName, this.addingAddress, this)));
    this.adding = false;
  }

  cancelAdd() {
    this.adding = false;
  }

  remove(collectionPoint: CollectionPointModel) {
    this._service.removeCollectionPoint(this._round.id, collectionPoint.id).subscribe(() => 
      Arrays.remove(this.collectionPoints, collectionPoint));
  }

  update(collectionPoint: CollectionPointModel, params: any) {
    this._service.updateCollectionPoint(this._round.id, collectionPoint.id, params).subscribe(() => {})
  }
}

@Component({
  selector: 'cc-collection-points-page',
  templateUrl: 'app/rounds/round-page/collection-points-page.component.html',
  directives: [RoundCustomersComponent, EditableTextComponent, EditableTextAreaComponent, EditableHeadingComponent, ButtonComponent, TextComponent, TextAreaComponent],
  providers: [EditableService]
})
export class CollectionPointsPageComponent implements OnInit {
  model: CollectionPointsModel;
  submitted = false;
  nameControl: Control
  addressControl: Control
  form: ControlGroup;
  nameValidationMessage: string = '';
  addressValidationMessage: string = '';
  nameMessages = {required: 'Name must not be empty'};
  addressMessages = {};
  nameValidators = [Validators.required];
  addressValidators: any[] = [];

  constructor(
    private builder: FormBuilder,
    @Inject(forwardRef(() => RoundPageService))
    private page: RoundPageService,
    private roundService: RoundService,
    private editableService: EditableService) {
  }

  ngOnInit() {
    this.nameControl = new Control('', Validators.compose([Validators.required]))
    this.addressControl = new Control('', Validators.compose([]))

    this.form = this.builder.group({
      name: this.nameControl,
      address: this.addressControl
    })

    this.model = new CollectionPointsModel(this.page.round, this.roundService);
    this.roundService.getCollectionPoints(this.page.round.id).subscribe(collectionPoints =>
      this.model.load(collectionPoints))
  }

  startAdd() {
    this.submitted = false;
    this.model.startAdd();
    
    this.editableService.currentlyEditing.subscribe((key: string) => {
      if(this.model.adding && key != 'add') {
        this.cancelAdd();
      }
    })
  }

  completeAdd() {
    this.submitted = true;

    if(!this.form.valid) {
      if(!this.nameControl.valid) {
        this.setNameValidationMessage();
      }

      if(!this.addressControl.valid) {
        this.setAddressValidationMessage();
      }

      return;
    }
    this.model.completeAdd();
  }

  cancelAdd() {
    this.model.cancelAdd();
  }

  setNameValidationMessage() {
    if(!this.submitted || this.nameControl.valid) {
      this.nameValidationMessage = '';
      return;
    }

    for(let e in this.nameControl.errors) {
      this.nameValidationMessage = this.nameMessages[e] ? this.nameMessages[e] : e;
      return;
    }
  }

  setAddressValidationMessage() {
    if(!this.submitted || this.addressControl.valid) {
      this.addressValidationMessage = '';
      return;
    }

    for(let e in this.addressControl.errors) {
      this.addressValidationMessage = this.addressMessages[e] ? this.addressMessages[e] : e;
      return;
    }
  }
}