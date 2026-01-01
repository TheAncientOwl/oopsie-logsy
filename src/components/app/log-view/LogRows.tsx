/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogRows.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Render log rows.
 */

import { TFilterColors } from '@/store/filters/data';
import { TLogRow } from '@/store/logs/data';
import { TRegexTag } from '@/store/regex-tags/data';
import { TLogViewTheme } from '@/store/theme/data';
import { For, Table } from '@chakra-ui/react';

type TLogRowsProps = {
  renderedNodesCount: number;
  startIndex: number;
  rowsCache: { data: Map<number, TLogRow> };
  filterToColors: Map<string, TFilterColors>;
  theme: TLogViewTheme;
  tags: TRegexTag[]; // TODO: can be replaced
};

export const LogRows = (props: TLogRowsProps) => {
  const items: Array<JSX.Element> = [];
  for (let i = 0; i < props.renderedNodesCount; i++) {
    const rowIndex = i + props.startIndex;

    const row = props.rowsCache.data.get(rowIndex);

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
              <Table.Cell
                key={fieldIndex}
                minWidth='100px'
                borderColor='inherit'
                width='100%'
                maxWidth='100%'
              >
                {row ? row[fieldIndex + 2] : 'Loading...'}
              </Table.Cell>
            );
          }}
        </For>
      </Table.Row>
    );
  }
  return <>{items}</>;
};
