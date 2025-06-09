/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file data.ts
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description Logs data.
 */

import { UUID } from '../common/identifier';
import { getStaticDefaultTags } from '../regex-tags/data';

// <types>
export type TColumnLogs = Array<Array<string>>;

export type TColumnLogsChunk = {
  logs: TColumnLogs;
  filterIds: Array<UUID>;
  totalLogs: number;
};

export type TStoreState = {
  loading: boolean;
  chunkData: TColumnLogsChunk;
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
    logs: getStaticDefaultTags()
      .filter(tag => tag.displayed)
      .map(() => []),
    totalLogs: 0,
    filterIds: [],
  },
  requested_chunk: false,
  chunk: {
    begin: 0,
    end: 200,
  },
  activeLogsChangedTime: '',
};
// </data>
