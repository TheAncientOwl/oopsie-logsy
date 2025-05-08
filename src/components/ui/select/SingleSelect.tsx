/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file SingleSelect.tsx
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description SingleSelect Chakra UI wrapper.
 */

import {
  ListCollection,
  Select,
  SelectRootProps,
  SelectValueChangeDetails,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { For } from '../utils/For';

type TListItem = {
  label: string;
  value: string;
};

type TSingleSelectProps<T extends TListItem> = {
  root?: Partial<SelectRootProps<T>>;
  content?: Partial<Select.ContentProps>;
  item?: Partial<Select.ItemProps>;
  collection: ListCollection<T>;
  value: string;
  onChange: (newValue: string) => void;
};

export const SingleSelect = <T extends TListItem>(props: TSingleSelectProps<T>) => {
  const value = useMemo(() => [props.value], [props.value]);

  return (
    <Select.Root
      {...props.root}
      collection={props.collection}
      multiple={false}
      value={value}
      onValueChange={(details: SelectValueChangeDetails<T>) => {
        props.onChange(details.value[0]);
      }}
    >
      <Select.HiddenSelect />

      <Select.Control>
        <Select.Trigger cursor='pointer' borderColor={props.root?.borderColor}>
          <Select.ValueText placeholder={props.value} />
        </Select.Trigger>
      </Select.Control>

      <Select.Positioner>
        <Select.Content zIndex={1500} {...props.content}>
          <For each={props.collection.items}>
            {item => (
              <Select.Item item={item} key={item.value} cursor='pointer'>
                {item.label}
              </Select.Item>
            )}
          </For>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};
