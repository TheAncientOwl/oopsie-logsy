/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file RegexTagItem.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description LogRegexConfigurator regex tag item.
 */

import { TooltipIconButton } from '@/components/ui/buttons/TooltipIconButton';
import { DeleteIcon, EyeClosedIcon, EyeOpenIcon } from '@/components/ui/Icons';
import { DeleteArrayObject, ModifyArrayObject } from '@/hooks/useArray';
import { HStack, Input } from '@chakra-ui/react';
import React from 'react';
import { RegexTag } from './LogRegexConfigurator';

interface RegexTagItemProps {
  tag: RegexTag;
  onDelete: DeleteArrayObject<RegexTag>;
  onModify: ModifyArrayObject<RegexTag>;
}

export const RegexTagItem = React.memo(
  ({ tag, onDelete, onModify }: RegexTagItemProps) => {
    const handleDelete = () => {
      onDelete((obj: RegexTag) => obj.id === tag.id);
    };

    const handleDisplayToggle = () => {
      onModify((obj: RegexTag) => obj.id === tag.id, { ...tag, displayed: !tag.displayed });
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onModify((obj: RegexTag) => obj.id === tag.id, { ...tag, name: event.target.value });
    };

    const handleRegexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onModify((obj: RegexTag) => obj.id === tag.id, { ...tag, regex: event.target.value });
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
          tooltip={tag.displayed ? 'Hide tag in log view' : 'Show tag in log view'}
          colorPalette='green'
          variant='subtle'
        >
          {tag.displayed ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </TooltipIconButton>
        <Input defaultValue={tag.name} onChange={handleNameChange} />
        <Input
          defaultValue={tag.regex}
          onChange={handleRegexChange}
          colorPalette={tag.regex.length > 0 ? 'current' : 'red'}
        />
      </HStack>
    );
  },
  (prevProps, nextProps) =>
    prevProps.tag.id === nextProps.tag.id &&
    prevProps.tag.displayed === nextProps.tag.displayed &&
    prevProps.tag.name === nextProps.tag.name &&
    prevProps.tag.regex === nextProps.tag.regex &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onModify === nextProps.onModify
);
