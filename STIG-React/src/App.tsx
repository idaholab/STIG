import React from 'react';
import MainScaffold from '../src/layouts/MainScaffold'

type Props = {
  children: any;
}

const App: React.FC<Props> = ({children}) => {
  return (
    <div className="App h-screen">
      <MainScaffold>{children}</MainScaffold>
    </div>
  );
}

export default App;
