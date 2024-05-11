import { cn } from "$lib/css";
import { useIntentDispatcher } from "@dxos/app-framework";
import { Button } from "@dxos/react-ui";
import { useActiveRoom } from "../hooks/useActiveRoom";
import { useRoomList } from "../hooks/useRoomList";
import { RoomManagerIntent, roomManagerIntent } from "../room-manager-plugin";

const RoomCard = ({ children, active }: { children: React.ReactNode; active: boolean }) => {
  const className = cn(
    "p-4 bg-zinc-50 dark:bg-zinc-900 rounded-sm shadow-lg w-full max-w-lg",
    active ? "ring-1 ring-yellow-200 dark:ring-yellow-400" : "",
    "flex flex-row justify-between items-center gap-2",
  );
  return <div className={className}>{children}</div>;
};

export const ChooseRoom = () => {
  const roomList = useRoomList();
  const dispatch = useIntentDispatcher();

  const activeSpace = useActiveRoom();

  const onJoinSpace = (room: { key: string; name?: string }) => {
    dispatch(roomManagerIntent(RoomManagerIntent.JOIN_ROOM, { room }));
  };

  return (
    <div className="mt-4 sm:mt-12 px-4 pb-4 flex flex-col items-center justify-center h-full gap-3">
      <h2 className="text-3xl mb-3" style={{ fontFamily: "EB Garamond" }}>
        Join a room
      </h2>
      {roomList.map((room) => {
        const isActive = activeSpace?.key.toHex() === room.key;
        return (
          <RoomCard key={room.key} active={isActive}>
            <code>{room.name || `${room.key.substring(0, 32)}...`}</code>
            <Button onClick={() => onJoinSpace(room)} aria-label="Join space">
              {isActive ? "Joined" : "Join"}
            </Button>
          </RoomCard>
        );
      })}
    </div>
  );
};
