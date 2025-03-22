/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogRegexConfgurator.tsx
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description Configure log line regex for parsing
 */

import {
  ApplyIcon,
  DeleteIcon,
  ExportIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  ImportIcon,
  NewIcon,
} from '@/components/ui/Icons';
import { Tooltip } from '@/components/ui/Tooltip';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { useSwitch } from '@/hooks/useSwitch';
import { ButtonGroup, Collapsible, Heading, HStack, Input, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { GrConfigure } from 'react-icons/gr';
import { invoke } from '@tauri-apps/api/core';

interface RegexTag {
  id: number;
  displayed: boolean;
  regex: string;
  name: string;
}

const mergeRegexSequences = (tags: Array<RegexTag>): string => {
  return tags.map(tag => tag.regex).join('');
};

const getTags = async (): Promise<Array<RegexTag>> => {
  try {
    const response = await invoke<Array<RegexTag>>('get_tags');
    return response;
  } catch (error) {
    console.log('Error getting tags from rust: ', error);
  }
  return [];
};

export const LogRegexConfigurator = () => {
  const [tags, setTags] = useState<Array<RegexTag>>([]);
  const [isOpen, toggleOpen] = useSwitch(true);

  useEffect(() => {
    const fetchTags = async () => {
      const loadedTags = await getTags();
      setTags(loadedTags);
    };
    fetchTags();
  }, []);

  const applyRegex = async () => {
    try {
      const response = await invoke('set_tags', { tags });
      console.log('::LogRegexConfigurator::applyRegex: Rust response:', response);
    } catch (error) {
      console.error('::LogRegexConfigurator::applyRegex: Error sending tags:', error);
    }
  };

  const addTag = () => {
    setTags(
      tags.length == 0
        ? [{ id: 0, displayed: false, regex: '', name: 'new tag' }]
        : [
            ...tags,
            { id: tags[tags.length - 1].id + 1, displayed: false, regex: '', name: 'new tag' },
          ]
    );
  };

  const setTagName = (index: number, value: string) => {
    setTags(tags.map((tag, idx) => (idx === index ? { ...tag, name: value } : tag)));
  };

  const setTagRegex = (index: number, value: string) => {
    setTags(tags.map((tag, idx) => (idx === index ? { ...tag, regex: value } : tag)));
  };

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
            <TooltipIconButton
              tooltip='New tag'
              colorPalette='green'
              variant='surface'
              onClick={addTag}
            >
              <NewIcon />
            </TooltipIconButton>
            <TooltipIconButton
              tooltip='Apply regex'
              colorPalette='green'
              variant='surface'
              onClick={applyRegex}
            >
              <ApplyIcon />
            </TooltipIconButton>
            <Input disabled cursor='default' value='Tag Name' />
            <Input disabled cursor='default' value='Tag Regex' />
          </HStack>
          {tags.map((tag, index) => (
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
              <Input
                defaultValue={tag.name}
                onChange={event => {
                  setTagName(index, event.target.value);
                }}
              />
              <Input
                defaultValue={tag.regex}
                onChange={event => {
                  setTagRegex(index, event.target.value);
                }}
              />
            </HStack>
          ))}
        </Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
