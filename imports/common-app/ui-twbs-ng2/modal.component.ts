import { Component, ViewContainerRef } from "@angular/core"

import { MODAL_DIRECTVES, BS_VIEW_PROVIDERS } from 'ng2-bootstrap/ng2-bootstrap';

import { ModalOutlet} from "../ui-ng2/modal/modal-outlet.component";
import { ModalEvent, ModalEventType} from "../ui-ng2/modal/modal-event.class";
import { ModalService } from "../ui-ng2/modal/modal.service"

@Component({
  selector: 'modal-dialog',
  template: `
<div>
  <modal-outlet bs-modal [creationModalEvent]="creationModalEvent"></modal-outlet>
</div>
`,
  directives: [ModalOutlet],
  viewProviders:[BS_VIEW_PROVIDERS]
})
export class ModalDialog {
  creationModalEvent:ModalEvent;

  constructor(viewContainerRef:ViewContainerRef, private modalService:ModalService) {
    ModalEvent.subscribe((modalEvent:ModalEvent)=>{
      if (modalEvent.eventType === ModalEventType.OPEN) {
        this.creationModalEvent = modalEvent
      }
    });
  }


}
/*   constructor(
 //    viewContainerRef:ViewContainerRef,
 //    private modalService:ModalService,
 elementChild:ElementRef,
 rendererChild:Renderer,
 @Inject(DOCUMENT) documentChild:any,
 @Inject(ComponentsHelper) componentsHelperChild:ComponentsHelper)
 {
 super(elementChild, rendererChild, documentChild, componentsHelperChild);
 ModalEvent.subscribe((modalEvent:ModalEvent)=>{
 if (modalEvent.eventType === ModalEventType.OPEN) {
 this.creationModalEvent = modalEvent
 }
 });
 }*/