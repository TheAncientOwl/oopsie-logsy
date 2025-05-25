/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogView.tsx
 * @author Alexandru Delegeanu
 * @version 0.7
 * @description Display logs in table format
 */

import { For } from '@/components/ui/utils/For';
import { TRootState } from '@/store';
import { type UUID } from '@/store/common/identifier';
import { type TFilterColors } from '@/store/filters/data';
import { Table } from '@chakra-ui/react';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

const LogViewImpl: React.FC<TPropsFromRedux> = props => {
  return (
    <Table.Root size='sm'>
      <Table.Header position='sticky' top={0} zIndex={1}>
        <Table.Row
          color={props.theme.table.text}
          backgroundColor={props.theme.table.header.background}
          borderColor={props.theme.table.header.border}
        >
          <For each={props.tags}>
            {tag => {
              return (
                <Table.ColumnHeader
                  key={tag.id}
                  borderColor='inherit'
                  textAlign='center'
                  color='inherit'
                >
                  {tag.name}
                </Table.ColumnHeader>
              );
            }}
          </For>
        </Table.Row>
      </Table.Header>

      <Table.Body color={props.theme.table.text}>
        <For each={props.logs[0]}>
          {(_, rowIndex) => {
            const filterId = props.filterIDs[rowIndex];
            const colors = props.filterToColors.get(filterId);

            const backgroundColor =
              colors !== undefined
                ? colors.bg
                : rowIndex % 2 === 0
                  ? props.theme.table.stripedEven
                  : props.theme.table.stripedOdd;

            const textColor = colors !== undefined ? colors.fg : 'inherit';

            return (
              <Table.Row
                key={rowIndex}
                textWrap='nowrap'
                backgroundColor={backgroundColor}
                borderColor={props.theme.table.border}
                color={textColor}
              >
                <For each={props.tags}>
                  {(_, fieldIndex) => {
                    return (
                      <Table.Cell borderColor='inherit'>
                        {props.logs[fieldIndex][rowIndex]}
                      </Table.Cell>
                    );
                  }}
                </For>
              </Table.Row>
            );
          }}
        </For>
      </Table.Body>
    </Table.Root>
  );
};

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

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const LogView = connector(LogViewImpl);
// </redux>
