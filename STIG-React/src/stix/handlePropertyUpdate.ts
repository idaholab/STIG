import { StixObject } from "@/types/stixTypes/StixObject";

export const handlePropertyUpdate = (
  newVal: string | boolean | number | Date | ArrayBuffer | null | undefined | Object | [],
  propName: string,
  selectedSTIXObject: StixObject | undefined,
  setSelectedSTIXObject: React.Dispatch<React.SetStateAction<StixObject | undefined>>,
  cy?: cytoscape.Core,
  // Pass a prop index in for updating a value
  // inside a list or hash
  propIndex?: number | string,

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

    //set cytoscape label if property is the first populated label in the ordered list of labels
    if (cy !== undefined) {
      if (selectedSTIXObject) {
        const labelorder = ['name', 'description', 'value', 'labels', 'key', 'path', 'product', 'dst_port', 'command_line', 'type'];
        for (let i = 0; i < labelorder.length; i++) {
          let label = labelorder[i]
          if (selectedSTIXObject.hasOwnProperty(label)) {
            if (label == propName) {
              let ele = cy?.getElementById(selectedSTIXObject.id);
              ele?.style('label', newVal);
            }
            break;
          }
        }
      }
    }

    setSelectedSTIXObject(tempSelectedSTIXObject);
  }
};