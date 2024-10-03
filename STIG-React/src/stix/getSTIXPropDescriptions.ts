import { SchemaSTIXPropertyDescription } from "@/types/stixSchemaTypes/SchemaSTIXPropertyDescription";
import { propertyDescriptions } from "./propertyDescriptions";

export function getSTIXPropDescriptions(propDescriptionObject: SchemaSTIXPropertyDescription) {
    let propsDescriptions = propDescriptionObject.properties;
    for (const superClass of propDescriptionObject.superClasses) {
        const superClassObject = propertyDescriptions.find(c =>
            c.name === superClass
        );
        if (superClassObject) {
            // Get superclass property descriptions:
            const superClassPropsDescriptions = getSTIXPropDescriptions(superClassObject);
            // Don't allow property description repeats and favor children
            // property descriptions.
            Object.keys(superClassPropsDescriptions).map(superClassPropName => {
                // Check if the list of child property descriptions includes
                // the parent property description:
                if(!Object.keys(propsDescriptions).includes(superClassPropName)) {
                    // If the child list does not include the parent property,
                    // add the parent property to the list of property description
                    // objects:
                    propsDescriptions[superClassPropName] = superClassPropsDescriptions[superClassPropName]
                }
            });
        }
    }
    return propsDescriptions;
}