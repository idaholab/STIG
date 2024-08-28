import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css';

import PageMainLanding from './pages/PageMainLanding'

import 'material-icons';
import 'material-symbols';
import "@fontsource/source-sans-pro/400.css"; // Specify weight
import "@fontsource/source-sans-pro/400-italic.css"; // Specify weight and style
import "@fontsource/source-sans-pro/600.css"; // Specify weight
import "@fontsource/source-sans-pro/700.css"; // Specify weight
import "@fontsource/source-sans-pro/900.css"; // Specify weight

// Import Store
import { store } from '../app/store/index';
import { StigContextProvider } from './contexts/StigContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/stig">
        <StigContextProvider>
          <App>
            <Routes>
              <Route path="/" element={<PageMainLanding />} />
            </Routes>
          </App>
        </StigContextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
