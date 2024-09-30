import { stencilItems } from "@/components/elements/StencilItems";

// Per the STIX specs:
// "All identifiers...MUST follow the form object-type--UUID, 
// where object-type is the exact value (all type names are lowercase strings, by definition) 
// from the type property of the object being identified or referenced 
// and where the UUID MUST be an RFC 4122-compliant UUID"
export function stixIdentifierValidator(identifier: string) {
  // Empty/blank ids are fine:
  if(!identifier) {
    return true;
  }
  // Check that identifier can be split into two parts, separated by "--":
  const idParts = identifier.split("--");
  if(idParts.length !== 2) {
    return false;
  }
  // Check that identifier starts with "object-type":
  if(!(stencilItems.find(stencilItem => 
    stencilItem.id === idParts[0]) ||
    idParts[0] === "relationship")
  ) {
    return false;
  }
  // Check that identifier ends with an RFC 4122-compliant UUID:
  if (idParts[1].match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
    return true;
  } else {
    return false;
  }
}