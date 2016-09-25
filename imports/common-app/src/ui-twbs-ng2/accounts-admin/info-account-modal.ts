import { Component, OnInit } from '@angular/core';
import { AccountsModal } from './accounts-modal';

@Component({
  selector: 'info-account-modal',
  template: `

  <div class="modal-header">
    <h4>Account Info {{displayName()}}</h4>
  </div>
  <div class="modal-body">
    <ul class="list-group">
				<li class="list-group-item"><strong>ID</strong><span class="pull-right">{{user._id}}</span></li>
				<li class="list-group-item"><strong>Created</strong><span class="pull-right">{{user.createdAt}}</span></li>
				<li class="list-group-item"><strong>Roles</strong>
					<span *ngFor="let role of user.roles">{{role}} </span>
				</li>
				<textarea style='width: 90%; height:40vh; overflow-y: scroll'>{{getXMLDump()}}</textarea>
			</ul>
	 	</div>
	 	<div class="modal-footer">
			<button type="button" (click)="complete()" class="btn btn-primary">OK</button>
		</div>
		
`
})
export class InfoAccountModal extends AccountsModal implements OnInit {
  constructor() {
    super();
  }

  getXMLDump():string {
    return JSON.stringify(this.user, null, ' ');
  }
}

