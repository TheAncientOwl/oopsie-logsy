/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogView.tsx
 * @author Alexandru Delegeanu
 * @version 0.15
 * @description Display logs in table format
 */

import { For } from '@/components/ui/utils/For';
import { useDebounce } from '@/hooks/useDebounce';
import { type TRootState } from '@/store';
import { type UUID } from '@/store/common/identifier';
import { type TFilterColors } from '@/store/filters/data';
import { TLogRow } from '@/store/logs/data';
import { invokeGetLogsChunk } from '@/store/logs/handlers';
import { Box, Table } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

const ITEM_HEIGHT = 45;
const ITEMS_OVERSCAN = 15;
const CHUNK_SIZE = 200;

type TRowsCache = Map<number, TLogRow>;

// TODO: cleanup
// TODO: remove no longer needed logs, since with current impl we will reach to have every log in memory
const LogViewImpl = React.forwardRef<HTMLDivElement, TPropsFromRedux>((props, ref) => {
  let [rowsCache, setRowsCache] = useState({ data: new Map() as TRowsCache });
  const rowsCacheMetadata = useRef({ bounds: { begin: 0, end: 0 } });
  const prevLogsMetadata = useRef<{
    logsChunk: typeof props.logsChunk | null;
    startIndex: number | null;
  }>({
    logsChunk: null,
    startIndex: null,
  });

  useEffect(() => {
    props.invokeGetLogsChunk(0, 200);

    rowsCacheMetadata.current.bounds.begin = 0;
    rowsCacheMetadata.current.bounds.begin = 200;

    rowsCache.data.clear();
    setRowsCache(prev => ({ ...prev }));

    console.trace(LogViewImpl, 'Cleared rows cache');
  }, [props.activeLogsChangedTime]);

  const [scrollTop, setScrollTop] = useState(0);

  const headerRef = useRef<HTMLTableSectionElement>(null);
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  const numberOfItems = props.logsChunk.totalLogs;
  const innerRef = ref as React.RefObject<HTMLDivElement>;
  const windowHeight = innerRef.current ? innerRef.current.offsetHeight : 300;
  const rawIndex = Math.floor(scrollTop / ITEM_HEIGHT) - ITEMS_OVERSCAN;
  const startIndex = Math.max(0, Math.min(rawIndex, props.logsChunk.totalLogs - 1));
  const renderedNodesCount = Math.min(
    numberOfItems - startIndex,
    Math.floor(windowHeight / ITEM_HEIGHT) + 2 * ITEMS_OVERSCAN
  );

  const endIndex = startIndex + renderedNodesCount;

  useEffect(() => {
    const prev = prevLogsMetadata.current;
    const logsChunkChanged = prev.logsChunk !== null && prev.logsChunk !== props.logsChunk;
    const startIndexChanged = prev.startIndex !== null && prev.startIndex !== startIndex;

    if (logsChunkChanged || (logsChunkChanged && startIndexChanged)) {
      console.trace(LogViewImpl, 'Updating rows cache', {
        newChunk: props.logsChunk,
        startIndex,
        rowsCache: rowsCache.data,
      });

      for (let idx = 0; idx < props.logsChunk.data.length; ++idx) {
        const row = props.logsChunk.data[idx];
        rowsCache.data.set(Number(row[0]), row);
      }

      setRowsCache(prev => ({ ...prev }));

      console.trace(LogViewImpl, 'Rows cache', { rowsCache: rowsCache.data });
    }

    prevLogsMetadata.current = {
      logsChunk: props.logsChunk,
      startIndex,
    };
  }, [props.logsChunk, startIndex]);

  const syncWidths = () => {
    if (!headerRef.current || !bodyRef.current) return;

    const headerCells = headerRef.current.querySelectorAll('th');
    const firstBodyRow = bodyRef.current.querySelector('tr');
    if (!firstBodyRow) return;
    const bodyCells = firstBodyRow.querySelectorAll('td');

    console.assertX(
      LogViewImpl,
      headerCells.length === bodyCells.length,
      `Logic error, header cells count(${headerCells.length}) != body cells count(${bodyCells.length})`
    );

    bodyCells.forEach((td, index) => {
      const width = td.getBoundingClientRect().width + 'px';
      headerCells[index].style.width = width;
    });
  };

  const syncWidthsDebounced = useDebounce(syncWidths, 100);

  useEffect(() => {
    syncWidths();
    window.addEventListener('resize', syncWidths);

    return () => window.removeEventListener('resize', syncWidths);
  }, [props.tags, props.logsChunk, renderedNodesCount]);

  const generateLogRows = () => {
    const items: Array<JSX.Element> = [];
    for (let i = 0; i < renderedNodesCount; i++) {
      const rowIndex = i + startIndex;

      const row = rowsCache.data.get(rowIndex);
      // if (row === undefined) {
      //   continue;
      // }

      const filterId = row ? row[1] : 'default';

      const colors = props.filterToColors.get(filterId);

      const backgroundColor =
        colors !== undefined
          ? colors.bg
          : rowIndex % 2 === 0
            ? props.theme.table.stripedEven
            : props.theme.table.stripedOdd;

      const textColor = colors !== undefined ? colors.fg : 'inherit';

      items.push(
        <Table.Row
          data-index={rowIndex}
          key={rowIndex}
          textWrap='nowrap'
          backgroundColor={backgroundColor}
          borderColor={props.theme.table.border}
          color={textColor}
        >
          <For each={props.tags}>
            {(_, fieldIndex) => {
              return (
                <Table.Cell minWidth='100px' borderColor='inherit' width='100%' maxWidth='100%'>
                  {row ? row[fieldIndex + 2] : 'Loading...'}
                </Table.Cell>
              );
            }}
          </For>
        </Table.Row>
      );
    }
    return items;
  };

  const totalLogs = useRef(0);
  totalLogs.current = props.logsChunk.totalLogs;

  const fetchMissingLogs = (startIndex: number, endIndex: number) => {
    let chunkBegin: null | number = null;

    for (let idx = startIndex; idx < endIndex + ITEMS_OVERSCAN; idx++) {
      if (!rowsCache.data.has(idx)) {
        chunkBegin = idx;
        break;
      }
    }

    if (chunkBegin === null) return;

    const chunkEnd = Math.min(totalLogs.current, chunkBegin + CHUNK_SIZE + ITEMS_OVERSCAN);

    console.trace(LogViewImpl, 'Fetching logs', { chunkBegin, chunkEnd });

    props.invokeGetLogsChunk(chunkBegin, chunkEnd);
  };

  // Debounced version
  const fetchMissingLogsDebounced = useDebounce(fetchMissingLogs, 100);

  return (
    <Box
      ref={ref}
      overflow='scroll'
      width='100vw'
      onScroll={e => {
        setScrollTop(e.currentTarget.scrollTop);
        syncWidthsDebounced();

        fetchMissingLogsDebounced(startIndex, endIndex);
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

        <Box width='100vw' height={`${numberOfItems * ITEM_HEIGHT}px`}>
          <Table.Root transform={`translateY(${startIndex * ITEM_HEIGHT}px)`} width='100%'>
            <Table.Body ref={bodyRef}>{generateLogRows()}</Table.Body>
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
