/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file useRowsCache.ts
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description Cache rows by index. Row format: [index, filter-id, field-1, field-2, ..., field-n]
 */

import { TLogRow, TLogsChunk } from '@/store/logs/data';
import { useCallback, useRef, useState } from 'react';
import { ITEMS_OVERSCAN } from '../LogView';
import { useDebounce } from '@/hooks/useDebounce';
import { EScrollDirection } from './useVirtualization';

export const CHUNK_SIZE = 200;

const getMinKey = <T>(map: Map<number, T>): number | undefined => {
  let minKey = Infinity;

  for (const key of map.keys()) {
    if (key < minKey) {
      minKey = key;
    }
  }

  return minKey === Infinity ? undefined : minKey;
};

const getMaxKey = <T>(map: Map<number, T>): number | undefined => {
  let maxKey = -Infinity;

  for (const key of map.keys()) {
    if (key > maxKey) {
      maxKey = key;
    }
  }

  return maxKey === -Infinity ? undefined : maxKey;
};

// TODO: remove no longer needed logs, since with current impl we will reach to have every log in memory
export const useRowsCache = (
  totalLogs: number,
  invokeGetLogsChunk: (begin: number, end: number) => Promise<void>,
  scrollDirection: EScrollDirection,
  startIndex: number,
  endIndex: number
) => {
  const [cache, setCache] = useState({ data: new Map<number, TLogRow>() });
  const prevMetadata = useRef<{
    logsChunk: TLogsChunk | null;
    startIndex: number | null;
  }>({
    logsChunk: null,
    startIndex: null,
  });

  const update = (currentLogsChunk: TLogsChunk, currentStartIndex: number) => {
    const prev = prevMetadata.current;
    const logsChunkChanged = prev.logsChunk !== null && prev.logsChunk !== currentLogsChunk;
    const startIndexChanged = prev.startIndex !== null && prev.startIndex !== currentStartIndex;

    if (logsChunkChanged || (logsChunkChanged && startIndexChanged)) {
      console.trace(useRowsCache, 'Updating rows cache', {
        newChunk: currentLogsChunk,
        startIndex: currentStartIndex,
        rowsCache: cache.data,
      });

      for (let idx = 0; idx < currentLogsChunk.data.length; ++idx) {
        const row = currentLogsChunk.data[idx];
        cache.data.set(Number(row[0]), row);
      }

      switch (scrollDirection) {
        case EScrollDirection.Down: {
          const firstItem = getMinKey(cache.data);
          if (firstItem === undefined) {
            break;
          }

          const lastNotVisibleOnTop = Math.max(firstItem, startIndex - ITEMS_OVERSCAN * 2);
          if (firstItem > lastNotVisibleOnTop) {
            break;
          }

          for (let idx = firstItem; idx < lastNotVisibleOnTop; ++idx) {
            cache.data.delete(idx);
          }

          break;
        }
        case EScrollDirection.Up: {
          const lastItem = getMaxKey(cache.data);
          if (lastItem === undefined) {
            break;
          }

          const lastNotVisibleOnBottom = Math.min(lastItem, endIndex + ITEMS_OVERSCAN * 2);
          console.log(`Last not visible: ${lastNotVisibleOnBottom}`);
          if (lastNotVisibleOnBottom > lastItem) {
            break;
          }

          for (let idx = lastNotVisibleOnBottom; idx < lastItem; ++idx) {
            cache.data.delete(idx);
          }

          break;
        }
      }

      console.trace(useRowsCache, 'Rows cache', { rowsCache: cache.data });
    }

    prevMetadata.current = {
      logsChunk: currentLogsChunk,
      startIndex: currentStartIndex,
    };
  };

  const clear = useCallback(() => {
    cache.data.clear();
    setCache(prev => ({ ...prev }));

    console.trace(useRowsCache, 'Cleared rows cache');
  }, []);

  const totalLogsRef = useRef(0);
  totalLogsRef.current = totalLogs;

  const fetchMissingLogs = (startIndex: number, endIndex: number) => {
    let chunkBegin: null | number = null;

    for (let idx = startIndex; idx < endIndex + ITEMS_OVERSCAN; idx++) {
      if (!cache.data.has(idx)) {
        chunkBegin = idx;
        break;
      }
    }

    if (chunkBegin === null) return;

    const chunkEnd = Math.min(totalLogsRef.current, chunkBegin + CHUNK_SIZE + ITEMS_OVERSCAN);

    console.trace(useCallback, 'Fetching logs', { chunkBegin, chunkEnd });

    invokeGetLogsChunk(chunkBegin, chunkEnd);
  };

  const fetchMissingLogsDebounced = useDebounce(fetchMissingLogs, 100);

  return { data: cache.data, update, clear, fetchMissingLogsDebounced };
};
