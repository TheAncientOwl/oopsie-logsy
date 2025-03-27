/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogRegexConfgurator.tsx
 * @author Alexandru Delegeanu
 * @version 0.8
 * @description Configure log line regex for parsing
 */

import { ApplyIcon, ExportIcon, ImportIcon, NewIcon } from '@/components/ui/Icons';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { For } from '@/components/ui/utils/For';
import { Console } from '@/console/Console';
import { useArray } from '@/hooks/useArray';
import { ButtonGroup, Heading, HStack, Input, Stack } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/core';
import { useCallback, useEffect, useState } from 'react';
import { GrConfigure } from 'react-icons/gr';
import { RegexTagItem } from './RegexTagItem';

export interface RegexTag {
  id: number;
  displayed: boolean;
  regex: string;
  name: string;
}

const mergeRegexSequences = (tags: Array<RegexTag>): string => {
  return tags.map(tag => (tag.displayed ? `(${tag.regex})` : tag.regex)).join('');
};

const invokeGetTags = async (): Promise<Array<RegexTag>> => {
  try {
    const response = await invoke<Array<RegexTag>>('get_tags');
    Console.info(
      `${LogRegexConfiguratorContent.name}::${invokeGetTags.name}`,
      `received ${response.length} tags`
    );
    return response;
  } catch (error) {
    Console.error(
      `${LogRegexConfiguratorContent.name}::${invokeGetTags.name}`,
      `error getting tags from rust: ${error}`
    );
  }
  return [];
};

const invokeSetTags = async (tags: Array<RegexTag>): Promise<boolean> => {
  try {
    const response = await invoke('set_tags', { tags });
    Console.info(
      `${LogRegexConfiguratorContent.name}::${invokeSetTags.name}`,
      `rust response ${response}`
    );
    return true;
  } catch (error) {
    Console.error(
      `${LogRegexConfiguratorContent.name}::${invokeSetTags.name}`,
      `error sending tags to rust: ${error}`
    );
    return false;
  }
};

export const LogRegexConfiguratorTrigger = () => {
  return (
    <HStack alignItems='center' justifyContent='center' cursor='button'>
      <GrConfigure />
      <Heading size='md'>Regex configurator</Heading>
    </HStack>
  );
};

export const LogRegexConfiguratorContent = () => {
  const tags = useArray<RegexTag>([{ id: 0, displayed: true, regex: '.*', name: 'payload' }]);

  const [hasApplied, setHasApplied] = useState(true);

  const handleApplyTags = useCallback(async () => {
    const result = await invokeSetTags(tags.data);
    if (result) {
      setHasApplied(true);
    }
  }, [tags.data, setHasApplied]);

  useEffect(() => {
    const fetchTags = async () => {
      const loadedTags = await invokeGetTags();

      if (loadedTags.length == 0) {
        Console.info(LogRegexConfiguratorContent.name, 'no tags received from rust');
        await handleApplyTags();
      } else {
        tags.set(loadedTags);
      }
    };
    fetchTags();
  }, []);

  const addTag = () => {
    const id = tags.data.length === 0 ? 0 : tags.data[tags.data.length - 1].id + 1;
    tags.add({
      id: id,
      displayed: false,
      regex: '.*',
      name: `new tag ${id}`,
    });
  };

  useEffect(() => {
    setHasApplied(!(tags.data.length > 0 && tags.data.every(tag => tag.regex.length > 0)));
  }, [tags.data, setHasApplied]);

  return (
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
            onClick={handleApplyTags}
            disabled={hasApplied}
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
        {tag => (
          <RegexTagItem key={tag.id} tag={tag} onDelete={tags.delete} onModify={tags.modify} />
        )}
      </For>
    </Stack>
  );
};
