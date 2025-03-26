/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file main.tsx
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description OopsieLogsy frontend entry point
 */

import { App } from '@/App';
import { DebugMenu } from '@/DebugMenu';
import ThemeProvider from '@/components/app/theme';
import { useSwitch } from '@/hooks/useSwitch';
import React from 'react';
import ReactDOM from 'react-dom/client';

const DebugModeApp = () => {
  const [strictModeOn, toggleStrictMode] = useSwitch(false);

  return (
    <ThemeProvider>
      <DebugMenu strictModeOn={strictModeOn} onStrictModeToggle={toggleStrictMode} />
      {strictModeOn ? (
        <React.StrictMode>
          <App />
        </React.StrictMode>
      ) : (
        <App />
      )}
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<DebugModeApp />);
