/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file LogRegexConfgurator.tsx
 * @author Alexandru Delegeanu
 * @version 0.14
 * @description Configure log line regex for parsing
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { ApplyIcon, ExportIcon, ImportIcon, NewIcon } from '@/components/ui/icons';
import { DraggableList } from '@/components/ui/lists/DraggableList';
import { For } from '@/components/ui/utils/For';
import { type TRootState } from '@/store';
import { type TRegexTag } from '@/store/log-regex-tags/data';
import {
  addNewTag,
  invokeGetTags,
  invokeSetTags,
  reorderTags,
} from '@/store/log-regex-tags/handlers';
import { ButtonGroup, Heading, HStack, Input, Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { GrConfigure } from 'react-icons/gr';
import { connect, ConnectedProps } from 'react-redux';
import { RegexTagItem } from './RegexTagItem';

const mergeRegexSequences = (tags: Array<TRegexTag>): string => {
  return tags.map(tag => (tag.displayed ? `(${tag.regex})` : tag.regex)).join('');
};

export const LogRegexConfiguratorTriggerImpl: React.FC<TTriggerPropsFromRedux> = props => {
  return (
    <HStack alignItems='center' justifyContent='center' cursor='button'>
      <GrConfigure color={props.theme.colors.text} />
      <Heading size='md' color={props.theme.colors.text}>
        Regex configurator
      </Heading>
    </HStack>
  );
};

// <redux>
const mapTriggerState = (state: TRootState) => ({
  theme: state.theme.themes[state.theme.activeThemeIndex].settings.general,
});

const mapTriggerDispatch = {};

const triggerConnector = connect(mapTriggerState, mapTriggerDispatch);
type TTriggerPropsFromRedux = ConnectedProps<typeof triggerConnector>;

export const LogRegexConfiguratorTrigger = triggerConnector(LogRegexConfiguratorTriggerImpl);
// </redux>

const LogRegexConfiguratorContentImpl: React.FC<TPropsFromRedux> = props => {
  useEffect(() => {
    props.invokeGetTags();
  }, []);

  return (
    <Stack>
      <HStack>
        <ButtonGroup colorPalette='blue' variant='subtle' size='md'>
          <TooltipIconButton
            tooltip='Import configuration'
            variant={props.theme.buttons.import.variant}
            colorPalette={props.theme.buttons.import.colorPalette}
          >
            <ImportIcon />
          </TooltipIconButton>
          <TooltipIconButton
            tooltip='Export configuration'
            variant={props.theme.buttons.export.variant}
            colorPalette={props.theme.buttons.export.colorPalette}
          >
            <ExportIcon />
          </TooltipIconButton>
        </ButtonGroup>
        <Input disabled cursor='default' value={mergeRegexSequences(props.tags)} />
      </HStack>

      <HStack>
        <TooltipIconButton
          onClick={props.addNewTag}
          tooltip='New tag'
          variant={props.theme.buttons.newTag.variant}
          colorPalette={props.theme.buttons.newTag.colorPalette}
        >
          <NewIcon />
        </TooltipIconButton>

        <TooltipIconButton
          onClick={() => props.invokeSetTags(props.tags)}
          disabled={!props.canApply}
          tooltip='Apply regex'
          variant={props.theme.buttons.apply.variant}
          colorPalette={props.theme.buttons.apply.colorPalette}
        >
          <ApplyIcon />
        </TooltipIconButton>

        <Input disabled cursor='default' value='Tag Name' />
        <Input disabled cursor='default' value='Tag Regex' />

        <DraggableList.ItemHandle disabled />
      </HStack>

      <DraggableList.Container
        items={props.tags}
        direction='vertical'
        onDragEnd={(activeId, overId) => {
          props.reorderTags(activeId, overId);
        }}
      >
        <For each={props.tags}>{tag => <RegexTagItem key={tag.id} tag={tag} />}</For>
      </DraggableList.Container>
    </Stack>
  );
};

// <redux>
const mapState = (state: TRootState) => ({
  tags: state.logRegexTags.tags,
  canApply: state.logRegexTags.canApplyTags,
  loading: state.logRegexTags.loading,
  theme: state.theme.themes[state.theme.activeThemeIndex].settings.regexConfigurator,
});

const mapDispatch = {
  invokeGetTags: invokeGetTags.dispatch,
  invokeSetTags: invokeSetTags.dispatch,
  addNewTag: addNewTag.dispatch,
  reorderTags: reorderTags.dispatch,
};

const connector = connect(mapState, mapDispatch);
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const LogRegexConfiguratorContent = connector(LogRegexConfiguratorContentImpl);
// </redux>
