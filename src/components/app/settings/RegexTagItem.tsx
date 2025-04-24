/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file RegexTagItem.tsx
 * @author Alexandru Delegeanu
 * @version 0.5
 * @description LogRegexConfigurator regex tag item.
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { DoubleCheck } from '@/components/ui/DoubleCheck';
import { DeleteIcon, EyeClosedIcon, EyeOpenIcon } from '@/components/ui/Icons';
import { useSwitch } from '@/hooks/useSwitch';
import { TRegexTag } from '@/store/log-regex-tags/data';
import {
  removeTag,
  setTagName,
  setTagRegex,
  toggleTagDisplay,
} from '@/store/log-regex-tags/handlers';
import { HStack, Input, Span } from '@chakra-ui/react';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

type TRegexTagItemProps = TPropsFromRedux & {
  tag: TRegexTag;
};

const RegexTagItemImpl: React.FC<TRegexTagItemProps> = props => {
  const [deleteDoubleCheckOpen, toggleDeleteDoubleCheck] = useSwitch(false);
  const [tdDoubleCheckOpen, toggleTDDoubleCheck] = useSwitch(false);

  const toggleDisplay = () => {
    props.toggleTagDisplay(props.tag.id);
  };

  return (
    <>
      <HStack>
        <TooltipIconButton
          onClick={toggleDeleteDoubleCheck}
          tooltip='Delete tag'
          colorPalette='red'
          variant='subtle'
        >
          <DeleteIcon />
        </TooltipIconButton>
        <TooltipIconButton
          onClick={() => {
            if (props.tag.displayed) {
              toggleTDDoubleCheck();
            } else {
              toggleDisplay();
            }
          }}
          tooltip={props.tag.displayed ? 'Hide tag in log view' : 'Show tag in log view'}
          colorPalette='green'
          variant='subtle'
        >
          {props.tag.displayed ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </TooltipIconButton>
        <Input
          defaultValue={props.tag.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            props.setTagName(props.tag.id, event.target.value);
          }}
        />
        <Input
          defaultValue={props.tag.regex}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            props.setTagRegex(props.tag.id, event.target.value);
          }}
          colorPalette={props.tag.regex.length > 0 ? 'current' : 'red'}
        />
      </HStack>

      <DoubleCheck
        isShown={deleteDoubleCheckOpen}
        label='Delete Regex Tag'
        acceptLabel='Yes, Delete'
        declineLabel='No, Cancel'
        onAccept={() => {
          props.removeTag(props.tag.id);
          toggleDeleteDoubleCheck();
        }}
        onDecline={toggleDeleteDoubleCheck}
      >
        Are you sure you want to <Span color='red.500'>delete</Span> <b>{props.tag.name}</b>?<br />
        This action will <Span color='red.500'>invalidate all filters</Span> until manually updated
        <Span color='yellow.500'> when regex applied</Span>.
      </DoubleCheck>

      <DoubleCheck
        isShown={tdDoubleCheckOpen}
        label='Hide Regex Tag'
        acceptLabel='Yes, Hide'
        declineLabel='No, Cancel'
        onAccept={() => {
          toggleDisplay();
          toggleTDDoubleCheck();
        }}
        onDecline={toggleTDDoubleCheck}
      >
        Are you sure you want to <Span color='red.500'>hide</Span> <b>{props.tag.name}</b>?<br />
        This action will <Span color='red.500'>invalidate all filters</Span> until manually updated
        <Span color='yellow.500'> when regex applied</Span>.
      </DoubleCheck>
    </>
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
type TPropsFromRedux = ConnectedProps<typeof connector>;

export const RegexTagItem = connector(RegexTagItemImpl);
// </redux>
