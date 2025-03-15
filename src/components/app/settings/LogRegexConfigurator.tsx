/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogRegexConfgurator.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Configure log line regex for parsing
 */

import {
  DeleteIcon,
  ExportIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  ImportIcon,
  NewIcon,
} from '@/components/ui/icons';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipIconButton } from '@/components/ui/TooltipIconButton';
import { useSwitch2 } from '@/hooks/useSwitch';
import {
  ButtonGroup,
  Collapsible,
  Heading,
  HStack,
  IconButton,
  Input,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaInfo } from 'react-icons/fa';
import { GrConfigure } from 'react-icons/gr';

interface RegexTag {
  id: string;
  displayed: boolean;
  sequence: string;
  name: string;
}

const dummyTags = Array.from<RegexTag>([
  { id: '1', displayed: true, sequence: '^d+', name: 'Timestamp' },
  { id: '2', displayed: false, sequence: '\\s+', name: 'whitespace' },
  { id: '3', displayed: true, sequence: 'S+', name: 'Channel' },
  { id: '4', displayed: false, sequence: '\\s+', name: 'whitespace' },
  { id: '5', displayed: true, sequence: 'S+', name: 'Level' },
  { id: '6', displayed: false, sequence: '\\s+', name: 'whitespace' },
  { id: '7', displayed: true, sequence: '.+$', name: 'Payload' },
]);

const mergeRegexSequences = (tags: Array<RegexTag>): string => {
  return tags.map(tag => tag.sequence).join('');
};

export const LogRegexConfigurator = () => {
  const [tags, setTags] = useState<Array<RegexTag>>(dummyTags);
  const { state: isOpen, toggle: toggleOpen } = useSwitch2(true);

  return (
    <Collapsible.Root defaultOpen={true}>
      <Collapsible.Trigger onClick={toggleOpen} cursor='button'>
        <Tooltip content={isOpen ? 'Hide configuration' : 'Show configurator'}>
          <HStack alignItems='center' justifyContent='center' cursor='button'>
            {isOpen ? <EyeOpenIcon /> : <EyeClosedIcon />}
            <Heading size='xl'>Regex configurator</Heading>
            <GrConfigure />
          </HStack>
        </Tooltip>
      </Collapsible.Trigger>
      <Collapsible.Content pt='1em'>
        <Stack>
          <HStack>
            <ButtonGroup colorPalette='blue' variant='subtle' size='md'>
              <TooltipIconButton tooltip='Import configuration'>
                <ImportIcon />
              </TooltipIconButton>
              <TooltipIconButton tooltip='Export configuration'>
                <ExportIcon />
              </TooltipIconButton>
            </ButtonGroup>
            <Input disabled cursor='default' value={mergeRegexSequences(tags)} />
          </HStack>
          <HStack>
            <TooltipIconButton tooltip='New tag' colorPalette='green' variant='surface'>
              <NewIcon />
            </TooltipIconButton>
            <IconButton disabled colorPalette='blue' variant='subtle' cursor='default'>
              <FaInfo />
            </IconButton>
            <Input disabled cursor='default' value='Tag Name' />
            <Input disabled cursor='default' value='Tag Regex' />
          </HStack>
          {tags.map(tag => (
            <HStack key={tag.id}>
              <TooltipIconButton tooltip='Delete tag' colorPalette='red' variant='subtle'>
                <DeleteIcon />
              </TooltipIconButton>
              <TooltipIconButton
                tooltip={tag.displayed ? 'Hide tag in log view' : 'Show tag in log view'}
                colorPalette='green'
                variant='subtle'
              >
                {tag.displayed ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </TooltipIconButton>
              <Input defaultValue={tag.name} />
              <Input defaultValue={tag.sequence} />
            </HStack>
          ))}
        </Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
