/**
 * Created by kenono on 2016-04-16.
 */

import {Observable, Subject, Subscription} from 'rxjs'
import { Component, Input } from '@angular/core';
import * as log from 'loglevel';

import {Modal} from '../../common-app/ui-twbs-ng2/modal';

export class CommonPopups {

  
  static alert(messageOrError:any, isHTML:boolean=false, title:string="", ok:string="OK", cancel:string="Cancel"):void {

    if (typeof messageOrError === 'undefined') {
      messageOrError = {message: "undefined message"};
    }
    
    let message:string;

    if (typeof messageOrError === 'string') {
      message = messageOrError;
    } else {
      if (typeof messageOrError === 'object' && messageOrError.message) {
        message = messageOrError.message;
      } else {
        message = JSON.stringify(messageOrError);
      }
    }


    let html:string = '<p>' + message + '</p>' + '<button class="btn btn-primary"> ng-click="vm.ok()"' + ok + '</button>';

    /*      let modalInstance = this.$uibModal.open({
     template: html,
     controller: CommonPopups,
     controllerAs: 'vm'
     });

     modalInstance.result.then(
     ()=> {
     resolve();
     }, ()=> {
     resolve();
     }
     );
     */
    window.alert(message);
  };
  
  static confirm(message:string, isHTML:boolean=false, title:string="", ok:string="OK", cancel:string="Cancel"):Subject {
    return ConfirmModal.openConfirm(message, isHTML, title, ok, cancel);    
  }
}


@Component(
  {
    selector: 'confirmModal',
    controller: ConfirmModal,
    controllerAs: 'vm',
    template:
`
<form role="form" class="form-horizontal">
    <div class="panel-heading">
      <h3 class="panel-title">{{vm.titleText}}</h3>
      {{vm.messageText}}
      <div class="form-group col-md-6"> 
        <button ng-click="vm.cancel()" class="btn btn-default pull-right">{{vm.cancelText}}</button> 
        <button ng-click="vm.ok()" class="btn btn-success pull-right">{{vm.okText}}</button> 
      </div>
    </div>
</form>    
`
})
class ConfirmModal extends Modal {
  @Input() titleText:string;
  @Input() cancelText:string;
  @Input() okText:string;
  @Input() messageText:string;

  constructor() {
    super();
  }

  static openConfirm(messageText:string, isHTML:boolean, titleText:string, okText:string, cancelText:string):Subject  {
    let params = {
      titleText: titleText,
      messageText: messageText,
      cancelText: cancelText,
      okText: okText
    };
    if (isHTML) {
      log.error('isHTML not yet supported');
    }
    return ConfirmModal.open(params);
  }

  ok() {
    super.complete(true);
  }
  cancel() {
    super.complete(false);
  }
}