import * as React from 'react';
import Graph from '@/graph/CytoGraph';
import Menu from '@/components/core/Menu';
import Notifications from '@/components/core/Notifications';
import { useStigContext } from '@/contexts/StigContext';
import Search from '@/components/elements/Search';
import { useEffect } from 'react';

type Props = object;
const PageMainLanding: React.FC<Props> = () => {
  const { isSearchOpen, setIsSearchOpen, isDrawerOpen, drawerWidth } = useStigContext();
  const floatingContainerWidth = `calc(100% - (${isDrawerOpen ? drawerWidth : 80}px ))`;
  const floatingContainerLeft = `${isDrawerOpen ? drawerWidth : 80}px`;

  const [showSearch, setShowSearch] = React.useState(isSearchOpen);

  useEffect(() => {
    if (isSearchOpen) {
      setShowSearch(true);
    } else {
      const timer = setTimeout(() => setShowSearch(false), 700); // Match duration-300
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  return (
    <div className="page-component">
      <div id="graphContainer" className="relative h-full w-full ">

        <div id="floatingContainer"
          className='flex relative'
          style={{
            width: floatingContainerWidth,
            marginLeft: floatingContainerLeft
          }}>
          <div className='relative flex m-4 justify-between flex-wrap w-full z-[10]'>
            <Menu />
            {/* Fade In */}
            <div className={`transition-opacity duration-700 ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}>
              {showSearch && <Search />}
            </div>
          </div>
        </div>

        <div id="graph" className="h-full w-full absolute top-0">
          <Graph />
        </div>
        <Notifications />
      </div>
    </div >
  )
}
export default PageMainLanding;


