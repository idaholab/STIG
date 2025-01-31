import { SchemaSTIXClass } from '@/types/stixSchemaTypes/SchemaSTIXClass';
import { schema } from './schema';

export function getSTIXPropsFromSchema(schemaObject: SchemaSTIXClass) {
  let props = schemaObject.properties;
  for (const superClass of schemaObject.superClasses) {
    const superClassObject = schema.find((c) => c.name === superClass);
    if (superClassObject) {
      props = props.concat(getSTIXPropsFromSchema(superClassObject));
    }
  }
  return props;
}
