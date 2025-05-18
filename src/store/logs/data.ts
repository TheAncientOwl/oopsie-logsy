/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Logs data.
 */

// <types>
export type TStoreState = {
  loading: boolean;
};
// </types>

// <data>
export const defaultState: TStoreState = {
  loading: false,
};
// </data>
