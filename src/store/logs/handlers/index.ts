/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file index.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Handlers index file.
 */

import { invokeGetLogsChunk } from './invokeGetLogsChunk';
import { invokeImportLogs } from './invokeImportLogs';
import { loading } from './loading';

const basicHandlers = [loading];

const apiCallHandlers = [invokeImportLogs, invokeGetLogsChunk];

export { apiCallHandlers, basicHandlers, invokeGetLogsChunk, invokeImportLogs, loading };
