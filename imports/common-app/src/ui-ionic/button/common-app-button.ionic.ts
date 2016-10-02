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
    return '';
  }
}
