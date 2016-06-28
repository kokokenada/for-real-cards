import { Pipe, PipeTransform } from '@angular/core';
import {MenuItem} from "../../api/services/menu-item";

@Pipe({
  name: 'menuFilter',
  pure: false
})
export class MenuFilterPipe implements PipeTransform {
  transform(allMenus: MenuItem[]) {
    return allMenus.filter( (menuItem) => { return menuItem.shouldRender()});
  }
}