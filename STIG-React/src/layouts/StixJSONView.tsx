import React, { useEffect, useState } from 'react';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import { SchemaSTIXProperty } from '@/types/stixSchemaTypes/SchemaSTIXProperty';
import { useStigContext } from '@/contexts/StigContext';
import { getNodeLabel } from '@/stix/stix';

type Props = {
  stixTypeProps?: SchemaSTIXProperty[],
  rows?: number;
};

const StixJSONView: React.FC<Props> = ({
  stixTypeProps,
  rows
}) => {
  const { selectedSTIXObject, setSelectedSTIXObject, setSelectionExists } = useStixPropsContext();
  const { cyInstance } = useStigContext();

  const [jsonText, setJsonText] = useState<string>('');
  const [jsonValid, setJsonValid] = useState(true);
  const [jsonErrorText, setJsonErrorText] = useState("");
  const [stixPropNamesValid, setStixPropNamesValid] = useState(stixTypeProps ? true : undefined);
  const [invalidPropNames, setInvalidPropNames] = useState<string[]>([]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonText(value);
    try {
      const parsedJson = JSON.parse(value);
      setJsonValid(true);
      setJsonErrorText("");
      // If the JSON passes, check that the object's keys are 
      // all valid for the STIX type.
      const stixTypePropNames = stixTypeProps?.map(prop => prop.name);
      const invalidKeys = Object.keys(parsedJson).filter(jsonKey => 
        !stixTypePropNames?.includes(jsonKey)
      );
      setInvalidPropNames(invalidKeys);
      if (invalidKeys.length && stixTypeProps) {
        setStixPropNamesValid(false);
      } else {
        if (stixTypeProps) {
          setStixPropNamesValid(true);
        }
        // Only set the STIX object if the changes are more substantial than just
        // whitespace changes
        if (value.replace(/\s/g, "") !== JSON.stringify(selectedSTIXObject)) {
          setSelectedSTIXObject(parsedJson);
          setSelectionExists(true);
          // Reset cytoscape label in case the user
          // changed any properties that affect the label
          let ele = cyInstance?.getElementById(parsedJson.id.replace("relationship--", ""));
          if (ele?.length === 0) {
            ele = cyInstance?.getElementById(parsedJson.id);
          }
          let objLabel = ele?.style('label');
          if (Object.keys(parsedJson).includes("relationship_type")) {
            objLabel = parsedJson.relationship_type;
          } else {
            objLabel = getNodeLabel(parsedJson);
          }
          ele?.style('label', objLabel);
        }
      }
    } catch (error) {
      setJsonValid(false);
      setJsonErrorText(String(error));
    }
  };

  useEffect(() => {
    const selectedSTIXObjectJSONString = { ...selectedSTIXObject };
    setJsonText(JSON.stringify(selectedSTIXObjectJSONString, null, 2));
    setJsonValid(true);
    setStixPropNamesValid(stixTypeProps ? true : undefined);
  }, [selectedSTIXObject]);

  return (
    <>
      <div className='form-stix-json flex flex-auto'>
        <textarea
          rows={rows}
          className="jsonEditor flex flex-grow p-2 scrollbar h-full w-full rounded bg-neutralc-100 dark:bg-neutralc-900"
          onChange={handleJsonChange}
          value={jsonText}
        />
      </div>
      {jsonValid ?
        <>
          <div className='flex gap-1 mt-1'>
            <span className="material-icons">
              check_circle
            </span>
            <p>JSON Valid</p>
          </div>
          {
            stixPropNamesValid ?
              <>
                <div className='flex gap-1 mt-1'>
                  <span className="material-icons">
                    check_circle
                  </span>
                  <p>STIX Property Names Valid</p>
                </div>
                <p>STIX Object Saved</p>
              </>
            : stixPropNamesValid !== undefined ?
              <>
                <div className='flex gap-1 mt-1'>
                  <span className="material-icons">
                    error
                  </span>
                  <p>
                    STIX Property Names Invalid. The following property names are not valid for the
                    current STIX object:&nbsp;
                    { invalidPropNames.map((name, i) =>
                      `"${name}"${i !== invalidPropNames.length-1 ? ", " : ""}`
                    )}
                  </p> 
                </div>
                <p>STIX Object Not Saved</p>
              </>
            : <p>STIX Object Saved</p>
          }
        </>
        : 
        <>
          <div className='flex gap-1 mt-1'>
            <span className="material-icons">
              error
            </span>
            <p>JSON Invalid. STIX object not saved.</p>
          </div>
          <p>JSON Error: {jsonErrorText}</p>
        </>
      }
    </>
  );
}

export default StixJSONView;
