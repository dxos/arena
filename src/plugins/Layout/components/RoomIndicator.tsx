import { useActiveRoom } from "../../RoomManager/hooks/useActiveRoom";
import { routes } from "../routes";
import { Link } from "./Link";

export const RoomIndicator = () => {
  const room = useActiveRoom();
  if (!room) {
    return null;
  }

  const roomLabel = room.properties?.name || `${room.key.truncate()}`;

  return (
    <div className="p-2 flex flex-row-reverse">
      <p className="flex items-center gap-1 text-xs text-zinc-500">
        <span>Room</span>
        <Link to={routes.manageRoom} className="hover:underline hover:cursor-pointer">
          {roomLabel}
        </Link>
      </p>
    </div>
  );
};
