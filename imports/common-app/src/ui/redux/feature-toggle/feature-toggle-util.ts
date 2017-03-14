
export interface ParseResult {
  id: string;
  negated: boolean;
  hasValue: boolean;
  value: string;
}

export class ToggleUtil {
  static stripId(toggleIdExpression: string ): string {
    return ToggleUtil.parse(toggleIdExpression).id;
  }

  static stripIds(nameValuePairObject: Object): Object {
    return Object.keys(nameValuePairObject).reduce( (newObject, oldKey: string) => {
      newObject[ToggleUtil.stripId(oldKey)] = nameValuePairObject[oldKey];
      return newObject;
    }, {});
  }

  static parse(toggleIdExpression: string ): ParseResult {
    const negated = toggleIdExpression[0] === '!';
    let value: string = null;
    if (negated) {
      toggleIdExpression = toggleIdExpression.substr(1);
    }
    const hasValue = (toggleIdExpression.indexOf('===') !== -1);
    if (hasValue) {
      [toggleIdExpression, value] = toggleIdExpression.split('===');
    }
    return {
      id: toggleIdExpression,
      negated: negated,
      hasValue: hasValue,
      value: value
    };
  }
}
