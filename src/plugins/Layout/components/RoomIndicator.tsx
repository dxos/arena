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
    <div className="flex flex-row-reverse p-2">
      <p className="flex items-center gap-1 text-xs text-zinc-800 dark:text-zinc-100">
        <span>Room</span>
        <Link to={routes.manageRoom} className="hover:underline hover:cursor-pointer">
          {roomLabel}
        </Link>
      </p>
    </div>
  );
};
