/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file SingleSelect.tsx
 * @author Alexandru Delegeanu
 * @version 0.2
 * @description SingleSelect Chakra UI wrapper.
 */

import { useColorModeValue } from '@/hooks/useColorMode';
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
  collection: ListCollection<T>;
  value: string;
  onChange: (newValue: string) => void;
};

export const SingleSelect = <T extends TListItem>(props: TSingleSelectProps<T>) => {
  const border = useColorModeValue('gray.500', 'gray.500');

  const value = useMemo(() => [props.value], [props.value]);

  const handleValueChange = (details: SelectValueChangeDetails<T>) => {
    props.onChange(details.value[0]);
  };

  return (
    <Select.Root
      {...props.root}
      collection={props.collection}
      multiple={false}
      value={value}
      onValueChange={handleValueChange}
    >
      <Select.HiddenSelect />

      <Select.Control>
        <Select.Trigger cursor='pointer' borderColor={border}>
          <Select.ValueText placeholder={props.value} />
        </Select.Trigger>
      </Select.Control>

      <Select.Positioner>
        <Select.Content>
          <For each={props.collection.items}>
            {item => (
              <Select.Item item={item} key={item.value}>
                {item.label}
              </Select.Item>
            )}
          </For>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};
