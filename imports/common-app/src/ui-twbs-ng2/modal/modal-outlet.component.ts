import {
  Component,
  ComponentFactory,
  Compiler,
  Directive,
  Input,
  ReflectiveInjector,
  Type,
  ViewContainerRef,
  ViewRef

} from '@angular/core'

// Based on http://blog.lacolaco.net/post/dynamic-component-creation-in-angular-2/     http://plnkr.co/edit/HCz7Kc?p=info


function createComponentFactory(compiler: Compiler, metadata: Component): Promise<ComponentFactory<any>> {
  const cmpClass = class DynamicComponent {
    componentParameters:Object = creationModalEvent.componentParameters;
  };
  const decoratedCmp:Type<any> = <Type<any>>Component(metadata)(cmpClass);
  return compiler.compileModuleAndAllComponentsAsync(decoratedCmp);
}

@Directive({
  selector: 'modal-outlet',
})
export class ModalOutlet {
  constructor(private vcRef: ViewContainerRef, private compiler: Compiler) {
  }

  ngOnChanges() {
    if (!this.creationModalEvent)
      return;

    if (this.vcRef.length>=0) {  // TODO investigate somesort of caching approach, and integrate with modal remove/hide in API
      this.vcRef.clear();
    }

    let html = "<" + this.creationModalEvent.componentSelector + " [componentParameters]='componentParameters'></" + this.creationModalEvent.componentSelector + ">";
    const metadata = new Component({
      selector: 'dynamic-html',
//      directives: [this.creationModalEvent.componentType],
      template: html,
      inputs: ['componentParameters']

    });
    createComponentFactory(this.compiler, metadata, this.creationModalEvent)
      .then(factory => {
        const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
        this.vcRef.createComponent(factory, 0, injector, []);
        ModalService.notifyDisplayed();
      });
  }
}

