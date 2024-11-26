import { SchemaSTIXEnumType } from "./SchemaSTIXEnumType";
import { SchemaSTIXListType } from "./SchemaSTIXListType";
import { SchemaSTIXOpenVocabType } from "./SchemaSTIXOpenVocabType";
import { SchemaSTIXType } from "./SchemaSTIXType";

export type SchemaSTIXProperty = {
  name: string;
  type: SchemaSTIXType;
  listType?: SchemaSTIXListType;
  enumType?: SchemaSTIXEnumType;
  openVocabType?: SchemaSTIXOpenVocabType;
  mandatory?: boolean;
  notNull?: boolean;
  default?: any;
  min?: number;
  max?: number;
  propertyDescription?: string;
}