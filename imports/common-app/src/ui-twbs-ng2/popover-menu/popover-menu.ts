import { Component, Input, NgZone } from '@angular/core';
import { Menus, MenuItem } from 'common-app';

@Component({
  selector: 'popover-menu',
  template: `

    <div ngbDropdown>
      <button id="dropdownMenu1" class="btn btn-primary" ngbDropdownToggle></button>
      <div class="dropdown-menu dropdown-menu-right">
        <button
            *ngFor="let item of menuItems | menuFilter"
            (click)="itemSelected(item)"
            class="dropdown-item"
        >
          {{item.title}}
        </button>      
      </div>
    </div>
`,
})
export class PopoverMenu {
  constructor(private ngZone:NgZone) {
  }
  @Input() menuItems:MenuItem[];

  itemSelected(menuItem:MenuItem) {
    menuItem.selected();
  }

}