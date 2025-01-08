import * as React from 'react';
import Graph from '@/graph/CytoGraph';
import Menu from '@/components/core/Menu';
import Notifications from '@/components/core/Notifications';
import Search from '@/components/elements/search';
import { useStigContext } from '@/contexts/StigContext';

type Props = object;
const PageMainLanding: React.FC<Props> = () => {
  const { isPropertyPanelOpen, panelWidth, isDrawerOpen, drawerWidth } = useStigContext();
  const floatingContainerWidth = `calc(100% - (${isDrawerOpen ? drawerWidth : 80}px ))`;
  const floatingContainerLeft = `${isDrawerOpen ? drawerWidth : 80}px`;

  return (
    <div className="page-component">
      <div id="graphContainer" className="relative h-full w-full overflow-hidden">
        <div id="floatingContainer"
          className='flex relative z-[1]'
          style={{
            width: floatingContainerWidth,
            marginLeft: floatingContainerLeft
          }}>
          <div className='flex m-4 justify-between flex-wrap w-full'>
            <Menu />
            <Search data={[]} filterOptions={[]} onFilter={() => { }} />
          </div>
        </div>

        <div id="graph" className="h-full w-full absolute top-0">
          <Graph />
        </div>
        <Notifications />
      </div>
    </div>
  )
}
export default PageMainLanding;


