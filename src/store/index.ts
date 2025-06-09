/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description Store index file.
 */

import { thunk } from 'redux-thunk';
import { filtersTagsReducer } from './filters/reducer';
import { logRegexTagsReducer } from './regex-tags/reducer';
import { themeReducer } from './theme/reducer';

import { configureStore, Middleware } from '@reduxjs/toolkit';
import { logsReducer } from './logs/reducer';

const storeWatcher: Middleware = storeAPI => next => action => {
  console.redux(storeWatcher, 'Dispatching:', action);
  console.redux(storeWatcher, 'Prev state:', storeAPI.getState());
  const result = next(action);
  console.redux(storeWatcher, 'Next state:', storeAPI.getState());
  return result;
};

export const store = configureStore({
  reducer: {
    logRegexTags: logRegexTagsReducer,
    filters: filtersTagsReducer,
    theme: themeReducer,
    logs: logsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk, storeWatcher),
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
