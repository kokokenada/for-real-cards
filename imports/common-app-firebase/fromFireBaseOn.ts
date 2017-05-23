import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {EDocumentChangeType, IDocumentChange} from 'common-app';
import {Subscriber} from 'rxjs/Subscriber';

export function fromFireBaseOn<T>(ref: firebase.database.Reference): Observable<IDocumentChange<T>> {
  return Observable.create((observer: Subscriber<IDocumentChange<T>>) => {

    ref.orderByKey().on('child_added', (snapshot: any) => {
      let doc = snapshot.val();
      observer.next({
        changeType: EDocumentChangeType.NEW,
        newDocument: doc
      });
    });

    ref.orderByKey().on('child_removed', (snapshot: any) => {
      let doc = snapshot.val();
      observer.next({
        changeType: EDocumentChangeType.REMOVED,
        oldDocument: doc
      });
    });

    ref.orderByKey().on('child_changed', (snapshot: any) => {
      let doc = snapshot.val();
      observer.next({
        changeType: EDocumentChangeType.CHANGED,
        newDocument: doc,
        oldDocument: null
      });

    });
    ref.orderByKey().on('child_moved', (snapshot) => {
      let doc = snapshot.val();
      console.log('child_moved')
      console.log(doc)

    });


  });
}