import { Component, ComponentMetadata, ComponentFactory, ComponentResolver, Directive, EventEmitter, Input, Output, Type, ViewContainerRef } from '@angular/core';
import { PlatformTools } from "../../api/services/platform-tools";


function createComponentFactory(resolver: ComponentResolver, metadata: ComponentMetadata, parent:CommonAppButton): Promise<ComponentFactory<any>> {
  const cmpClass = class DynamicComponent {
    @Output() click = new EventEmitter();
    onClick(o:any) {
      this.parent.onCABClick(o);  // Passing parent in seems simpler than figuring out how to dynamically define event hanlders
    }
    parent:CommonAppButton = parent;
  };
  const decoratedCmp:Type = <Type>Component(metadata)(cmpClass);
  return resolver.resolveComponent(decoratedCmp);
}

@Directive({
  selector: 'common-app-button'
})
export class CommonAppButton {
  @Input() size:string;
  @Input() label:string;
  @Input() outline:boolean;
  @Input() color:string;
  @Output() click = new EventEmitter();
  constructor(private vcRef: ViewContainerRef, private resolver: ComponentResolver) {
  }

  ngOnChanges() {

    let html = '<button (click)="onClick(clickMessage=$event)" ';
    if (PlatformTools.isIonic()) {
      html += this.size + ' ';
      html += this.color + ' ';
      if (this.outline) {
        html += 'outline ';
      }
      html += '>';
    } else if (PlatformTools.isTWBS()) {
      let classString = "class = 'btn ";
      let mainClass = 'btn-';
      if (this.color==='light') {
        mainClass += 'info'; // hmmm.  How translate Ionic light into TWBS?
      } else if (this.color=='dark') {
        mainClass += 'primary'; // hmmm.  How translate Ionic dark into TWBS?
      } else if (!this.color || this.color==="") {
        mainClass += 'primary';
      } else {
        // All other Ionic colors should translate
        mainClass += this.color;
      }
      if (this.outline) {
        mainClass += '-outline'
      }
      classString += mainClass + ' ';
      if (this.size==="large") {
         classString += 'btn-lg ';
      } else if (this.size==="small") {
        classString += 'btn-sm ';
      }
      classString += "'>";
      html += classString;
    } else {
      throw "Unsupported platform";
    }
    html += this.label;
    html += "</button>";
    const metadata = new ComponentMetadata({
      selector: 'dynamic-html',
      template: html
    });
    createComponentFactory(this.resolver, metadata, this)
      .then(factory => {
        this.vcRef.createComponent(factory, 0);
      });
  }

  onCABClick(o:any) {
    this.click.emit(o);
  }
}