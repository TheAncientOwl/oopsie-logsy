/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filter.tsx
 * @author Alexandru Delegeanu
 * @version 0.11
 * @description Filter component
 */

import { type FilterData, type OverAlternatives } from '@/components/app/filters/interfaces';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { DeleteIcon, EyeClosedIcon, EyeOpenIcon, NewIcon } from '@/components/ui/Icons';
import { For } from '@/components/ui/utils/For';
import { useColorModeValue } from '@/hooks/useColorMode';
import { useSwitch } from '@/hooks/useSwitch';
import {
  Box,
  Checkbox,
  Collapsible,
  createListCollection,
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react';
import { FilterComponent } from './FilterComponent';

interface FilterProps extends FilterData {
  overAlternatives: OverAlternatives;
}

export const Filter = (props: FilterProps) => {
  const bg = useColorModeValue('gray.300', 'gray.800');
  const border = useColorModeValue('gray.500', 'gray.500');

  const [isOpen, toggleIsOpen] = useSwitch(true);

  const [isActive, toggleIsActive] = useSwitch(props.isActive);
  const [isHighlightOnly, toggleIsHighlightOnly] = useSwitch(props.isHighlightOnly);

  const list = createListCollection({
    items: props.overAlternatives.data,
  });

  return (
    <Box
      bg={bg}
      border='2px solid'
      borderTop='1px solid'
      borderBottom='1px solid'
      borderColor={border}
      padding='0.5em 0.75em'
    >
      <HStack>
        <TooltipIconButton
          size='sm'
          variant='subtle'
          colorPalette='green'
          tooltip={isOpen ? 'Hide Filter' : 'Show filter'}
          onClick={toggleIsOpen}
        >
          {isOpen ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </TooltipIconButton>
        <Input
          borderColor={border}
          colorPalette='green'
          placeholder='Filter Name'
          defaultValue={props.name}
        />

        <TooltipIconButton
          tooltip='Delete filter'
          size='sm'
          colorPalette='red'
          variant='subtle'
          onClick={event => event.stopPropagation()}
        >
          <DeleteIcon />
        </TooltipIconButton>
      </HStack>

      <Collapsible.Root open={isOpen}>
        <Collapsible.Content>
          <Stack gap='1em' padding='0.75em 0.5em'>
            <HStack gap='1em'>
              {/* TODO: implement add component button */}
              <TooltipIconButton
                tooltip='Add component'
                size='xs'
                colorPalette='green'
                variant='subtle'
              >
                <NewIcon />
              </TooltipIconButton>

              <Checkbox.Root
                cursor='pointer'
                onCheckedChange={toggleIsActive}
                checked={isActive}
                variant='subtle'
                colorPalette='green'
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Active</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root
                cursor='pointer'
                onCheckedChange={toggleIsHighlightOnly}
                checked={isHighlightOnly}
                variant='subtle'
                colorPalette='green'
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Highlight Only</Checkbox.Label>
              </Checkbox.Root>
            </HStack>

            <For each={props.components}>
              {component => <FilterComponent {...component} overAlternatives={list} />}
            </For>
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};
