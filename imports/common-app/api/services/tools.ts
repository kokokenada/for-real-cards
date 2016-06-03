const SNAKE_CASE_REGEXP = /[A-Z]/g;

export class Tools {
  static deepCopyNoHash(source) {
    throw 'to implement'
  };

  static deepCopy(source) {
    return Object.assign({}, source);
  };

  static stringify = function (obj, replacer = null, spaces = 2, cycleReplacer=null) {
    function serializer(replacer, cycleReplacer) {
      var stack = [], keys = [];

      if (cycleReplacer == null) cycleReplacer = function (key, value) {
        if (stack[0] === value)
          return "[Circular ~]";
        return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
      };

      return function (key, value) {
        if (stack.length > 0) {
          var thisPos = stack.indexOf(this);
          ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
          ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
          if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
        }
        else
          stack.push(value);

        return replacer == null ? value : replacer.call(this, key, value)
      }
    }

    return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
  };

  static stringToBool(stringValue:string):boolean {
    if (typeof stringValue === 'string') {
      return !(stringValue.toLowerCase() === 'false' || stringValue.toLocaleLowerCase() === "no");
    }
    return false;
  }


  static ucFirst(word:string):string {
    return `${word.charAt(0).toUpperCase()}${word.substring(1)}`;
  }

  static dashToCamel(dash:string):string {
    let words = dash.split('-');
    return `${words.shift()}${words.map(Tools.ucFirst).join('')}`;
  }

  static dasherize(name:string, separator:string = '-'):string {
    return name.replace(SNAKE_CASE_REGEXP, (letter:string, pos:number) => {
      return `${(pos ? separator : '')}${letter.toLowerCase()}`;
    });
  }

  static snakeCase(name:string, separator:string = '-'):string {
    return name.replace(SNAKE_CASE_REGEXP, (letter:string, pos:number) => {
      return `${(pos ? separator : '')}${letter.toLowerCase()}`;
    });
  }

}