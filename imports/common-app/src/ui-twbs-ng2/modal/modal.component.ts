import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, NgZone, ReflectiveInjector, ViewContainerRef, ViewChild } from "@angular/core"
import {Subscription} from 'rxjs';
import { select } from '@angular-redux/store';

import {IModalState} from "../../ui/redux/modal/modal.types";
import {ModalActions} from "../../ui/redux/modal/modal-actions.class";

@Component({
  selector: 'modal-dialog',
  template: `
<div class="modal-backdrop" [ngStyle]="style">
  <div class="modal" [ngStyle]="style" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
          <ng-template #placeHolder></ng-template>
      </div>
    </div>
  </div>
</div>
`
})
export class ModalDialog implements  OnInit {
  @select() modalReducer;
  @ViewChild('placeHolder', {read: ViewContainerRef}) private _placeHolder: ViewContainerRef;
  style:Object = {display: 'none'};
  subscription:Subscription;
  needsRemoval = false;
  constructor(
    private ngZone: NgZone,
    private _cmpFctryRslvr: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.subscription = this.modalReducer.subscribe( (modalState:IModalState<any, any>)=>{
      this.ngZone.run( ()=>{
        if (modalState.lastEvent===ModalActions.MODAL_OPEN_REQUEST) {
          this.setComponent(modalState.component);
          this.style = {display: 'inline-block'};
          ModalActions.openSuccess();
        } else if (modalState.lastEvent===ModalActions.MODAL_RESOLVE_REQUEST) {
          this.style = {display: "none"}
          ModalActions.resolveSuccess();
        }
      } );
    });
  }
  ngOnDestroy() {
    console.log('destroying ModalDialog');
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  setComponent(component) {
    if (this.needsRemoval)
      this._placeHolder.remove();
    let cmp = this.createComponent(this._placeHolder, component);
    // all inputs/outputs set? add it to the DOM ..
    this._placeHolder.insert(cmp.hostView);
    this.needsRemoval = true;
  }

  public createComponent (vCref: ViewContainerRef, type: any): ComponentRef<any> {

    let factory = this._cmpFctryRslvr.resolveComponentFactory(type);

    // vCref is needed cause of that injector..
    let injector = ReflectiveInjector.fromResolvedProviders([], vCref.parentInjector);

    // create component without adding it directly to the DOM
    let comp = factory.create(injector);

    return comp;
  }
}


/*    TODO figure out how to automatically add modal-dialog to document, this version requires it to be user defined




 let el = document.getElementById("common-app.modal");
 if (!el) {
 let debugInfo:any;
 el = this.renderer.createElement(document.rootElement, "div", debugInfo);
 this.renderer.setElementAttribute(el, "id", "common-app.modal");
 console.log(el)
 }
 this.componentFactory.selector = selector;
 let componentRef = this.componentFactory.create(this.injector);
 */
