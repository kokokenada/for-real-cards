
import { Injectable, Injector, ComponentFactory, ComponentFactoryResolver, Component, ComponentRef, Type, ViewContainerRef } from '@angular/core';
import * as log from 'loglevel';
import {ModalActions} from "./modal-actions.class";

@Injectable()
export class ModalService {
  currentComponent = null;
  constructor(private resolver: ComponentFactoryResolver, private injector:Injector) {

  }

  open(type:Type<any>) {
    // We create a factory out of the component we want to create
    let factory = this.resolver.resolveComponentFactory(type);

    // We create the component using the factory and the injector
    let componentRef:ComponentRef<any> = factory.create(this.injector);

    // We insert the component into the dom container
    this.dynamicComponentContainer.insert(componentRef.hostView);

    // We can destroy the old component is we like by calling destroy
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    this.currentComponent = componentRef;
  }
}
