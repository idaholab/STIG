import { StixObject } from "@/types/stixTypes/StixObject";

export const handlePropertyUpdate = (
  newVal: string | boolean | number | Date | ArrayBuffer | null | undefined | Object | [],
  propName: string,
  selectedSTIXObject: StixObject | undefined,
  setSelectedSTIXObject: React.Dispatch<React.SetStateAction<StixObject | undefined>>,
  // Pass a prop index in for updating a value
  // inside a list or hash
  propIndex?: number | string
) => {
  if (selectedSTIXObject) {
    const tempSelectedSTIXObject = { ...selectedSTIXObject };
    if (propIndex !== undefined) {
      // If the object being indexed does not already
      // exist, initialize it
      if (!selectedSTIXObject[propName]) {
        tempSelectedSTIXObject[propName] = {};
      }
      tempSelectedSTIXObject[propName][propIndex] = newVal;
    } else {
      tempSelectedSTIXObject[propName] = newVal;
    }
    setSelectedSTIXObject(tempSelectedSTIXObject);
  }
};