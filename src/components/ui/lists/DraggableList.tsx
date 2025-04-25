/**
 * -------------------------------------------------------------------------- *
 *                     Copyright (c) by OopsieLogsy 2025                      *
 * -------------------------------------------------------------------------- *
 * @license https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE
 *
 * @file DraggableList.tsx
 * @author Alexandru Delegeanu
 * @version 0.1
 * @description Draggable list.
 */

import { type UUID } from '@/store/common/identifier';
import { Box, Icon } from '@chakra-ui/react';
import { closestCorners, DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { DragIcon } from '../Icons';

type TDragHandleContext = {
  attributes: ReturnType<typeof useSortable>['attributes'];
  listeners: ReturnType<typeof useSortable>['listeners'];
};

const DragHandleContext = createContext<TDragHandleContext | null>(null);

const useDragHandle = () => {
  const context = useContext(DragHandleContext);
  if (!context) throw new Error('useDragHandle must be used within a DraggableListItem');
  return context;
};

type TDraggableListItemHandleProps = {
  disabled?: boolean;
};

const DraggableListItemHandle: React.FC<TDraggableListItemHandleProps> = props => {
  const { attributes, listeners } = props.disabled
    ? { attributes: {}, listeners: {} }
    : useDragHandle();

  return (
    <Box cursor={props.disabled ? 'disabled' : 'grab'} {...attributes} {...listeners}>
      <Icon as={DragIcon} color={props.disabled ? 'gray.500' : ''} />
    </Box>
  );
};

type TDraggableListItemProps = PropsWithChildren & {
  id: UniqueIdentifier;
  zIndex?: string | number;
  allDraggable?: boolean;
};

const DraggableListItem: React.FC<TDraggableListItemProps> = props => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id,
  });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      zIndex={props.zIndex}
      {...(props.allDraggable ? { ...attributes, ...listeners } : {})}
    >
      {props.allDraggable ? (
        props.children
      ) : (
        <DragHandleContext.Provider value={{ attributes, listeners }}>
          {props.children}
        </DragHandleContext.Provider>
      )}
    </Box>
  );
};

type TDraggableListDirection = 'vertical' | 'horizontal';

type TUniqueIdentifiable = UniqueIdentifier | { id: UniqueIdentifier };

type TDraggableListProps<TItem extends TUniqueIdentifiable> = PropsWithChildren & {
  items: Array<TItem>;
  direction: TDraggableListDirection;
  onDragEnd: (activeId: UUID, overId: UUID) => void;
  onDragButNotMoved?: (activeId: UUID) => void;
};

const DraggableListImpl = <TItem extends TUniqueIdentifiable>(
  props: TDraggableListProps<TItem>
) => {
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.active && event.over) {
        if (event.active.id !== event.over.id) {
          props.onDragEnd(event.active.id as UUID, event.over.id as UUID);
        } else {
          props.onDragButNotMoved?.(event.active.id as UUID);
        }
      }
    },
    [props.onDragEnd, props.onDragButNotMoved]
  );

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <SortableContext
        items={props.items}
        strategy={
          props.direction === 'vertical'
            ? verticalListSortingStrategy
            : horizontalListSortingStrategy
        }
      >
        {props.children}
      </SortableContext>
    </DndContext>
  );
};

const reorderById = <TItem extends { id: UniqueIdentifier }>(
  items: Array<TItem>,
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier
): Array<TItem> => {
  const activeIndex = items.findIndex(item => item.id === activeId);
  const overIndex = items.findIndex(item => item.id === overId);

  console.assertX(
    reorderById.name,
    activeIndex !== -1,
    `Failed to find active item with id ${activeId} in given items`,
    items
  );

  console.assertX(
    reorderById.name,
    overIndex !== -1,
    `Failed to find over item with id ${overId} in given items`,
    items
  );

  return arrayMove(items, activeIndex, overIndex);
};

const reorderIds = (ids: Array<UUID>, activeId: UUID, overId: UUID): Array<UUID> => {
  const activeIndex = ids.findIndex(id => id === activeId);
  const overIndex = ids.findIndex(id => id === overId);

  console.assertX(
    reorderIds.name,
    activeIndex !== -1,
    `Failed to find active id ${activeId} in given IDs`,
    ids
  );

  console.assertX(
    reorderIds.name,
    overIndex !== -1,
    `Failed to find over id ${overId} in given IDs`,
    ids
  );

  return arrayMove(ids, activeIndex, overIndex);
};

export const DraggableList = {
  Container: DraggableListImpl,
  Item: DraggableListItem,
  ItemHandle: DraggableListItemHandle,
  reorderById,
  reorderIds,
};
