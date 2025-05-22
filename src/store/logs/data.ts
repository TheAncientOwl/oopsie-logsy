/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Logs data.
 */

import { UUID } from '../common/identifier';

// <types>
export type TStoreState = {
  loading: boolean;
  logs: Array<JSON>;
  filterIDs: UUID[];
};
// </types>

// <data>
export const defaultState: TStoreState = {
  loading: false,
  logs: [],
  filterIDs: [],
};
// </data>
