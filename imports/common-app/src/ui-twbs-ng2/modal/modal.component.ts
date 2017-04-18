import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, NgZone, ReflectiveInjector, ViewContainerRef, ViewChild } from "@angular/core"
import {Subscription} from 'rxjs';
import { select } from '@angular-redux/store';

import {IModalState} from "../../ui/redux/modal/modal.types";
import {ModalActions} from "../../ui/redux/modal/modal-actions.class";
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

/*    TODO change to be a service instead of a component
 */

@Component({
  selector: 'modal-dialog',
  template: ''
})
export class ModalDialog implements  OnInit {
  @select() modalReducer;
  subscription:Subscription;
  modalRef: NgbModalRef;
  constructor(
//    private ngZone: NgZone, // Not sure why this was there.  Let's take it out and see if anything breaks
    private ngbModal : NgbModal
  ) {}

  ngOnInit() {
    this.subscription = this.modalReducer.subscribe( (modalState:IModalState<any, any>)=>{
//      this.ngZone.run( ()=>{
        if (modalState.lastEvent===ModalActions.MODAL_OPEN_REQUEST) {
          this.modalRef = this.ngbModal.open(modalState.component);
          this.modalRef.result.then((x):any=> {
          },  (e):any =>{
              ModalActions.resolveRequest(null);
          });
          ModalActions.openSuccess();
        } else if (modalState.lastEvent===ModalActions.MODAL_RESOLVE_REQUEST) {
          this.modalRef.close(modalState.result);
          ModalActions.resolveSuccess();
        }
  //    } );
    });
  }
  ngOnDestroy() {
    console.log('destroying ModalDialog');
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}


