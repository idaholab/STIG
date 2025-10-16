import { StixObject } from "@/types/stixTypes/StixObject";

export function handleHashNameUpdate(
  newHashName: string,
  oldHashName: string,
  propName: string,
  selectedSTIXObject: StixObject | undefined,
  setSelectedSTIXObject: (obj?: StixObject) => void,
) {
  // Hash Algorithm Name Update is done as follows
  // to preserve the order of hashes
  if (selectedSTIXObject) {
    const tempSelectedSTIXObj = { ...selectedSTIXObject };
    // Remove the hashes property
    delete tempSelectedSTIXObj[propName];
    // Reset the hashes property to an empty object
    tempSelectedSTIXObj[propName] = {};
    // Re-create the hashes property in order, replacing
    // the changed hash name with the selected value
    Object.keys(selectedSTIXObject[propName]).map(tempHashAlgName => {
      if (tempHashAlgName !== oldHashName) {
        tempSelectedSTIXObj[propName][tempHashAlgName] = selectedSTIXObject[propName][tempHashAlgName];
      } else {
        tempSelectedSTIXObj[propName][newHashName] = selectedSTIXObject[propName][tempHashAlgName];
      }
    });
    setSelectedSTIXObject(tempSelectedSTIXObj);
  }
}