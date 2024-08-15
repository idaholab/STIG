import React, { useState } from 'react';
import ThemeContextComponent from '../contexts/ThemeContextComponent';
import Header from '../components/core/Header';
import Drawer from '../components/core/Drawer';
import StixPropsPanel from '@/components/core/StixPropsPanel';
import { useStixPropsContext } from '@/contexts/StixPropsContext';

type Props = { children: any };
const MainScaffold: React.FC<Props> = ({ children }) => {
  const { isDrawerOpen } = useStixPropsContext();
  const [panelWidth, setPanelWidth] = useState(480); // Default width in pixels
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
    <>
      <ThemeContextComponent>
        <div className="flex flex-col h-screen overflow-hidden">
          <Header />
          <div className="flex flex-1 h-full relative overflow-hidden">
            <Drawer />
            <main className={`flex-1 h-full overflow-hidden`}>
              {children}
            </main>

            {isDrawerOpen && (
              <div
                className={`dark:bg-gray-700 bg-gray-200 h-full shadow-xl transition-transform duration-300 relative `}
                style={{ width: panelWidth }}
              >
                <StixPropsPanel />
                {/* Handle */}
                <div
                  onMouseDown={handleMouseDown}
                  className="absolute left-0 top-0 h-full cursor-ew-resize flex items-center justify-center dark:bg-gray-700"
                  style={{ width: '8px', zIndex: 100 }}
                >
                  <div className="w-1 h-8 bg-gray-500 dark:bg-gray-500 rounded-full hover:dark:bg-gray-400 hover:bg-gray-700"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ThemeContextComponent>
    </>
  );
}
export default MainScaffold;
