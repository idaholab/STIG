import { IJSONClassOptions, schema } from "@/types/schema";

export function getSTIXPropsFromSchema(schemaObject: IJSONClassOptions) {
    let props = schemaObject.properties;
    for (const superClass of schemaObject.superClasses) {
        const superClassObject = schema.classes.find(c =>
            c.name.replace(/-/g, '') === superClass
        );
        if (superClassObject) {
            props = props.concat(getSTIXPropsFromSchema(superClassObject));
        }
    }
    return props;
}