import { SchemaSTIXClassName } from './SchemaSTIXClassName';
import { SchemaSTIXProperty } from './SchemaSTIXProperty';

export type SchemaSTIXClass = {
  name: SchemaSTIXClassName;
  superClasses: SchemaSTIXClassName[];
  description?: string;
  properties: SchemaSTIXProperty[];
};
