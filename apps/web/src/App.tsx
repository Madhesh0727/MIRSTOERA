import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index';
import { SettingsProvider } from './context/SettingsContext';

export const App: React.FC = () => {
  return (
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  );
};

export default App;
