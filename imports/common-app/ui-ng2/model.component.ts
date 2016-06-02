import { Injector, ComponentFactory, ComponentRef, Type} from '@angular/core';


export class ModalDialog{
  constructor(private componentFactory: ComponentFactory, private injector: Injector) {

  }

  protected open(component:Type) {
    this.componentFactory.componentType = component;
    let componentRef:ComponentRef = this.componentFactory.create(this.injector);
    
  }
}


