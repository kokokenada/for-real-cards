
export enum EDocumentChangeType {
  NEW,
  CHANGED,
  REMOVED,
  MOVED
}

export interface IDocumentChange<T> {
  changeType:EDocumentChangeType,
  newDocument?: T,
  oldDocument?: T,
  atIndex?:number,
  before?:string
  fromIndex?:number
}