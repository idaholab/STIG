import React from 'react';
import Dropdown from '../core/Dropdown';
import { useStigContext } from '@/contexts/StigContext';
import { view_utils_options } from '@/graph/graphOptions';
import { CollectionReturnValue, EdgeCollection, NodeCollection } from 'cytoscape';
import { StixObject } from '@/types/stixTypes/StixObject';
import { useStixPropsContext } from '@/contexts/StixPropsContext';

const Edit: React.FC = () => {
  const { cyInstance, isPropertyPanelOpen, togglePropertyPanel } = useStigContext();
  const { selectedSTIXObject, setSelectedSTIXObject } = useStixPropsContext();

  return (
    <Dropdown
      title="Edit"
      includeDropdownArrow
      additionalOptionClasses={'hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary w-[130px]'}
    >
      {/* <li className='hover:bg-primary hover:text-white'><a>Undo</a></li> */}
      {/* <li className='hover:bg-primary hover:text-white'><a>Redo</a></li> */}
      {/* <div className="divider dark:divider-neutral my-0"></div> */}

      {/* <li className='hover:bg-primary hover:text-white'><a>Cut</a></li> */}
      {/* <li className='hover:bg-primary hover:text-white'><a>Copy</a></li> */}
      {/* <li className='hover:bg-primary hover:text-white'><a>Paste</a></li> */}
      {/* <div className="divider dark:divider-neutral my-0"></div> */}

      <li className='hover:bg-primary hover:text-white'><a onClick={() => { selectAll(cyInstance) }}>Select All</a></li>
      <li className='hover:bg-primary hover:text-white'><a onClick={() => { invertSelection(cyInstance) }}>Invert Selection</a></li>
  

      

      {/* <div className="divider dark:divider-neutral my-0"></div> */}
      {/* <li className='hover:bg-primary hover:text-white'><a>Find</a></li>  */}
    </Dropdown>
  );
};

function selectAll(cy: cytoscape.Core | undefined) {
  if (cy !== undefined) {
    cy.$('').select();
  }
}
function invertSelection(cy: cytoscape.Core | undefined) {
  if (cy !== undefined) {
    const unselected = cy.$(':unselected');
    const selected = cy.$(':selected');
    selected.unselect();
    unselected.select();
  }
}
export default Edit;
