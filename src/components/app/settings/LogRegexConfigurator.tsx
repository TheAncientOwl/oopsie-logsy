/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogRegexConfgurator.tsx
 * @author Alexandru Delegeanu
 * @version 0.12
 * @description Configure log line regex for parsing
 */

import { ApplyIcon, ExportIcon, ImportIcon, NewIcon } from '@/components/ui/Icons';
import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { For } from '@/components/ui/utils/For';
import { type TRootState } from '@/store';
import { TRegexTag } from '@/store/log-regex-tags/data';
import { addNewTag, invokeGetTags, invokeSetTags } from '@/store/log-regex-tags/handlers';
import { ButtonGroup, Heading, HStack, Input, Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { GrConfigure } from 'react-icons/gr';
import { connect, ConnectedProps } from 'react-redux';
import { RegexTagItem } from './RegexTagItem';

const mergeRegexSequences = (tags: Array<TRegexTag>): string => {
  return tags.map(tag => (tag.displayed ? `(${tag.regex})` : tag.regex)).join('');
};

export const LogRegexConfiguratorTrigger = () => {
  return (
    <HStack alignItems='center' justifyContent='center' cursor='button'>
      <GrConfigure />
      <Heading size='md'>Regex configurator</Heading>
    </HStack>
  );
};

const LogRegexConfiguratorContentImpl: React.FC<TPropsFromRedux> = props => {
  useEffect(() => {
    props.invokeGetTags();
  }, []);
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
        <Input disabled cursor='default' value={mergeRegexSequences(props.tags)} />
      </HStack>

      <HStack>
        <ButtonGroup variant='surface'>
          <TooltipIconButton onClick={props.addNewTag} tooltip='New tag' colorPalette='green'>
            <NewIcon />
          </TooltipIconButton>
          <TooltipIconButton
            onClick={() => props.invokeSetTags(props.tags)}
            disabled={!props.canApply}
            tooltip='Apply regex'
            colorPalette='green'
          >
            <ApplyIcon />
          </TooltipIconButton>
        </ButtonGroup>
        <Input disabled cursor='default' value='Tag Name' />
        <Input disabled cursor='default' value='Tag Regex' />
      </HStack>

      <For each={props.tags}>{tag => <RegexTagItem key={tag.id} tag={tag} />}</For>
    </Stack>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  tags: state.logRegexTags.tags,
  canApply: state.logRegexTags.canApplyTags,
  loading: state.logRegexTags.loading,
});

const mapDispatch = {
  invokeGetTags: invokeGetTags.dispatch,
  invokeSetTags: invokeSetTags.dispatch,
  addNewTag: addNewTag.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const LogRegexConfiguratorContent = connector(LogRegexConfiguratorContentImpl);
// </redux>
