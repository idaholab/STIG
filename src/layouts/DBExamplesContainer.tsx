import React from 'react';
import ExampleQueryListContainer from './ExampleQueryListContainer';
import ConnectedProfilePanelLayout from './ConnectedProfilePanelLayout';

const DBExamplesContainer: React.FC = () => {
  return (
    <div className="dbOperationsContainer flex flex-col h-fit w-full px-4 py-2 mb-4">
      {/* Connected Profile */}
      <ConnectedProfilePanelLayout />
      <ExampleQueryListContainer></ExampleQueryListContainer>
    </div>
  );
};
export default DBExamplesContainer;
