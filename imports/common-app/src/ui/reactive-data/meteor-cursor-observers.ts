import {Observable, Subscriber} from 'rxjs';
import { Meteor } from 'meteor/meteor';

import {EDocumentChangeType, IDocumentChange} from './document-change.interface';

export class MeteorCursorObservers {
  static createCursorObserver<T>(cursor: Mongo.Cursor<any>): Observable<IDocumentChange<T>> {
    return Observable.create((observer: Subscriber<IDocumentChange<T>>) => {
      let handle: Meteor.LiveQueryHandle = cursor.observe({
        added: (doc: T) => {
          observer.next({
            changeType: EDocumentChangeType.NEW,
            newDocument: doc
          });
        },

        changed: (nDoc: T, oDoc: T) => {
          observer.next({
            changeType: EDocumentChangeType.CHANGED,
            newDocument: nDoc,
            oldDocument: oDoc
          });
        },

        removed: (doc: T) => {
          observer.next({
            changeType: EDocumentChangeType.REMOVED,
            oldDocument: doc
          });
        }
      });

      return function unsubscribe() {
        handle.stop();
      };
    });

  }

  static createCursorObserverWithAt<T>(cursor: Mongo.Cursor<any>): Observable<IDocumentChange<T>> {
    return Observable.create((observer: Subscriber<IDocumentChange<T>>) => {
      let handle: Meteor.LiveQueryHandle = cursor.observe({
        addedAt: (doc: T, index: number) => {
          observer.next({
            changeType: EDocumentChangeType.NEW,
            newDocument: doc,
            atIndex: index
          });
        },
        changedAt: (nDoc: T, oDoc: T, index: number) => {
          observer.next({
            changeType: EDocumentChangeType.CHANGED,
            newDocument: nDoc,
            oldDocument: oDoc,
            atIndex: index
          });
        },

        movedTo: (doc:T, fromIndex:number, toIndex:number) => {
          observer.next({
            changeType: EDocumentChangeType.MOVED,
            newDocument: doc,
            atIndex: toIndex,
            fromIndex: fromIndex
          });
        },

        removedAt: (doc:T, atIndex:number) => {
          observer.next({
            changeType: EDocumentChangeType.REMOVED,
            oldDocument: doc,
            atIndex: atIndex
          });
        }
      });

      return function unsubscribe() {
        handle.stop();
      };
    });

  }
}
