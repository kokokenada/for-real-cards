declare var SimpleSchema: SimpleSchemaStatic;

interface SimpleSchemaDefinition {
  [attribute: string]: {[props: string]: any}
}

interface SimpleSchemaStatic {
  new(definition: SimpleSchemaDefinition): SimpleSchema;
  extendOptions(options: {[options: string]: any}): void;
  RegEx: any;
}

interface SimpleSchema {

}