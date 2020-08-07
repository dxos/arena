//
// Copyright 2020 DXOS.org
//

import { Chance } from 'chance';
import React, { Fragment, useState } from 'react';
import { useParams } from 'react-router-dom';

import GameIcon from '@material-ui/icons/VideogameAsset';

import { ChessModel } from '@dxos/chess-core';
import { keyToString } from '@dxos/crypto';
import { PartyTreeAddItemButton, PartyTree, PartyTreeItem, useAppRouter } from '@dxos/react-appkit';
import { useClient, useParties } from '@dxos/react-client';

import { ChessSettings } from '../components/ChessSettings';
import { useItemList } from '../model';

const chance = new Chance();

const TreeItem = ({ item, active, onSelect, onRename }) => (
  <PartyTreeItem
    id={item.itemId}
    label={item.title || item.itemId}
    icon={GameIcon}
    isSelected={active === item.itemId}
    onSelect={onSelect}
    onUpdate={onRename}
  />
);

/**
 * Games list.
 * @param {string} topic Current topic.
 */
const Games = ({ topic }) => {
  const router = useAppRouter();
  const { item: active } = useParams();
  const { items, createItem, renameItem } = useItemList(topic);

  // TODO(burdon): Remove.
  const [playerSelectVisible, setPlayerSelectVisible] = useState(false);

  if (!topic) {
    return null;
  }

  const handleSelect = (itemId) => {
    router.push({ topic, item: itemId });
  };

  const handleCreate = (selection) => {
    setPlayerSelectVisible(false);
    if (!selection) {
      return;
    }

    const title = `game-${chance.word()}`;
    const itemId = createItem(ChessModel.createGenesisMessage(title, selection.white, selection.black));
    handleSelect(itemId);
  };

  return (
    <Fragment>
      {items.map(item => (
        <TreeItem
          key={item.itemId}
          item={item}
          active={active}
          onRename={title => renameItem(item.itemId, title)}
          onSelect={() => handleSelect(item.itemId)}
        />
      ))}

      <PartyTreeAddItemButton topic={topic} onClick={() => setPlayerSelectVisible(true)}>
        Game
      </PartyTreeAddItemButton>

      {/* TODO(burdon): Remove: move into View. */}
      <ChessSettings
        isVisible={playerSelectVisible}
        onSelected={handleCreate}
      />
    </Fragment>
  );
};

// TODO(burdon): Remove custom sidebar.
const Sidebar = () => {
  const client = useClient();
  const parties = useParties();
  const router = useAppRouter();
  const { topic } = useParams();

  const handleSelect = (topic) => {
    router.push({ topic });
  };

  const handleCreate = async () => {
    const party = await client.partyManager.createParty();
    handleSelect(keyToString(party.publicKey));
  };

  return (
    <PartyTree
      parties={parties}
      items={topic => <Games topic={topic} />}
      selected={topic}
      onSelect={handleSelect}
      onCreate={handleCreate}
    />
  );
};

export default Sidebar;
