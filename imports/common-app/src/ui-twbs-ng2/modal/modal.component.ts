import { Component, OnInit, ViewContainerRef } from "@angular/core"
import { select } from 'ng2-redux';

import { ModalOutlet} from "./modal-outlet.component"; {ModalOutlet};
import {IModalState} from "../../ui/redux/modal/modal.types";

@Component({
  selector: 'modal-dialog',
  template: `
<div class="modal-backdrop" [ngStyle]="style">
  <div class="modal" [ngStyle]="style" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <modal-outlet  [creationModalEvent]="creationModalEvent"></modal-outlet>
        </div>
    </div>
  </div>
</div>
`
})
export class ModalDialog implements  OnInit {
  @select() modalReducer;
  style:Object = {display: 'none'};

  ngOnInit() {
    this.modalReducer.subscribe( (modalState:IModalState)=>{
      if (modalState.displaying) {
        console.log("open event in ModalDialog")
        this.style = {display: 'inline-block'};
      } else {
        this.style = {display: "none"}
      }
    });
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
