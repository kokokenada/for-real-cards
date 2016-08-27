import {TypedRecord} from 'typed-immutable-record';


export interface IConnectState {
  retryCount: number;
  connected: boolean;
  connecting: boolean;
  serverURL: string;
}

export interface IConnectRecord extends TypedRecord<IConnectRecord>, IConnectState {}

export interface IConnectAction {
  serverURL: string;
}



