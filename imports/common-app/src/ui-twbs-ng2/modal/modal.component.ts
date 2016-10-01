import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, ReflectiveInjector, ViewContainerRef, ViewChild } from "@angular/core"
import { select } from 'ng2-redux';

import {IModalState} from "../../ui/redux/modal/modal.types";
import {ModalService} from "../../ui/redux/modal/modal.service";

@Component({
  selector: 'modal-dialog',
  template: `
<div class="modal-backdrop" [ngStyle]="style">
  <div class="modal" [ngStyle]="style" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
          <template #placeHolder></template>
      </div>
    </div>
  </div>
</div>
`
})
export class ModalDialog implements  OnInit {
  @select() modalReducer;
  @ViewChild('placeHolder', {read: ViewContainerRef}) private _placeHolder: ElementRef;
  style:Object = {display: 'none'};
  constructor(
    private _cmpFctryRslvr: ComponentFactoryResolver,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.modalReducer.subscribe( (modalState:IModalState)=>{
      if (modalState.displaying) {
        this.setComponent(this.modalService.component);
        console.log("open event in ModalDialog")
        this.style = {display: 'inline-block'};
      } else {
        this.style = {display: "none"}
      }
    });
  }

  setComponent(component) {
    let cmp = this.createComponent(this._placeHolder, component);

    // set inputs..
    cmp.instance.name = 'peter';

    // set outputs..
    cmp.instance.clicked.subscribe(event => console.log(`clicked: ${event}`));

    // all inputs/outputs set? add it to the DOM ..
    this._placeHolder.insert(cmp.hostView);
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
