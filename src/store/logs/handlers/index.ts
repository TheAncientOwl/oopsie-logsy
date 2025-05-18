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

import { invokeSetCurrentLogPaths } from './invokeSetCurrentLogPaths';
import { loading } from './loading';

const basicHandlers = [loading];

const apiCallHandlers = [invokeSetCurrentLogPaths];

export { basicHandlers, apiCallHandlers, invokeSetCurrentLogPaths, loading };
