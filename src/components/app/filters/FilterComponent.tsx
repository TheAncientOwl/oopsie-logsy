/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file FilterComponent.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Filter component.
 */

import {
  type FilterComponentData,
  type OverAlternative,
} from '@/components/app/filters/interfaces';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import {
  DeleteIcon,
  EqualsIcon,
  NotEqualsIcon,
  RegexOffIcon,
  RegexOnIcon,
} from '@/components/ui/Icons';
import { For } from '@/components/ui/utils/For';
import { useColorModeValue } from '@/hooks/useColorMode';
import { useSwitch } from '@/hooks/useSwitch';
import { ButtonGroup, HStack, Input, ListCollection, Select } from '@chakra-ui/react';

interface FilterComponentProps extends FilterComponentData {
  overAlternatives: ListCollection<OverAlternative>;
}

export const FilterComponent = (props: FilterComponentProps) => {
  const border = useColorModeValue('gray.500', 'gray.500');

  const [isEquals, toggleIsEquals] = useSwitch(props.isEquals);
  const [isRegex, toggleIsRegex] = useSwitch(props.isRegex);

  return (
    <HStack>
      <Select.Root collection={props.overAlternatives} size='md' maxWidth='150px'>
        <Select.HiddenSelect />

        <Select.Control>
          <Select.Trigger cursor='pointer'>
            <Select.ValueText placeholder={props.over} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Select.Positioner>
          <Select.Content>
            <For each={props.overAlternatives.items}>
              {item => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              )}
            </For>
          </Select.Content>
        </Select.Positioner>
      </Select.Root>

      <ButtonGroup size='xs' colorPalette='green' variant='subtle'>
        <TooltipIconButton
          onClick={toggleIsRegex}
          tooltip={isRegex ? 'Toggle regex: Off' : 'Toggle regex: On'}
        >
          {isRegex ? <RegexOnIcon /> : <RegexOffIcon />}
        </TooltipIconButton>
        <TooltipIconButton
          onClick={toggleIsEquals}
          tooltip={isEquals ? 'Toggle not equals' : 'Toggle equals'}
        >
          {isEquals ? <EqualsIcon /> : <NotEqualsIcon />}
        </TooltipIconButton>
      </ButtonGroup>

      <Input
        borderColor={border}
        colorPalette='green'
        defaultValue={props.data}
        placeholder='Filter'
      />

      <TooltipIconButton tooltip='Delete component' size='sm' colorPalette='red' variant='subtle'>
        <DeleteIcon />
      </TooltipIconButton>
    </HStack>
  );
};
