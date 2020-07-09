//
// Copyright 2020 DXOS.org
//

import clsx from 'clsx';
import React, { useState, Fragment } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

import BoardSettings from './BoardSettings';
import List from './List';
import { useBoard } from '../model/board';
import { LIST_TYPE, CARD_TYPE, useList } from '../model/list';

const useStyles = makeStyles(() => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      padding: 10
    },

    scrollBox: {
      // TODO(sfvisser): Don't hardcode the sidebar width and toolbar height,
      // but fix the current container mess.
      width: 'calc(100vw - 250px)',
      overflow: 'scroll',
      height: 'calc(100% - 50px)'
    },

    topbar: {
      display: 'flex',
      background: 'white',
      padding: 10,
      justifyContent: 'space-between'
    },

    list: {
      '&:not(:last-child)': {
        marginRight: 10
      }
    }
  };
});

export const Board = ({ topic, viewId }) => {
  const classes = useStyles();

  const viewModel = useBoard(topic, viewId);
  const board = viewModel.getById(viewId);

  const listsModel = useList(topic, viewId);
  const lists = listsModel.getObjectsByType(LIST_TYPE).sort(positionCompare);
  const cards = listsModel.getObjectsByType(CARD_TYPE);

  const [settingsOpen, setSettingsOpen] = useState(false);
  if (!board || !listsModel) {
    return <div className={classes.root}>Loading board...</div>;
  }

  const handleAddList = () => {
    listsModel.createItem(LIST_TYPE, { title: 'New List', position: getLastPosition(lists) });
  };

  const handleUpdateList = (listId) => (properties) => {
    listsModel.updateItem(listId, properties);
  };

  const handleAddCard = (title, listId) => {
    const cardsInList = getCardsForList(listId);
    listsModel.createItem(CARD_TYPE, { listId, title, position: getLastPosition(cardsInList) });
  };

  const getCardsForList = listId => cards
    .filter(card => card.properties.listId === listId)
    .sort(positionCompare);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // No drop target, skip this no-op.
    if (!destination) {
      return;
    }

    if (source.droppableId === board.viewId) { // Dragging entire lists.
      const position = getPositionAtIndex(lists, destination.index);
      listsModel.updateItem(draggableId, { position });
    } else { // Dragging cards
      const cardsInList = getCardsForList(destination.droppableId);
      const position = getPositionAtIndex(cardsInList, destination.index);
      if (source.droppableId === destination.droppableId) {
        listsModel.updateItem(draggableId, { position });
      } else {
        listsModel.updateItem(draggableId, {
          position,
          listId: destination.droppableId
        });
      }
    }
  };

  const Topbar = () => (
    <div className={clsx(classes.topbar, 'MuiDrawer-paperAnchorDockedTop')}>
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon fontSize="small" />}
        onClick={handleAddList}
      >
        Add List
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={<SettingsIcon fontSize="small" />}
        onClick={() => setSettingsOpen(!settingsOpen)}
      >
        Settings
      </Button>
    </div>
  );

  const Lists = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable direction="horizontal" type="column" droppableId={board.viewId}>
        {(provided) => (
          <div ref={provided.innerRef} className={classes.scrollBox}>
            <div className={classes.root}>
              {lists.map((list, index) => (
                <Draggable key={list.id} draggableId={list.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={provided.draggableProps.style}
                      className={classes.list}
                    >
                      <List
                        key={list.id}
                        list={list}
                        cards={getCardsForList(list.id)}
                        onUpdateList={handleUpdateList(list.id)}
                        onOpenCard={() => { }}
                        onAddCard={handleAddCard}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  return (
    <Fragment>
      <Topbar />
      <Lists />
      <BoardSettings
        board={board}
        onRename={displayName => viewModel.renameView(viewId, displayName)}
        onUpdate={opts => viewModel.updateView(viewId, opts)}
        onDelete={() => viewModel.deleteView(viewId)}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </Fragment>
  );
};

const positionCompare = (a, b) => a.properties.position - b.properties.position;

function getLastPosition (list) {
  if (list.length === 0) {
    return 0;
  } else {
    return list[list.length - 1].properties.position + 1;
  }
}

function getPositionAtIndex (list, index) {
  if (list.length === 0) {
    return 0;
  } else if (index === 0) {
    return list[0].properties.position - 1;
  } else if (index >= list.length - 1) {
    return list[list.length - 1].properties.position + 1;
  } else {
    return (list[index - 1].properties.position + list[index].properties.position) / 2;
  }
}
