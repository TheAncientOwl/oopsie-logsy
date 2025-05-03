/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogView.tsx
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description Display logs in table format
 */

import { TRootState } from '@/store';
import { Table } from '@chakra-ui/react';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

type TLogViewProps = {
  offsetTop: string;
};

const items = [
  {
    id: 1,
    timestamp: '1000000',
    channel: 'channel1',
    level: 'trace',
    payload: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim.',
  },
  {
    id: 2,
    timestamp: '1000001',
    channel: 'channel2',
    level: 'info',
    payload: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 3,
    timestamp: '1000002',
    channel: 'channel3',
    level: 'debug',
    payload: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
  {
    id: 4,
    timestamp: '1000003',
    channel: 'channel1',
    level: 'warn',
    payload: 'Exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    id: 5,
    timestamp: '1000004',
    channel: 'channel2',
    level: 'error',
    payload: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  },
  {
    id: 6,
    timestamp: '1000005',
    channel: 'channel3',
    level: 'trace',
    payload: 'Voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur.',
  },
  {
    id: 7,
    timestamp: '1000006',
    channel: 'channel1',
    level: 'info',
    payload: 'Sint occaecat cupidatat non proident, sunt in culpa qui officia.',
  },
  {
    id: 8,
    timestamp: '1000007',
    channel: 'channel2',
    level: 'debug',
    payload: 'Deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet.',
  },
  {
    id: 9,
    timestamp: '1000008',
    channel: 'channel3',
    level: 'warn',
    payload: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.',
  },
  {
    id: 10,
    timestamp: '1000009',
    channel: 'channel1',
    level: 'error',
    payload: 'Labore et dolore magna aliqua. Ut enim ad minim veniam quis.',
  },
  {
    id: 11,
    timestamp: '1000010',
    channel: 'channel2',
    level: 'trace',
    payload: 'Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
  },
  {
    id: 12,
    timestamp: '1000011',
    channel: 'channel3',
    level: 'info',
    payload: 'Consequat duis aute irure dolor in reprehenderit in voluptate velit.',
  },
  {
    id: 13,
    timestamp: '1000012',
    channel: 'channel1',
    level: 'debug',
    payload: 'Esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.',
  },
  {
    id: 14,
    timestamp: '1000013',
    channel: 'channel2',
    level: 'warn',
    payload: 'Cupidatat non proident sunt in culpa qui officia deserunt mollit.',
  },
  {
    id: 15,
    timestamp: '1000014',
    channel: 'channel3',
    level: 'error',
    payload: 'Anim id est laborum lorem ipsum dolor sit amet consectetur elit.',
  },
  {
    id: 16,
    timestamp: '1000015',
    channel: 'channel1',
    level: 'trace',
    payload: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 17,
    timestamp: '1000016',
    channel: 'channel2',
    level: 'info',
    payload: 'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris.',
  },
  {
    id: 18,
    timestamp: '1000017',
    channel: 'channel3',
    level: 'debug',
    payload: 'Nisi ut aliquip ex ea commodo consequat duis aute irure dolor.',
  },
  {
    id: 19,
    timestamp: '1000018',
    channel: 'channel1',
    level: 'warn',
    payload: 'In reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
  },
  {
    id: 20,
    timestamp: '1000019',
    channel: 'channel2',
    level: 'error',
    payload: 'Nulla pariatur excepteur sint occaecat cupidatat non proident.',
  },
  {
    id: 21,
    timestamp: '1000020',
    channel: 'channel3',
    level: 'trace',
    payload: 'Sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: 22,
    timestamp: '1000021',
    channel: 'channel1',
    level: 'info',
    payload: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ut enim.',
  },
  {
    id: 23,
    timestamp: '1000022',
    channel: 'channel2',
    level: 'debug',
    payload: 'Sed do eiusmod tempor incididunt ut labore et dolore magna.',
  },
  {
    id: 24,
    timestamp: '1000023',
    channel: 'channel3',
    level: 'warn',
    payload: 'Ut enim ad minim veniam quis nostrud exercitation ullamco.',
  },
  {
    id: 25,
    timestamp: '1000024',
    channel: 'channel1',
    level: 'error',
    payload: 'Exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
  },
];

const LogViewImpl: React.FC<TLogViewProps & TPropsFromRedux> = props => {
  return (
    <Table.Root size='sm'>
      <Table.Header position='sticky' top={props.offsetTop} zIndex='1'>
        <Table.Row
          color={props.theme.table.text}
          backgroundColor={props.theme.table.header.background}
          borderColor={props.theme.table.header.border}
        >
          <Table.ColumnHeader color='inherit'>Idx</Table.ColumnHeader>
          <Table.ColumnHeader color='inherit'>Timestamp</Table.ColumnHeader>
          <Table.ColumnHeader color='inherit'>Channel</Table.ColumnHeader>
          <Table.ColumnHeader color='inherit'>Level</Table.ColumnHeader>
          <Table.ColumnHeader color='inherit' textAlign='center'>
            Payload
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body color={props.theme.table.text}>
        {items.map((item, index) => (
          <Table.Row
            key={item.id}
            textWrap='nowrap'
            backgroundColor={
              index % 2 === 0 ? props.theme.table.stripedEven : props.theme.table.stripedOdd
            }
            borderColor={props.theme.table.border}
          >
            <Table.Cell borderColor='inherit'>{item.id}</Table.Cell>
            <Table.Cell borderColor='inherit'>{item.timestamp}</Table.Cell>
            <Table.Cell borderColor='inherit'>{item.channel}</Table.Cell>
            <Table.Cell borderColor='inherit'>{item.level}</Table.Cell>
            <Table.Cell borderColor='inherit'>{item.payload}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  theme: state.theme.themes[state.theme.activeThemeIndex].logView,
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const LogView = connector(LogViewImpl);
// </redux>
