/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file oopsie.ts
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Wrapper over tauri's invoke for OopsieLogsy backend commands.
 */

import { TFilter, TFilterComponent, TFilterTab } from '@/store/filters/data';
import { TLogsChunk } from '@/store/logs/data';
import { TRegexTag } from '@/store/regex-tags/data';
import { invoke } from '@tauri-apps/api/core';

export const ipcInvokeImportLogs = (paths: string[]) => invoke<string>('import_logs', { paths });

export const ipcInvokeApplyRegexTags = (tags: TRegexTag[]) =>
  invoke<string>('apply_regex_tags', { tags });

export const ipcInvokeGetFilters = () =>
  invoke<[Array<TFilterTab>, Array<TFilter>, Array<TFilterComponent>]>('get_filters');

export const ipcInvokeGetLogsChunk = (begin: number, end: number) =>
  invoke<TLogsChunk>('get_logs_chunk', {
    desiredRange: { begin, end },
  });

export const ipcInvokeGetRegexTags = () => invoke<Array<TRegexTag>>('get_regex_tags');

export const ipcInvokeApplyFilters = (
  tabs: TFilterTab[],
  filters: TFilter[],
  components: TFilterComponent[]
) =>
  invoke<string>('apply_filters', {
    tabs,
    filters,
    components,
  });

export type TSearchResult = {
  hasPrev: boolean;
  hasNext: boolean;
  rowIndex: number | undefined;
  searchIndex: number | undefined;
  searchTotal: number | undefined;
};

export const ipcInvokeApplySearch = (alternative: string, pattern: string) =>
  invoke<TSearchResult>('search_apply', {
    alternative,
    pattern,
  });

export const ipcInvokeNextSearch = () => invoke<TSearchResult>('search_next');

export const ipcInvokePrevSearch = () => invoke<TSearchResult>('search_prev');

export type TActiveDataResult = {
  result: TSearchResult;
  alternativeId: string;
  pattern: string;
};

export const ipcInvokeGetSearchActiveData = () =>
  invoke<TActiveDataResult>('search_get_active_data');
