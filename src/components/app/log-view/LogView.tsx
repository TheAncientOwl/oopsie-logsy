/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogView.tsx
 * @author Alexandru Delegeanu
 * @version 0.18
 * @description Display logs in table format
 */

import { For } from '@/components/ui/utils/For';
import { type TRootState } from '@/store';
import { type UUID } from '@/store/common/identifier';
import { type TFilterColors } from '@/store/filters/data';
import { invokeGetLogsChunk } from '@/store/logs/handlers';
import { Box, Table } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useRowsCache } from './hooks/useRowsCache';
import { useSyncTableWidths } from './hooks/useSyncTableWidths';
import { useVirtualization } from './hooks/useVirtualization';
import { LogRows } from './LogRows';

export const ITEM_HEIGHT = 45;
export const ITEMS_OVERSCAN = 15;
export const CHUNK_SIZE = 200;

const LogViewImpl = React.forwardRef<HTMLDivElement, TPropsFromRedux>((props, ref) => {
  const rowsCache = useRowsCache(props.logsChunk.totalLogs, props.invokeGetLogsChunk);
  const { setScrollTop, startIndex, renderedNodesCount, endIndex } = useVirtualization(
    props.logsChunk.totalLogs,
    ref
  );
  const { headerRef, bodyRef, syncWidthsDebounced } = useSyncTableWidths([
    props.tags,
    props.logsChunk,
    renderedNodesCount,
  ]);

  useEffect(() => rowsCache.update(props.logsChunk, startIndex), [props.logsChunk, startIndex]);

  useEffect(() => {
    const container = (ref as React.RefObject<HTMLDivElement>).current;
    if (container) {
      container.scrollTop = 0;
    }

    props.invokeGetLogsChunk(0, 200);

    rowsCache.clear();

    syncWidthsDebounced();
  }, [props.activeLogsChangedTime]);

  return (
    <Box
      ref={ref}
      overflow='scroll'
      width='100vw'
      onScroll={e => {
        setScrollTop(e.currentTarget.scrollTop);
        syncWidthsDebounced();

        rowsCache.fetchMissingLogsDebounced(startIndex, endIndex);
      }}
      position='relative'
    >
      <Box width='max-content'>
        <Table.Root position='sticky' top='0' zIndex={1}>
          <Table.Header
            ref={headerRef}
            position='sticky'
            top='0'
            zIndex={1}
            backgroundColor={props.theme.table.header.background}
          >
            <Table.Row
              color={props.theme.table.text}
              backgroundColor={props.theme.table.header.background}
              borderColor={props.theme.table.header.border}
            >
              <For each={props.tags}>
                {tag => (
                  <Table.ColumnHeader
                    minWidth='100px'
                    key={tag.id}
                    borderColor='inherit'
                    textAlign='left'
                    color='inherit'
                  >
                    {tag.name}
                  </Table.ColumnHeader>
                )}
              </For>
            </Table.Row>
          </Table.Header>
        </Table.Root>

        <Box width='100vw' height={`${props.logsChunk.totalLogs * ITEM_HEIGHT}px`}>
          <Table.Root transform={`translateY(${startIndex * ITEM_HEIGHT}px)`} width='100%'>
            <Table.Body ref={bodyRef}>
              <LogRows
                renderedNodesCount={renderedNodesCount}
                startIndex={startIndex}
                rowsCache={rowsCache}
                filterToColors={props.filterToColors}
                theme={props.theme}
                tags={props.tags}
              />
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </Box>
  );
});

// <redux>
const mapState = (state: TRootState) => ({
  theme: state.theme.themes[state.theme.activeThemeIndex].logView,
  tags: state.logRegexTags.tags.filter(tag => tag.displayed),
  logsChunk: state.logs.chunkData,
  filterToColors: new Map<UUID, TFilterColors>(
    state.filters.filters.map(filter => [filter.id, filter.colors])
  ),
  activeLogsChangedTime: state.logs.activeLogsChangedTime,
});

const mapDispatch = {
  invokeGetLogsChunk: invokeGetLogsChunk.dispatch,
};

const connector = connect(mapState, mapDispatch, null, { forwardRef: true });
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const LogView = connector(LogViewImpl);
// </redux>
