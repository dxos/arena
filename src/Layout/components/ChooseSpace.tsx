import { useIntent } from "@dxos/app-framework";
import { PublicKey } from "@dxos/react-client";
import React from "react";
import { RoomManagerIntent, roomManagerIntent } from "../../RoomManager/room-manager-plugin";
import { useRoomList } from "../../RoomManager/useRoomList";
import { Button } from "../../UI/Buttons";
import { useActiveRoom } from "../../RoomManager/useActiveRoom";

export const ChooseSpace = () => {
  const spaceList = useRoomList();
  const { dispatch } = useIntent();

  const activeSpace = useActiveRoom();

  const onJoinSpace = (key: PublicKey) => {
    dispatch(roomManagerIntent(RoomManagerIntent.JOIN_ROOM, { spaceKey: key }));
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <h2>Choose a room to join</h2>
      {spaceList.map((spaceKey) => {
        const keyHex = spaceKey.toHex();
        const isActive = activeSpace?.key.toHex() === keyHex;
        return (
          <div key={keyHex}>
            <code>
              {isActive && "(active) "} {keyHex.substring(0, 32)}...
            </code>
            <Button
              onClick={() => onJoinSpace(spaceKey)}
              variant="secondary"
              aria-label="Join space"
            >
              Join
            </Button>
          </div>
        );
      })}
    </div>
  );
};
