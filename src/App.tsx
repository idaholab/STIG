import React from 'react';
import MainScaffold from '../src/layouts/MainScaffold'
import { EventProvider } from './contexts/EventContext';

type Props = {
  children: any;
}

const App: React.FC<Props> = ({ children }) => {
  return (
    <div className="App h-screen">
      <EventProvider>
        <MainScaffold>{children}</MainScaffold>
      </EventProvider>
    </div>
  );
}

export default App;
