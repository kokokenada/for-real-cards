import {
  Component,
  ComponentFactory,
  ComponentMetadata,
  ComponentResolver,
  Directive,
  Input,
  ReflectiveInjector,
  Type,
  ViewContainerRef,
  ViewRef

} from '@angular/core'

import { ModalEvent } from "./modal-event.class";

// Based on http://blog.lacolaco.net/post/dynamic-component-creation-in-angular-2/     http://plnkr.co/edit/HCz7Kc?p=info


function createComponentFactory(resolver: ComponentResolver, metadata: ComponentMetadata, creationModalEvent:ModalEvent): Promise<ComponentFactory<any>> {
  const cmpClass = class DynamicComponent {
    componentParameters:Object = creationModalEvent.componentParameters;
  };
  const decoratedCmp:Type = <Type>Component(metadata)(cmpClass);
  return resolver.resolveComponent(decoratedCmp);
}

@Directive({
  selector: 'modal-outlet',
})
export class ModalOutlet {
  @Input() creationModalEvent:ModalEvent;
    constructor(private vcRef: ViewContainerRef, private resolver: ComponentResolver) {
  }

  ngOnChanges() {
    if (!this.creationModalEvent)
      return;

    if (this.vcRef.length>=0) {  // TODO investigate somesort of caching approach, and integrate with modal remove/hide in API
      this.vcRef.clear();
    }

    let html = "<" + this.creationModalEvent.componentSelector + " [componentParameters]='componentParameters'></" + this.creationModalEvent.componentSelector + ">";
    const metadata = new ComponentMetadata({
      selector: 'dynamic-html',
      directives: [this.creationModalEvent.componentType],
      template: html,
      inputs: ['componentParameters']

    });
    createComponentFactory(this.resolver, metadata, this.creationModalEvent)
      .then(factory => {
        const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
        this.vcRef.createComponent(factory, 0, injector, []);
      });
  }
}

