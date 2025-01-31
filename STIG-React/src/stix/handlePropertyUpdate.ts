import { StixObject } from '@/types/stixTypes/StixObject';
import { getNodeLabel } from './stix';

export const handlePropertyUpdate = (
  newVal: string | boolean | number | Date | ArrayBuffer | null | undefined | unknown | [],
  propName: string,
  selectedSTIXObject: StixObject | undefined,
  setSelectedSTIXObject: (obj: StixObject | undefined) => void,
  setSelectionExists: React.Dispatch<React.SetStateAction<boolean>>,
  cy?: cytoscape.Core,
  // Pass a prop index in for updating a value
  // inside a list or hash
  propIndex?: number | string,
) => {
  const tempSelectedSTIXObject = { ...selectedSTIXObject } as StixObject;
  if (propIndex !== undefined) {
    // If the object being indexed does not already
    // exist, initialize it
    if (selectedSTIXObject && !selectedSTIXObject[propName]) {
      tempSelectedSTIXObject[propName] = {};
    }
    tempSelectedSTIXObject[propName][propIndex] = newVal;
  } else {
    tempSelectedSTIXObject[propName] = newVal;
  }

  // Set cytoscape label
  if (cy !== undefined && selectedSTIXObject) {
    const nodelabel = getNodeLabel(tempSelectedSTIXObject);
    const ele = cy?.getElementById(selectedSTIXObject.id);
    ele?.style('label', nodelabel);
  }

  setSelectedSTIXObject(tempSelectedSTIXObject);
  setSelectionExists(true);
};
