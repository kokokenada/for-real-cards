import {Observable, Subscriber} from 'rxjs';
import {Meteor} from 'meteor/meteor';

import {EDocumentChangeType, IDocumentChange} from './document-change.interface';

export interface BatchAndWatch<T> {
  batchObservable: Observable<T[]>;
  watchedObservable: Observable<T>;
}
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

  /**
   * Create an observable that fires once with a batch of records and another observable that fires thereafter
   *
   * TODO: 1: Is it better to implement this as an operator? 2: Is there a combination of existing operators that does this better?
   *
   * @param observable
   * @param inactivityTreshold
   * @param maxBatchSize
   * @returns {{batchObservable: Observable<T>[], watchedObservable: Observable<T>}}
   */
  static batchAndWatch<T> (observable: Observable<T>, inactivityTreshold: number = 30, maxBatchSize: number = 1000): BatchAndWatch<T> {
    let batch: T[] = [];
    let timeOfLastData: Date = new Date();
    let collecting = true;

    let batchObservable: Observable<T[]> = Observable.create((observer: Subscriber<T[]>) => {
      let finishBatch = () => {
        collecting = false;
        observer.next(batch);
        observer.complete();
      };
      let checkInactivityThreshold = () => {
        let delta: number = new Date().getTime() - timeOfLastData.getTime();
        if (delta > inactivityTreshold) {
          finishBatch();
        } else {
          Meteor.setTimeout(checkInactivityThreshold, inactivityTreshold - delta);
        }
      };
      Meteor.setTimeout(checkInactivityThreshold, inactivityTreshold);

      observable.subscribe((value: T)=> {
          timeOfLastData = new Date();
          batch.push(value);
          if (batch.length === maxBatchSize) {
            finishBatch();
          }
        },
        (error)=> {
          observer.error(error)
        },
        ()=> {
          observer.complete()
        }
      );

      return function unsubscribe() {
        collecting = false;
      };
    });
    let watchedObservable: Observable<T> = Observable.create((observer: Subscriber<T>) => {
      observable.subscribe((value: T)=> {
          if (!collecting) {
            observer.next(value);
          }
        },
        (error)=> {
          observer.error(error)
        },
        ()=> {
          observer.complete()
        }
      );

    });
    return {batchObservable: batchObservable, watchedObservable: watchedObservable};
  };

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

        movedTo: (doc: T, fromIndex: number, toIndex: number) => {
          observer.next({
            changeType: EDocumentChangeType.MOVED,
            newDocument: doc,
            atIndex: toIndex,
            fromIndex: fromIndex
          });
        },

        removedAt: (doc: T, atIndex: number) => {
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
