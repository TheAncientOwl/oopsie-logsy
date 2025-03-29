/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filter.tsx
 * @author Alexandru Delegeanu
 * @version 0.10
 * @description Filter component
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { DeleteIcon, EyeClosedIcon, EyeOpenIcon } from '@/components/ui/Icons';
import { useColorModeValue } from '@/hooks/useColorMode';
import { useSwitch } from '@/hooks/useSwitch';
import {
  Box,
  Checkbox,
  Collapsible,
  createListCollection,
  HStack,
  Input,
  Select,
  Stack,
} from '@chakra-ui/react';

interface FilterProps {
  name: string;
  over: string;
  overAlternatives: { label: string; value: string }[];
  highlightOnly: boolean;
  isRegex: boolean;
  formula: string;
  active: boolean;
  colors: {
    bg: string;
    fg: string;
  };
}

export const Filter = ({
  name,
  over,
  overAlternatives,
  highlightOnly,
  isRegex,
  active,
  formula,
  colors,
}: FilterProps) => {
  const bg = useColorModeValue('gray.300', 'gray.800');
  const border = useColorModeValue('gray.500', 'gray.500');

  const [isOpen, toggleIsOpen] = useSwitch(true);

  const list = createListCollection({
    items: overAlternatives,
  });

  // TODO: remove when dynamic data is available
  const [isRegexDbg, isRegexDbgToggle] = useSwitch(isRegex);

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
          defaultValue={name}
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
              <Checkbox.Root checked={active} variant='subtle' colorPalette='green'>
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Active</Checkbox.Label>
              </Checkbox.Root>
              <Checkbox.Root checked={highlightOnly} variant='subtle' colorPalette='green'>
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Highlight Only</Checkbox.Label>
              </Checkbox.Root>
              <Checkbox.Root
                checked={isRegexDbg}
                variant='subtle'
                colorPalette='green'
                onCheckedChange={() => isRegexDbgToggle()}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>IsRegex</Checkbox.Label>
              </Checkbox.Root>
            </HStack>
            <HStack>
              <Select.Root collection={list} size='md' maxWidth='150px'>
                <Select.HiddenSelect />

                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder={over} />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Select.Positioner>
                  <Select.Content colorPalette='green'>
                    {list.items.map(item => (
                      <Select.Item item={item} key={item.value}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>

              <Input
                borderColor={border}
                colorPalette='green'
                defaultValue={formula}
                placeholder='Filter'
              />
            </HStack>
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};
