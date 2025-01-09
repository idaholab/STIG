import React from 'react';
import Dropdown from '../core/Dropdown';
import { useStigContext } from '@/contexts/StigContext';
import { useStixPropsContext } from '@/contexts/StixPropsContext';
import Icon from '@mdi/react';
import { mdiContentCopy, mdiContentCut, mdiContentPaste, mdiLayersSearchOutline, mdiSelectAll, mdiSelectInverse } from '@mdi/js';

const Edit: React.FC = () => {
  const { cyInstance } = useStigContext();
  const { setSelectionExists } = useStixPropsContext();
  const { isSearchOpen, setIsSearchOpen, isDrawerOpen, drawerWidth } = useStigContext();

  return (
    <Dropdown
      title="Edit"
      includeDropdownArrow
      additionalOptionClasses={'hover:text-black hover:text-white dark:hover:bg-primary hover:bg-primary w-[160px]'}
    >
      {/* <li className='hover:bg-primary hover:text-white'><a>Undo</a></li> */}
      {/* <li className='hover:bg-primary hover:text-white'><a>Redo</a></li> */}
      {/* <div className="divider dark:divider-neutral my-0"></div> */}

      <li className='hover:bg-primary hover:text-white'><a><Icon path={mdiContentCut} size={.8} /><span>Cut</span></a></li>
      <li className='hover:bg-primary hover:text-white'><a><Icon path={mdiContentCopy} size={.8} /><span>Copy</span></a></li>
      <li className='hover:bg-primary hover:text-white'><a><Icon path={mdiContentPaste} size={.8} /><span>Paste</span></a></li>
      <div className="border-t border-neutralc-300 dark:border-neutralc-700 my-0" />
      <li className='hover:bg-primary hover:text-white'><a onClick={() => selectAll(cyInstance, setSelectionExists)}><Icon path={mdiSelectAll} size={.8} /><span>Select All</span></a></li>
      <li className='hover:bg-primary hover:text-white'><a onClick={() => invertSelection(cyInstance, setSelectionExists)}><Icon path={mdiSelectInverse} size={.8} /><span>Invert Selection</span></a></li>

      <div className="border-t border-neutralc-300 dark:border-neutralc-700 my-0" />
      <li className={`hover:bg-primary hover:text-white ${isSearchOpen ? 'pointer-events-none text-neutralc-500' : ''}`}>
        <a onClick={() => !isSearchOpen && toggleSearchVisibility(isSearchOpen, setIsSearchOpen)}>
          <Icon path={mdiLayersSearchOutline} size={.8} /><span>Find</span>
        </a>
      </li>
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

function cutSelected(cy: cytoscape.Core | undefined, setSelectionExists: (v: boolean) => void) {
  if (cy !== undefined) {
    const selected = cy.$(':selected');


  }
}

function toggleSearchVisibility(isSearchOpen: boolean, setIsSearchOpen: (v: boolean) => void) {
  setIsSearchOpen(true);
}
export default Edit;
