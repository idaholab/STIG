import * as React from 'react';

import Graph from '@/graph/CytoGraph';
import Menu from '@/components/core/Menu';
import Notifications from '@/components/core/Notifications';

type Props = object;

const PageMainLanding: React.FC<Props> = () => <div className="page-component">
  <div id="graphContainer" className="relative h-full w-full overflow-hidden">
    <Menu />
    <div id="graph" className="h-full w-full" style={{ position: "absolute", top: 0 }}>
      <Graph />
    </div>
    <Notifications />
  </div>
</div>;

export default PageMainLanding;
