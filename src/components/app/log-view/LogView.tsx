/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogView.tsx
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description Display logs in table format
 */

import { For } from '@/components/ui/utils/For';
import { TRootState } from '@/store';
import { type UUID } from '@/store/common/identifier';
import { type TFilterColors } from '@/store/filters/data';
import { Box, Table } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

const itemHeight = 45;
const overscan = 5;

const LogViewImpl = React.forwardRef<HTMLDivElement, TPropsFromRedux>((props, ref) => {
  const [scrollTop, setScrollTop] = useState(0);

  const dummyRef = useRef<HTMLTableRowElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  const numberOfItems = props.logs[0].length;
  const innerRef = ref as React.RefObject<HTMLDivElement>;
  const windowHeight = innerRef.current ? innerRef.current.offsetHeight : 300;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  let renderedNodesCount = Math.floor(windowHeight / itemHeight) + 2 * overscan;
  renderedNodesCount = Math.min(numberOfItems - startIndex, renderedNodesCount);

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

  useEffect(() => {
    syncWidths();
    window.addEventListener('resize', syncWidths);

    return () => window.removeEventListener('resize', syncWidths);
  }, [props.tags, props.logs, renderedNodesCount]);

  const generateLogRows = () => {
    const items: Array<JSX.Element> = [];
    for (let i = 0; i < renderedNodesCount; i++) {
      const rowIndex = i + startIndex;

      const filterId = props.filterIDs[rowIndex];

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
          ref={dummyRef}
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
                  {props.logs[fieldIndex][rowIndex]}
                </Table.Cell>
              );
            }}
          </For>
        </Table.Row>
      );
    }
    return items;
  };

  return (
    <Box
      ref={ref}
      overflow='scroll'
      width='100vw'
      onScroll={e => {
        setScrollTop(e.currentTarget.scrollTop);
        syncWidths();
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

        <Box width='100vw' height={`${numberOfItems * itemHeight}px`}>
          <Table.Root transform={`translateY(${startIndex * itemHeight}px)`} width='100%'>
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
  logs: state.logs.logs,
  filterIDs: state.logs.filterIDs,
  filterToColors: new Map<UUID, TFilterColors>(
    state.filters.filters.map(filter => [filter.id, filter.colors])
  ),
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch, null, { forwardRef: true });
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const LogView = connector(LogViewImpl);
// </redux>
