import { useActiveRoom } from "../../RoomManager/useActiveRoom";
import { routes } from "../routes";
import { Link } from "./Link";

export const RoomIndicator = () => {
  const room = useActiveRoom();

  if (!room) return null;

  const roomLabel = room.properties?.name || `${room.key.toHex().substring(0, 24)}..`;

  return (
    <div className="p-2 flex flex-row-reverse">
      <p className="text-xs text-zinc-500">
        Room:{" "}
        <Link to={routes.manageRoom} className="hover:underline hover:cursor-pointer">
          {roomLabel}
        </Link>
      </p>
    </div>
  );
};
