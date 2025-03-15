/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file Filter.tsx
 * @author Alexandru Delegeanu
 * @version 0.3
 * @description Filter component
 */

import { useColorModeValue } from '@/components/ui/color-mode';
import { EyeClosedIcon, EyeOpenIcon, RegexOnIcon } from '@/components/ui/icons';
import { TooltipIconButton } from '@/components/ui/TooltipIconButton';
import useSwitch, { useSwitch2 } from '@/hooks/useSwitch';
import {
  Box,
  Checkbox,
  Collapsible,
  createListCollection,
  Heading,
  HStack,
  Input,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
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
  const border = useColorModeValue('gray.500', 'gray.300');

  const { state: isOpen, toggle: toggleIsOpen } = useSwitch();

  const list = createListCollection({
    items: overAlternatives,
  });

  // TODO: remove when dynamic data is available
  const { state: isRegexDbg, toggle: isRegexDbgToggle } = useSwitch2(isRegex);

  return (
    <Box
      bg={bg}
      border='2px solid'
      borderTop='1px solid'
      borderBottom='1px solid'
      borderColor={border}
      padding='1em'
    >
      <Collapsible.Root>
        <Collapsible.Trigger onClick={toggleIsOpen}>
          <HStack>
            <Heading size='md'>» {name}</Heading> {isOpen ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </HStack>
        </Collapsible.Trigger>

        <Collapsible.Content padding='1em 0.5em'>
          <Stack gap='1em'>
            <HStack gap='1.5em'>
              {/* TODO: add check/uncheck handlers */}
              <Checkbox.Root checked={active} variant='subtle' colorPalette='green'>
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Active</Checkbox.Label>
              </Checkbox.Root>

              {/* TODO: add check/uncheck handlers */}
              <Checkbox.Root checked={highlightOnly} variant='subtle' colorPalette='green'>
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Highlight Only</Checkbox.Label>
              </Checkbox.Root>
            </HStack>

            <SelectRoot collection={list} size='sm' variant='outline'>
              <HStack>
                <SelectLabel>Over</SelectLabel>
                <SelectTrigger borderColor={border}>
                  <SelectValueText placeholder={over} />
                </SelectTrigger>
              </HStack>
              <SelectContent colorPalette='green'>
                {list.items.map(item => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>

            <HStack>
              <TooltipIconButton
                tooltip={isRegexDbg ? 'Regex: Off' : 'Regex: On'}
                onClick={isRegexDbgToggle}
                colorPalette='green'
                variant='subtle'
                size='xs'
              >
                {isRegexDbg ? <RegexOnIcon /> : <RegexOnIcon />}{' '}
              </TooltipIconButton>
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
