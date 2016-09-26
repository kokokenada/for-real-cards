import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'common-app-button',
  template: `
<button
  (click)="onClick(clickMessage=$event)"
  [class] = "classString()"
 ></button>
`
})
export class CommonAppButton {
  @Input() size:string;
  @Input() label:string;
  @Input() outline:boolean;
  @Input() color:string;
  @Output() click = new EventEmitter();

  onCABClick(o:any) {
    this.click.emit(o);
  }

  classString():string {
    let classString = "btn ";
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
    return classString;
  }
}
