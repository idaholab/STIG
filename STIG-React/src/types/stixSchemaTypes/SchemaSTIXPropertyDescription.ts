import { SchemaSTIXClassName } from './SchemaSTIXClassName';

export type SchemaSTIXPropertyDescription = {
  name: SchemaSTIXClassName;
  superClasses: SchemaSTIXClassName[];
  properties: {
    [propName: string]: string;
  };
};
