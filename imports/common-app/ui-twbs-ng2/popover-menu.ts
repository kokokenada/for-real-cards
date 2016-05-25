/**
 * Created by kenono on 2016-04-16.
 */

import {Menus, MenuItemDefintion, MenuItem} from '../api/services/menus'
import {Component} from "./util"

@Component({
  module: 'common',
  selector: 'popoverMenu',
  controllerAs: 'vm',
  controller: PopoverMenu,
  bindings: {menuId: '@'},
  template: `

    <span uib-dropdown>
      <span class="glyphicon glyphicon-menu-hamburger" uib-dropdown-toggle aria-hidden="true"></span>
      <ul class="dropdown-menu dropdown-menu-right" uib-dropdown-menu>
        <li
            ng-repeat="item in vm.menuItems()"
            ng-if="item.shouldRender()"
            ng-click="vm.itemSelected(item)"
        >
          <p>{{item.title}}</p>
        </li>      
      </ul>
    </span>
`,
})

export class PopoverMenu {
  private menuId: string;
  private $rootScope;
  constructor($rootScope) {
    this.$rootScope = $rootScope;
  }

  menuItems():MenuItem[] {
    let menuItem:MenuItem = Menus.getMenuFromId(this.menuId);
//    console.log('menuId: ' + this.menuId + ' menuItem:');
//    console.log(menuItem);
    if (menuItem)
      return menuItem.items;
  }

  itemSelected(menuItem:MenuItem) {
    console.log(menuItem);
    if (menuItem.event) {
      this.$rootScope.$broadcast(menuItem.event);
    }
    if (menuItem.callback) {
      menuItem.callback(menuItem);
    }
  }

}