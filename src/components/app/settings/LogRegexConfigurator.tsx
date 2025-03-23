/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogRegexConfgurator.tsx
 * @author Alexandru Delegeanu
 * @version 0.6
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
import { For } from '@/components/ui/utils/For';
import { useArray } from '@/hooks/useArray';
import { useSwitch } from '@/hooks/useSwitch';
import { ButtonGroup, Collapsible, Heading, HStack, Input, Stack } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { GrConfigure } from 'react-icons/gr';

interface RegexTag {
  id: number;
  displayed: boolean;
  regex: string;
  name: string;
}

const mergeRegexSequences = (tags: Array<RegexTag>): string => {
  return tags.map(tag => (tag.displayed ? `(${tag.regex})` : tag.regex)).join('');
};

const getTags = async (): Promise<Array<RegexTag>> => {
  try {
    const response = await invoke<Array<RegexTag>>('get_tags');
    return response;
  } catch (error) {
    console.log(':LogRegexConfigurator::getTags: Error getting tags from rust: ', error);
  }
  return [];
};

interface RegexTagItemProps {
  tag: RegexTag;
  onDelete: () => void;
  onDisplayToggle: () => void;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRegexChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RegexTagItem = (props: RegexTagItemProps) => {
  console.log('Render');

  return (
    <HStack key={props.tag.id}>
      <TooltipIconButton
        onClick={props.onDelete}
        tooltip='Delete tag'
        colorPalette='red'
        variant='subtle'
      >
        <DeleteIcon />
      </TooltipIconButton>
      <TooltipIconButton
        onClick={props.onDisplayToggle}
        tooltip={props.tag.displayed ? 'Hide tag in log view' : 'Show tag in log view'}
        colorPalette='green'
        variant='subtle'
      >
        {props.tag.displayed ? <EyeOpenIcon /> : <EyeClosedIcon />}
      </TooltipIconButton>
      <Input defaultValue={props.tag.name} onChange={props.onNameChange} />
      <Input defaultValue={props.tag.regex} onChange={props.onRegexChange} />
    </HStack>
  );
};

export const LogRegexConfigurator = () => {
  const tags = useArray<RegexTag>(undefined);

  const [isOpen, toggleOpen] = useSwitch(true);
  const [canApply, setCanApply] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const loadedTags = await getTags();
      tags.set(loadedTags);
    };
    fetchTags();
  }, [tags.set]);

  const applyRegex = async () => {
    try {
      const response = await invoke('set_tags', { tags: tags.data });
      setCanApply(false);
      console.log('::LogRegexConfigurator::applyRegex: Rust response:', response);
    } catch (error) {
      console.error('::LogRegexConfigurator::applyRegex: Error sending tags to rust:', error);
    }
  };

  const addTag = () => {
    tags.add({
      id: tags.data.length === 0 ? 0 : tags.data[tags.data.length - 1].id + 1,
      displayed: true,
      regex: '',
      name: 'new tag',
    });
    setCanApply(true);
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
            <Input disabled cursor='default' value={mergeRegexSequences(tags.data)} />
          </HStack>

          <HStack>
            <ButtonGroup variant='surface'>
              <TooltipIconButton onClick={addTag} tooltip='New tag' colorPalette='green'>
                <NewIcon />
              </TooltipIconButton>
              <TooltipIconButton
                onClick={applyRegex}
                disabled={!canApply}
                tooltip='Apply regex'
                colorPalette='green'
              >
                <ApplyIcon />
              </TooltipIconButton>
            </ButtonGroup>
            <Input disabled cursor='default' value='Tag Name' />
            <Input disabled cursor='default' value='Tag Regex' />
          </HStack>

          <For each={tags.data}>
            {(tag, index) => (
              <RegexTagItem
                tag={tag}
                onDelete={() => {
                  tags.delete(index);
                  setCanApply(true);
                }}
                onDisplayToggle={() => {
                  tags.modify(index, {
                    ...tags.data[index],
                    displayed: !tags.data[index].displayed,
                  });
                  setCanApply(true);
                }}
                onNameChange={event => {
                  tags.modify(index, { ...tags.data[index], name: event.target.value });
                  setCanApply(true);
                }}
                onRegexChange={event => {
                  tags.modify(index, { ...tags.data[index], regex: event.target.value });
                  setCanApply(true);
                }}
              />
            )}
          </For>
        </Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
