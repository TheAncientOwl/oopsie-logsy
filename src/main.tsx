/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file main.tsx
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description OopsieLogsy frontend entry point
 */

import { App } from '@/App';
import { DebugMenu } from '@/DebugMenu';
import ChakraThemeProvider from '@/components/app/theme';
import { useSwitch } from '@/hooks/useSwitch';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';

const DebugModeApp = () => {
  const [strictModeOn, toggleStrictMode] = useSwitch(false);

  return (
    <ReduxProvider store={store}>
      <ChakraThemeProvider>
        <DebugMenu strictModeOn={strictModeOn} onStrictModeToggle={toggleStrictMode} />
        {strictModeOn ? (
          <React.StrictMode>
            <App />
          </React.StrictMode>
        ) : (
          <App />
        )}
      </ChakraThemeProvider>
    </ReduxProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<DebugModeApp />);
