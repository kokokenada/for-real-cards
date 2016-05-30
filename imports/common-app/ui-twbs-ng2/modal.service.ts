/**
 * Created by kenono on 2016-04-23.
 */
import * as log from 'loglevel';
import { ComponentFactory, ComponentRef, Injector, Renderer, provide } from '@angular/core'
import { Routes, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteSegment } from '@angular/router'

import {Tools} from '../../common-app/api'
import {Subject} from 'rxjs';
import { Injectable, Inject } from '@angular/core';

interface ModalInfo {
  subject:Subject;
  payload;
}


/*
let modalServiceFactory = (componentFactory: ComponentFactory, injector: Injector, renderer: Renderer) => {
  return new ModalService(componentFactory, injector, renderer);
}
export let modalServiceProvider =
  provide("ModalService", {
    useFactory: modalServiceFactory,
    deps: [ComponentFactory, Injector, Renderer]
  });

*/
/*
@Component({
  template: ModalService.template
})*/
@Injectable()
export class ModalService {
  // All static members due to issues with construction (class gets constructed by modal)
  private static subject:Subject;
  private static staticModalInstance;
  private static template:string;
  // private  modalElement;
  private static serviceSubject:Subject;
  private static returnUrl:string;
  constructor(private router: Router, public segment:RouteSegment) { //private componentFactory:ComponentFactory) {//} private injector: Injector, private renderer: Renderer) {
  }
  
  open(selector:string, params=undefined):Subject {
    console.log("modal open");
    ModalService.returnUrl = this.router.serializeUrl(this.router.urlTree);
    this.router.navigate(['/' + selector], params);  // Temporary, until modal can operate without Router hack
    

/*    let el = document.getElementById("common-app.modal");
    if (!el) {
      let debugInfo:any;
      el = this.renderer.createElement(document.rootElement, "div", debugInfo);
      this.renderer.setElementAttribute(el, "id", "common-app.modal");
      console.log(el)
    }
    this.componentFactory.selector = selector;
    let componentRef = this.componentFactory.create(this.injector);
*/
    ModalService.serviceSubject = new Subject();
    return ModalService.serviceSubject;

  }
  
  close(result:any) {
    ModalService.serviceSubject.next(result);
    ModalService.serviceSubject.complete();
    this.router.navigateByUrl(ModalService.returnUrl);
  }

}



export let MODAL_PROVIDERS = [
  ModalService //,
  //ComponentFactory//,
//  Injector,
//  Renderer
];
