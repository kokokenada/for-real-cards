import {
  Component,
  Directive,
  ComponentFactory,
  ComponentMetadata,
  ComponentResolver,
  Input,
  ReflectiveInjector,
  ViewContainerRef,
  Type

} from '@angular/core'

import { Tools } from "../../api/services/tools";
import {ModalService} from "./modal.service.ts";
import {ModalEvent, ModalEventType} from "./modal-event.class";


//our root app component
// From: http://blog.lacolaco.net/post/dynamic-component-creation-in-angular-2/     http://plnkr.co/edit/HCz7Kc?p=info
export function createComponentFactory(resolver: ComponentResolver, metadata: ComponentMetadata, componentParameters:Object): Promise<ComponentFactory<any>> {
  const cmpClass = class DynamicComponent {
    componentParameters:Object = componentParameters;
  };
  const decoratedCmp:Type = <Type>Component(metadata)(cmpClass);
  return resolver.resolveComponent(decoratedCmp);
}

@Directive({
  selector: 'dynamic-html-outlet',
})
export class DynamicHTMLOutlet {
  @Input() src: string;
  @Input() requestedSelector:string;
  @Input() requestedDirective:Type;
  @Input() componentParameters:Object;
  constructor(private vcRef: ViewContainerRef, private resolver: ComponentResolver) {
  }

  ngOnChanges() {
    console.log('ngOnChanges')
    console.log(this)
    if (!this.src || !this.requestedSelector || !this.requestedDirective || !this.componentParameters)
      return;

    const metadata = new ComponentMetadata({
      selector: 'dynamic-html', //this.requestedSelector,
      directives: [this.requestedDirective],
      template: this.src,
      inputs: ['componentParameters']
      
    });
    createComponentFactory(this.resolver, metadata, this.componentParameters)
      .then(factory => {
        const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
        this.vcRef.createComponent(factory, 0, injector, []);
      });
  }
}

@Component({
  selector: 'modal-dialog',
  template: `
        <dynamic-html-outlet 
          [src]="getHtml()" 
          [requestedSelector]="getRequestedSelector()" 
          [requestedDirective]="getRequestedDirective()"
          [componentParameters]="getComponentParameters()"></dynamic-html-outlet>
    `,
  directives: [DynamicHTMLOutlet]
})
export class ModalDialog {
  private html: string;
  private requestedSelector: string;
  private requestedDirective: Type;
  private componentParameters:Object;

  constructor(private modalService:ModalService) {
    ModalEvent.subscribe((modalEvent:ModalEvent)=>{
      if (modalEvent.eventType === ModalEventType.OPEN) {
        this.requestedSelector = modalEvent.componentSelector;
        this.requestedDirective = modalEvent.componentType;
        this.componentParameters = modalEvent.componentParameters || {};
        let params = modalEvent.componentParameters;
        let paramsString = "";
        if (params) {
          let keys:string[] = _.keys(params);
          for (let i=0; i<keys.length; i++) {
            let key = keys[i];
            let value = Tools.stringify(params[key], null, 0); //.toString();
            if (value.indexOf("'")!==-1) {
              throw "Can't have ' in value"; // TODO find a function that allows quotes, or write one
            }
            paramsString += " [" + key + "] = '" + value + "'";
            console.log(paramsString)
          }
        }
//        this.html = "<" + modalEvent.componentSelector + paramsString + "></" + modalEvent.componentSelector + ">";
        this.html = "<" + modalEvent.componentSelector + " [componentParameters]='componentParameters'></" + modalEvent.componentSelector + ">";
        console.log(this)
      }
    });
  }

  getHtml():string {
    return this.html;
  }

  getRequestedSelector():string {
    return this.requestedSelector;
  }

  getRequestedDirective():Type {
    return this.requestedDirective;
  }

  getComponentParameters():Object {
    console.log('getComponentParameters')
    console.log(this.componentParameters)
    return this.componentParameters;
  }
}

