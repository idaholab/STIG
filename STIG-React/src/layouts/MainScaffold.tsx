import React, { useState } from 'react';
import ThemeContextComponent from '../contexts/ThemeContextComponent';
import Header from '../components/core/Header';
import Drawer from '../components/core/Drawer';
import StixPropsPanel from './StixPropsPanel';
import { useStigContext } from '@/contexts/StigContext';
import { StixPropsContextProvider } from '@/contexts/StixPropsContext';
import { ConnectedDBProvider } from '@/contexts/ConnectedDBContext';

type Props = { children: any };
const MainScaffold: React.FC<Props> = ({ children }) => {
  const { isPropertyPanelOpen, panelWidth, setPanelWidth } = useStigContext();
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const containerWidth = window.innerWidth;
      const newWidth = Math.max(300, containerWidth - e.clientX); // Calculate the new width based on the right edge of the panel
      setPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <ThemeContextComponent>
      <StixPropsContextProvider>
        <ConnectedDBProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex flex-1 h-full relative overflow-hidden">
              <Drawer />
              <main className={`flex-1 h-full overflow-hidden`}>
                {children}
              </main>

              {isPropertyPanelOpen && (
                <div
                  className={`dark:bg-neutralc-700 bg-neutralc-200 shadow-xl transition-transform duration-300 relative `}
                  style={{ width: panelWidth }}
                >
                  <StixPropsPanel />
                  {/* Handle */}
                  <div id='PropertyPanelHandle'
                    onMouseDown={handleMouseDown}
                    className="absolute left-0 top-0 h-full cursor-ew-resize flex items-center justify-center dark:bg-neutralc-700"
                    style={{ width: '8px', zIndex: 100 }}
                  >
                    <div className="w-1 h-8 bg-neutralc-500 dark:bg-neutralc-500 rounded-full hover:dark:bg-neutralc-400 hover:bg-neutralc-700"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ConnectedDBProvider>
      </StixPropsContextProvider>
    </ThemeContextComponent>
  )
}
export default MainScaffold;
