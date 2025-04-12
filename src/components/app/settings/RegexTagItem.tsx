/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file RegexTagItem.tsx
 * @author Alexandru Delegeanu
 * @version 0.4
 * @description LogRegexConfigurator regex tag item.
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { DeleteIcon, EyeClosedIcon, EyeOpenIcon } from '@/components/ui/Icons';
import { TRegexTag } from '@/store/log-regex-tags/data';
import {
  removeTag,
  setTagName,
  setTagRegex,
  toggleTagDisplay,
} from '@/store/log-regex-tags/handlers';
import { HStack, Input } from '@chakra-ui/react';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

interface RegexTagItemProps extends PropsFromRedux {
  tag: TRegexTag;
}

const RegexTagItemImpl: React.FC<RegexTagItemProps> = props => {
  const handleDelete = () => {
    props.removeTag(props.tag.id);
  };

  const handleDisplayToggle = () => {
    props.toggleTagDisplay(props.tag.id);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setTagName(props.tag.id, event.target.value);
  };

  const handleRegexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setTagRegex(props.tag.id, event.target.value);
  };

  return (
    <HStack>
      <TooltipIconButton
        onClick={handleDelete}
        tooltip='Delete tag'
        colorPalette='red'
        variant='subtle'
      >
        <DeleteIcon />
      </TooltipIconButton>
      <TooltipIconButton
        onClick={handleDisplayToggle}
        tooltip={props.tag.displayed ? 'Hide tag in log view' : 'Show tag in log view'}
        colorPalette='green'
        variant='subtle'
      >
        {props.tag.displayed ? <EyeOpenIcon /> : <EyeClosedIcon />}
      </TooltipIconButton>
      <Input defaultValue={props.tag.name} onChange={handleNameChange} />
      <Input
        defaultValue={props.tag.regex}
        onChange={handleRegexChange}
        colorPalette={props.tag.regex.length > 0 ? 'current' : 'red'}
      />
    </HStack>
  );
};

// <redux>
const mapState = () => ({});

const mapDispatch = {
  removeTag: removeTag.dispatch,
  toggleTagDisplay: toggleTagDisplay.dispatch,
  setTagName: setTagName.dispatch,
  setTagRegex: setTagRegex.dispatch,
};

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const RegexTagItem = connector(RegexTagItemImpl);
// </redux>
