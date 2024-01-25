import { useIntent } from "@dxos/app-framework";
import { RoomManagerIntent, roomManagerIntent } from "../../RoomManager/room-manager-plugin";
import { useActiveRoom } from "../../RoomManager/useActiveRoom";
import { useRoomList } from "../../RoomManager/useRoomList";
import { Button } from "../../UI/Buttons";

export const ChooseRoom = () => {
  const spaceList = useRoomList();
  const { dispatch } = useIntent();

  const activeSpace = useActiveRoom();

  const onJoinSpace = (room: { key: string; name?: string }) => {
    dispatch(roomManagerIntent(RoomManagerIntent.JOIN_ROOM, { room }));
  };

  return (
    <div className="mt-4 sm:mt-8 flex flex-col items-center justify-center h-full gap-2">
      <h2>Choose a room to join</h2>
      {spaceList.map((room) => {
        const isActive = activeSpace?.key.toHex() === room.key;
        return (
          <div key={room.key}>
            <code>
              {isActive && "(active) "} {room.name || room.key.substring(0, 32)}...
            </code>
            <Button onClick={() => onJoinSpace(room)} variant="secondary" aria-label="Join space">
              Join
            </Button>
          </div>
        );
      })}
    </div>
  );
};
