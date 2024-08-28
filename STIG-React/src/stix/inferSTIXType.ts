import { SchemaType } from "@/types/SchemaType";

export function inferSTIXType(stixProperty: Object): SchemaType {
  // TODO: Should DateTime be allowed? Binary?
  switch (typeof stixProperty) {
    case "string":
      return "String";
    case "boolean":
      return "Boolean";
    case "number":
      if (Number.isInteger(stixProperty)) {
        return "Integer";
      } else {
        return "Float";
      }
    case "object":
      if (Array.isArray(stixProperty)) {
        return "EmbeddedList";
      } else {
        return "EmbeddedMap";
      }
  }
}