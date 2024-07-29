import React, { useState } from 'react';
import ThemeContextComponent from '../contexts/ThemeContextComponent';

// Custom Components
import Header from '../components/core/Header';
import Drawer from '../components/core/Drawer';
import StixPropsPanel from '@/components/core/StixPropsPanel';

type Props = { children: any };

const MainScaffold: React.FC<Props> = ({ children }) => {

  return (
    <>
      <ThemeContextComponent>
        <div className="flex flex-col h-screen overflow-hidden">
          <Header />

          <div className="flex flex-1 h-full pb-8 relative">
            {<Drawer />}

            <main className="mb-8 flex-1 transition-all ml-18 h-full">
              {children}
            </main>
            <StixPropsPanel>

            </StixPropsPanel>
          </div>
        </div>
      </ThemeContextComponent>
    </>
  );
}

export default MainScaffold;
