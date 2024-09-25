import { SchemaSTIXProperty } from "./SchemaSTIXProperty";

export type SchemaSTIXClass = {
  name: string;
  superClasses: string[];
  description?: string;
  properties: SchemaSTIXProperty[];
}