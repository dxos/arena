import { useIntent } from "@dxos/app-framework";
import { RoomManagerIntent, roomManagerIntent } from "../../RoomManager/room-manager-plugin";
import { useActiveRoom } from "../../RoomManager/hooks/useActiveRoom";
import { useRoomList } from "../../RoomManager/hooks/useRoomList";
import { Button } from "$ui/Buttons";

export const ChooseRoom = () => {
  const roomList = useRoomList();
  const { dispatch } = useIntent();

  const activeSpace = useActiveRoom();

  const onJoinSpace = (room: { key: string; name?: string }) => {
    dispatch(roomManagerIntent(RoomManagerIntent.JOIN_ROOM, { room }));
  };

  return (
    <div className="mt-4 sm:mt-12 flex flex-col items-center justify-center h-full gap-3">
      <h2 className="text-3xl" style={{ fontFamily: "EB Garamond" }}>
        Join a room
      </h2>
      {roomList.map((room) => {
        const isActive = activeSpace?.key.toHex() === room.key;
        return (
          <div className="flex flex-row gap-2 items-center" key={room.key}>
            <code>
              {isActive && "(active) "} {room.name || `${room.key.substring(0, 32)}...`}
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
