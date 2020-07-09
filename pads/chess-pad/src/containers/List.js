//
// Copyright 2018 DXOS.org
//

import clsx from 'clsx';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';

import { EditableText } from '@dxos/react-ux';

import AddCard from './AddCard';
import MiniCard from './MiniCard';

const useStyles = makeStyles(() => ({
  root: {
    flexShrink: 0,
    backgroundColor: 'rgba(0,0,0, 0.03)',
    borderRadius: 3,
    padding: 10,
    width: 280
  },
  header: {
    marginBottom: 10,
    lineHeight: 'inherit !important'
  },
  cardContainer: {
    '&:not(:last-child)': {
      marginBottom: 10
    }
  }
}));

const List = ({ list, cards, onUpdateList, onOpenCard, onAddCard, className }) => {
  const classes = useStyles();

  const handleTitleUpdate = (title) => {
    onUpdateList({ title });
  };

  const Card = ({ card, provided }) => (
    <div
      className={classes.cardContainer}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <MiniCard
        card={card.properties}
        onOpenCard={() => onOpenCard(card.id)}
        style={provided.draggableProps.style}
      />
    </div>
  );

  // TODO(dboreham): Better way to reference object properties vs someObject.properties.someProperty everywhere?

  return (
    <div className={clsx(classes.root, className)}>
      <div className={classes.header}>
        <EditableText
          key={list.properties.title}
          value={list.properties.title || 'untitled list'}
          onUpdate={handleTitleUpdate}
        />
      </div>
      <Droppable direction="vertical" type="list" droppableId={list.id}>
        {({ innerRef, placeholder }) => (
          <div ref={innerRef}>
            {cards
              .filter(card => !card.deleted)
              .map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      key={card.id}
                      card={card}
                      index={index}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  )}
                </Draggable>
              ))}
            {placeholder}
          </div>
        )}
      </Droppable>
      <AddCard onAddCard={title => onAddCard(title, list.id)} />
    </div>
  );
};

export default List;
