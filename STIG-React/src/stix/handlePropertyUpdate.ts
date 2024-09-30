import { StixObject } from "@/types/stixTypes/StixObject";

export const handlePropertyUpdate = (
  newVal: string | boolean | number | Date | ArrayBuffer | null | undefined | Object | [],
  propName: string,
  selectedSTIXObject: StixObject | undefined,
  setSelectedSTIXObject: React.Dispatch<React.SetStateAction<StixObject | undefined>>
) => {
  const tempSelectedSTIXObject = { ...selectedSTIXObject } as StixObject;
  if (tempSelectedSTIXObject) {
    tempSelectedSTIXObject[propName] = newVal;
  }
  setSelectedSTIXObject(tempSelectedSTIXObject);
};