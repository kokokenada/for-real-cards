import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, NgZone, ReflectiveInjector, ViewContainerRef, ViewChild } from "@angular/core"
import {Subscription} from 'rxjs';
import { select } from '@angular-redux/store';

import {IModalState} from "../../ui/redux/modal/modal.types";
import {ModalActions} from "../../ui/redux/modal/modal-actions.class";
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-dialog',
  template: ''
})
export class ModalDialog implements  OnInit {
  @select() modalReducer;
  subscription:Subscription;
  modalRef: NgbModalRef;
  needsRemoval = false;
  constructor(
    private ngZone: NgZone,
    private ngbModal : NgbModal
  ) {}

  ngOnInit() {
    this.subscription = this.modalReducer.subscribe( (modalState:IModalState<any, any>)=>{
      this.ngZone.run( ()=>{
        if (modalState.lastEvent===ModalActions.MODAL_OPEN_REQUEST) {
          this.modalRef = this.ngbModal.open(modalState.component);
          ModalActions.openSuccess();
        } else if (modalState.lastEvent===ModalActions.MODAL_RESOLVE_REQUEST) {
          this.modalRef.close(modalState.result)
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
