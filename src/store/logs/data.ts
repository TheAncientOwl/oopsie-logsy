/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.6
 * @description Logs data.
 */

// <types>
// format: FilterUUID, field-1, field-2, ..., field-n
export type TLogRow = Array<string>;

export type TLogsChunk = {
  data: Array<TLogRow>;
  totalLogs: number;
};

export type TStoreState = {
  loading: boolean;
  chunkData: TLogsChunk;
  requested_chunk: boolean;
  chunk: {
    begin: number;
    end: number;
  };
  activeLogsChangedTime: string;
};
// </types>

// <data>
export const LOG_VIEW_CHUNK_SIZE = 200;

export const defaultState: TStoreState = {
  loading: false,
  chunkData: {
    data: [],
    totalLogs: 0,
  },
  requested_chunk: false,
  chunk: {
    begin: 0,
    end: 200,
  },
  activeLogsChangedTime: '',
};
// </data>
