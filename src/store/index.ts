/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description .
 */

import { thunk } from 'redux-thunk';
import { filtersTagsReducer } from './filters/reducer';
import { logRegexTagsReducer } from './log-regex-tags/reducer';

import { configureStore, Middleware } from '@reduxjs/toolkit';

const storeWatcher: Middleware = storeAPI => next => action => {
  console.traceX(storeWatcher.name, 'Dispatching:', action);
  console.verboseX(storeWatcher.name, 'Prev state:', storeAPI.getState());
  const result = next(action);
  console.verboseX(storeWatcher.name, 'Next state:', storeAPI.getState());
  return result;
};

export const store = configureStore({
  reducer: {
    logRegexTags: logRegexTagsReducer,
    filters: filtersTagsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk, storeWatcher),
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
