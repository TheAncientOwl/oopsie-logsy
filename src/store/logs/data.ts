/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Logs data.
 */

import { UUID } from '../common/identifier';
import { getStaticDefaultTags } from '../regex-tags/data';

// <types>
export type TColumnLogs = Array<Array<string>>;

export type TStoreState = {
  loading: boolean;
  logs: TColumnLogs;
  filterIDs: Array<UUID>;
};
// </types>

// <data>
export const defaultState: TStoreState = {
  loading: false,
  logs: getStaticDefaultTags()
    .filter(tag => tag.displayed)
    .map(() => []),
  filterIDs: [],
};
// </data>
