/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file main.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description OopsieLogsy frontend entry point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
