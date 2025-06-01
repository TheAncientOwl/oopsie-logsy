/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description Logs data.
 */

import { UUID } from '../common/identifier';
import { getStaticDefaultTags } from '../regex-tags/data';

// <types>
export type TColumnLogs = Array<Array<string>>;
export type TColumnLogsView = {
  logs: TColumnLogs;
  totalLogs: number;
};

export type TStoreState = {
  loading: boolean;
  logs: TColumnLogs;
  filterIDs: Array<UUID>;
  totalLogs: number;
};
// </types>

// <data>
export const defaultState: TStoreState = {
  loading: false,
  logs: getStaticDefaultTags()
    .filter(tag => tag.displayed)
    .map(() => []),
  filterIDs: [],
  totalLogs: 0,
};
// </data>
