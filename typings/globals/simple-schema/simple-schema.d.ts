/// <reference path="../meteor/index.d.ts" />

declare var SimpleSchema: SimpleSchemaStatic;

interface SimpleSchemaStatic {
  new<T>(definition: MeteorSimpleSchema.Definition): SimpleSchema<T>;

  debug: boolean;

  RegEx: {
    Email: RegExp;
    Domain: RegExp;
    WeakDomain: RegExp;
    IP: RegExp;
    IPv4: RegExp;
    IPv6: RegExp;
    Url: RegExp;
    Id: RegExp;
    ZipCode: RegExp;
  };

  /**
   * Adds a custom validation function that is called for all keys in all defined schemas.
   * All information for the validation is provided in the function's context.
   * Cast this to SimpleSchema.CustomValidationThis in order to make use of that context
   */
  addValidator(customValidator: Function): void;

  messages(errorMessages: MeteorSimpleSchema.ErrorMessages): void;
}

interface SimpleSchema<T> {
  /**
   *  You can use this method, to alter one or more labels on the fly
   */
  labels(updatedLabels: {[propertyName: string]: string}): void;

  /**
   * Returns a label for a property. This method is reactive.
   */
  label(propertyName: string): string

  /**
   * The clean method takes the object to be cleaned as its first argument and the following optional options as its second argument.
   * The object is cleaned in place. That is, the original referenced object will be cleaned.
   * You do not have to use the return value of the clean method.
   */
  clean(objectOrModifier: T, options?: MeteorSimpleSchema.CleaningOptions): T;

  /**
   * The clean method takes the object to be cleaned as its first argument and the following optional options as its second argument.
   * The object is cleaned in place. That is, the original referenced object will be cleaned.
   * You do not have to use the return value of the clean method.
   */
  clean(objectOrModifier: Mongo.Modifier, options?: MeteorSimpleSchema.CleaningOptions): Mongo.Modifier;

  /**
   * Returns a new unnamed validation context.
   */
  newContext(): MeteorSimpleSchema.ValidationContext<T>;

  /**
   * Returns a new named validation context. It's usually best to use a named validation context.
   * That way, the context is automatically persisted by name, allowing you to easily rely on its reactive methods.
   */
  namedContext(name: string): MeteorSimpleSchema.ValidationContext<T>;

  /**
   * Adds a custom validation function that is called for all keys for a specific SimpleSchema instance.
   * All information for the validation is provided in the function's context.
   * Cast this to SimpleSchema.CustomValidationThis in order to make use of that context
   */
  addValidator(customValidator: Function): void;

  schema(): MeteorSimpleSchema.Definition;
  schema(key: string): MeteorSimpleSchema.PropertyDefinition;

  messages(errorMessages: MeteorSimpleSchema.ErrorMessages): void;
}

declare module MeteorSimpleSchema {
  interface Definition {
    [propertyName: string]: MeteorSimpleSchema.PropertyDefinition;
  }

  interface PropertyDefinition {
    type: StringConstructor|NumberConstructor|BooleanConstructor|ObjectConstructor|DateConstructor
      |[StringConstructor]|[NumberConstructor]|[BooleanConstructor]|[ObjectConstructor]|[DateConstructor];

    /**
     * A string that will be used to refer to this field in validation error messages.
     * The default is an inflected (humanized) derivation of the key name itself.
     * For example, the key "firstName" will have a default label of "First name".
     *
     * If you require a field that changes its meaning in some circumstances you can provide a callback function as a label.
     */
    label?: string|(()=>string);

    /**
     * By default, all keys are required. Set optional: true to change that.
     *
     * With complex keys, it might be difficult to understand what "required" means.
     * Here's a brief explanation of how requiredness is interpreted:
     *
     * - If type is Array or is an array (any type surrounded by array brackets),
     * 	 then "required" means that key must have a value, but an empty array is fine.
     * 	 (If an empty array is not fine, add the minCount: 1 option.)
     * - For items within an array, or when the key name ends with ".$", the optional option has no effect.
     * 	 That is, something cannot be "required" to be in an array.
     * - If a key is required at a deeper level, the key must have a value only if the object it belongs to is present.
     * - When the object being validated is a Mongo modifier object,
     * 	 changes that would unset or null a required key result in validation errors.
     */
    optional?: boolean;

    /**
     * If type is Number or [Number], these rules define the minimum numeric value.
     * If type is String or [String], these rules define the minimum string length.
     * If type is Date or [Date], these rules define the minimum date, inclusive.
     */
    min?: number;

    /**
     * If type is Number or [Number], these rules define the maximum numeric value.
     * If type is String or [String], these rules define the maximum string length.
     * If type is Date or [Date], these rules define the maximum date, inclusive.
     */
    max?: number;

    /**
     * Set to true to indicate that the numeric value, set by min, is to be treated as an exclusive limit.
     * Set to false (default) to treat limit as inclusive.
     */
    exclusiveMin?: boolean;

    /**
     * Set to true to indicate that the numeric value, set by max, is to be treated as an exclusive limit.
     * Set to false (default) to treat limit as inclusive.
     */
    inclusiveMin?: boolean;

    /**
     * Set to true if type is Number or [Number] and you want to allow non-integers. The default is false.
     */
    decimal?: boolean;

    /**
     * Define the minimum array length. Used only when type is an array or is Array.
     */
    minCount?: number;

    /**
     * Define the maximum array length. Used only when type is an array or is Array.
     */
    maxCount?: number;

    /**
     * An array of values that are allowed. A key will be invalid if its value is not one of these.
     */
    allowedValues?: any[];

    /**
     * Any regular expression that must be matched for the key to be valid,
     * or an array of regular expressions that will be tested in order.
     */
    regEx?: RegExp|RegExp[];

    /**
     * If you have a key with type Object, the properties of the object will be validated as well,
     * so you must define all allowed properties in the schema.
     * If this is not possible or you don't care to validate the object's properties,
     * use the blackbox: true option to skip validation for everything within the object.
     *
     * Custom object types are treated as blackbox objects by default. However, when using collection2,
     * you must ensure that the custom type is not lost between client and server.
     * This can be done with a transform function that converts the generic Object to the custom object.
     * Without this transformation, client-side inserts and updates might succeed on the client but then fail on the server.
     * Alternatively, if you don't care about losing the custom type,
     * you can explicitly set blackbox: true for a custom object type instead of using a transformation.
     */
    blackbox?: boolean;

    /**
     * Set to false if the string value for this key should not be trimmed (i.e., leading and trailing spaces should be kept).
     * Otherwise, all strings are trimmed when you call mySimpleSchema.clean().
     */
    trim?: boolean;

    /**
     * All information for the validation is provided in the function's context.
     * Cast this to SimpleSchema.CustomValidationThis in order to make use of that context
     */
    custom?: Function;

    /**
     * Set this to any value that you want to be used as the default when an object does not include this field or
     * has this field set to undefined. This value will be injected into the object by a call to mySimpleSchema.clean().
     * Default values are set only when cleaning non-modifier objects.
     *
     * Note the following points of confusion:
     * - A default value itself is not cleaned. So, for example, if your default value is "",
     * 	 it will not be removed by the removeEmptyStrings operation in the cleaning.
     * - A default value is always added if there isn't a value set. Even if the property is a child of an optional object,
     * 	 and the optional object is not present, the object will be added and its property will be set to the default value.
     * 	 Effectively, this means that if you provide a default value for one property of an object,
     * 	 you must provide a default value for all properties of that object or risk confusing validation errors.
     *
     * If you need more control, use the autoValue option instead.
     */
    defaultValue?: any;

    /**
     * The autoValue option allows you to specify a function that is called by mySimpleSchema.clean() to potentially change
     * the valueof a property in the object being cleaned. This is a powerful feature that allows you to set up either
     * forced values or default values, potentially based on the values of other fields in the object.
     *
     * An autoValue function is passed the document or modifier as its only argument, but you will generally not need it.
     * Instead, the function context provides a variety of properties and methods to help you determine what you should return.
     * Cast this to SimpleSchema.AutoValueThis in order to make use of that context
     *
     * If an autoValue function does not return anything (i.e., returns undefined), the field's value will be
     * whatever the document or modifier says it should be. If that field is already in the document or modifier,
     * it stays in the document or modifier with the same value. If it's not in the document or modifier, it's still not there.
     * If you don't want it to be in the doc or modifier, you must call this.unset().
     *
     * Any other return value will be used as the field's value. You may also return special pseudo-modifier objects for update operations.
     * Examples are {$inc: 1} and {$push: new Date}.
     */
    autoValue?: (documentOrModifier: any) => any|void;
  }

  interface BaseCleaningOptions {
    /**
     * Filter out properties not found in the schema? True by default.
     */
    filter?: boolean;

    /**
     * Type convert properties into the correct type where possible? True by default.
     */
    autoConvert?: boolean;

    /**
     * Remove keys in normal object or $set where the value is an empty string? True by default.
     */
    removeEmptyStrings?: boolean;

    /**
     * Remove all leading and trailing spaces from string values? True by default.
     */
    trimStrings?: boolean;

    /**
     * Run autoValue functions and inject automatic and defaultValue values? True by default.
     */
    getAutoValues?: boolean;
  }

  interface CleaningOptions extends BaseCleaningOptions {
    /**
     * Is the first argument a modifier object? False by default.
     */
    isModifier?: boolean;

    /**
     * This object will be added to the this context of autoValue functions.
     */
    extendAutoValueContext?: any;
  }

  interface ValidationContext<T> {
    /**
     * This method returns true if the object is valid according to the schema or false if it is not.
     * It also stores a list of invalid fields and corresponding error messages in the context object
     * and causes the reactive methods to react.
     */
    validate(obj: T|Mongo.Modifier, options?: ValidationOptions): boolean;

    /**
     * This works the same way as the validate method, except that only the specified schema key will be validated.
     * This may cause all of the reactive methods to react.
     */
    validateOne(obj: T|Mongo.Modifier, key: string, options?: ValidationOptions): boolean;

    /**
     * You can call it, to see if the object passed into validate() was found to be valid.
     * This is a reactive method that returns true or false.
     */
    isValid(): boolean;

    /**
     * Returns the full array of invalid key data. Each object in the array has two keys:
     * - name: The schema key as specified in the schema.
     * - type: The type of error. One of the required*, min*, max* etc. strings listed at Manually Adding a Validation Error.
     *
     * This is a reactive method. There is no message property.
     * Once you see what keys are invalid, you can call ctxt.keyErrorMessage(key) to get a reactive message string.
     */
    invalidKeys(): {name: string; type: string}[];

    /**
     * Returns true if the specified key is currently invalid, or false if it is valid. This is a reactive method.
     */
    keyIsInvalid(key: string): boolean;

    /**
     * Teturns the error message for the specified key if it is invalid. If it is valid, this method returns an empty string.
     * This is a reactive method.
     */
    keyErrorMessage(key: string): string;

    /**
     * If you need to reset the validation context, clearing out any invalid field messages and making it valid.
     */
    resetValidation(): void;

    /**
     * If you want to reactively display an arbitrary validation error and it is not possible to use a custom validation function
     * (perhaps you have to call a function onSubmit or wait for asynchronous results),
     * you can add one or more errors to a validation context at any time.
     *
     * - name: The schema key as specified in the schema.
     * - type: The type of error. Any string you want, or one of the following built-in strings: required, minString, maxString,
     * 			minNumber, maxNumber, minDate, maxDate, badDate, minCount, maxCount, noDecimal, notAllowed, expectedString,
     * 			expectedNumber, expectedBoolean, expectedArray, expectedObject, expectedConstructor, regEx
     * - value: Optional. The value that was not valid. Will be used to replace the [value] placeholder in error messages.
     */
    addInvalidKeys(errors: {name: string; type: string; value?: string}[]): void;
  }

  interface ValidationOptions {
    /**
     * Are you validating a Mongo modifier object? False by default.
     */
    modifier?: boolean;

    /**
     * Are you validating a Mongo modifier object potentially containing upsert operators? False by default.
     */
    upser?: boolean;

    /**
     * This object will be added to the this context in any custom validation functions that are run during validation.
     */
    extendedCustomContext?: any;
  }

  interface ThisContextPropertyInfo {
    /**
     * True if the field is already set in the document or modifier
     */
    isSet: boolean;

    /**
     * If isSet = true, this contains the field's current (requested) value in the document or modifier.
     */
    value: any;

    /**
     * If isSet=true and isUpdate=true, this contains the name of the update operator in the modifier in which this field is being changed.
     * For example, if the modifier were {$set: {name: "Alice"}}, in the autoValue function for the name field, this.isSet would be true,
     * this.value would be "Alice", and this.operator would be "$set".
     */
    operator: string;
  }

  interface ThisContext extends ThisContextPropertyInfo {
    /**
     * Use this method to get information about other fields. Pass a field name (schema key) as the only argument.
     */
    field(name: string): ThisContextPropertyInfo;

    /**
     * Use this method to get information about other fields that have the same parent object.
     */
    siblingField(name: string): ThisContextPropertyInfo;
  }

  interface AutoValueThis extends ThisContext {
    /**
     * Call this method to prevent the original value from being used when you return undefined.
     */
    unset(): void;
  }

  interface CustomValidationThis extends ThisContext {
    /**
     * The name of the schema key (e.g., "addresses.0.street")
     */
    key: string;

    /**
     * The generic name of the schema key (e.g., "addresses.$.street")
     */
    genericKey: string;

    /**
     * The schema definition object.
     */
    definition: Definition;
  }

  interface ErrorMessages {
    [errorType: string]: string|({msg: string; exp?: RegExp}[]);
  }
}