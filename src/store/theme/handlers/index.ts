/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Handlers index file.
 */

import { NoApiCallHandlers } from '@/store/common/reducer';
import { setActiveThemeIndex } from './setActiveThemeIndex';
import { setThemeName } from './setThemeName';

const basicHandlers = [setThemeName, setActiveThemeIndex];

const apiCallHandlers = NoApiCallHandlers;

export { apiCallHandlers, basicHandlers, setActiveThemeIndex, setThemeName };
