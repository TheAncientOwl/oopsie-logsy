/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file actions.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Theme action types.
 */

import { Dispatch as ReduxDispatch, UnknownAction } from '@reduxjs/toolkit';
import { TSetThemeNameAction } from './handlers/setThemeName';

export enum EActionType {
  SetThemeName = 'Theme__SetName',
  SetActiveThemeIndex = 'Theme__SetActiveThemeIndex',
}

export type TDispatchTypes = UnknownAction | TSetThemeNameAction;

export type TDispatch = ReduxDispatch<TDispatchTypes>;
