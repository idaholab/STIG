import React from 'react';
import Dropdown from '../core/Dropdown';
import { useStigContext } from '@/contexts/StigContext';
import { useStixPropsContext } from '@/contexts/StixPropsContext';

const Edit: React.FC = () => {
  const { cyInstance } = useStigContext();
  const { setSelectionExists } = useStixPropsContext();

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

      <li className='hover:bg-primary hover:text-white'><a onClick={() => selectAll(cyInstance, setSelectionExists) }>Select All</a></li>
      <li className='hover:bg-primary hover:text-white'><a onClick={() => invertSelection(cyInstance, setSelectionExists) }>Invert Selection</a></li>

      {/* <div className="divider dark:divider-neutral my-0"></div> */}
      {/* <li className='hover:bg-primary hover:text-white'><a>Find</a></li>  */}
    </Dropdown>
  );
};

function selectAll(cy: cytoscape.Core | undefined, setSelectionExists: (v: boolean) => void) {
  if (cy !== undefined) {
    const all = cy.$('');
    all.select();
    setSelectionExists(all.length > 0);
  }
}
function invertSelection(cy: cytoscape.Core | undefined, setSelectionExists: (v: boolean) => void) {
  if (cy !== undefined) {
    const unselected = cy.$(':unselected');
    const selected = cy.$(':selected');
    selected.unselect();
    unselected.select();
    setSelectionExists(unselected.length > 0);
  }
}
export default Edit;
