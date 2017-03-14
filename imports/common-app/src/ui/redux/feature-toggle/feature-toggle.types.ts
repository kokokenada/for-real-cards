import { TypedRecord } from 'typed-immutable-record';

export interface IToggle {
  [id: string]: any;
}
export interface IToggleRecord extends TypedRecord<IToggleRecord>,
  IToggle {}

export interface IFeatureToggleConfig {
  setting: any;                 // feature state
  responsible?: string;          // who is responsible for this toggle
  group?: string;               // other reponsible people
  description?: string;
  shouldExpireAt?: Date;
  howToCleanUp?: string;
}

export interface IFeatureToggleConfigSet {
  [propName: string]: IFeatureToggleConfig;
}