import {
  IToggleRecord,
  IToggle, IFeatureToggleConfigSet,
} from './feature-toggle.types';
import { makeTypedFactory } from 'typed-immutable-record';

const defaultToggle = {};

export const ToggleFactory = makeTypedFactory<IToggle, IToggleRecord>(
  defaultToggle
);

export const INITIAL_STATE = ToggleFactory();

export function fromConfig(configSet: IFeatureToggleConfigSet) {
  let justTheValues = {};
  for (let prop in configSet) {
    justTheValues[prop] = configSet[prop].setting;
  }
  return makeTypedFactory<IToggle, IToggleRecord>(justTheValues)();
}