/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description .
 */

import { thunk } from 'redux-thunk';
import { logRegexTagsReducer } from './log-regex-tags/reducer';

import { configureStore } from '@reduxjs/toolkit';
import { filtersTagsReducer } from './filters/reducer';

export const store = configureStore({
  reducer: {
    logRegexTags: logRegexTagsReducer,
    filters: filtersTagsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
