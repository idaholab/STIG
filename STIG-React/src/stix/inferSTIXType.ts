import { SchemaSTIXType } from '@/types/stixSchemaTypes/SchemaSTIXType';

export function inferSTIXType(stixProperty: unknown): SchemaSTIXType | undefined {
  // TODO: Should DateTime be allowed? Binary?
  switch (typeof stixProperty) {
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'number':
      if (Number.isInteger(stixProperty)) {
        return 'integer';
      } else {
        return 'float';
      }
    case 'object':
      if (Array.isArray(stixProperty)) {
        return 'list';
      } else {
        return 'dictionary';
      }
  }
}
