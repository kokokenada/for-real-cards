import { Component, ViewContainerRef } from "@angular/core"

import { ModalOutlet} from "../ui-ng2/modal/modal-outlet.component";
import { ModalEvent, ModalEventType} from "../ui-ng2/modal/modal-event.class";
import { ModalService } from "../ui-ng2/modal/modal.service"

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
`,
  directives: [ModalOutlet],
})
export class ModalDialog {
  creationModalEvent:ModalEvent;
  style:Object = {display: 'none'};

  constructor(viewContainerRef:ViewContainerRef, private modalService:ModalService) {
    ModalService.subscribe((modalEvent:ModalEvent)=> {
      if (modalEvent.eventType === ModalEventType.OPEN) {
        console.log("open event in ModalDialog")
        this.style = {display: 'inline-block'};
        this.creationModalEvent = modalEvent
      } else if (modalEvent.eventType === ModalEventType.CLOSE) {
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
