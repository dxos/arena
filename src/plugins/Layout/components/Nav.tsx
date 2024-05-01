import { useClient } from "@dxos/react-client";
import { useActiveRoom } from "../../RoomManager/hooks/useActiveRoom";
import { Button } from "../../../UI/Buttons";
import { PersonIcon } from "../../../icons";
import { Link } from "./Link";

const Avatar = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button aria-label="Manage user" onClick={onClick} size="small" variant="danger">
      <PersonIcon />
    </Button>
  );
};

export const Nav = () => {
  const client = useClient();
  const space = useActiveRoom();

  if (!space) return null;

  return (
    <nav
      className="p-4 sm:p-6 flex justify-between items-center"
      style={{
        backgroundImage: `linear-gradient(
      100deg,
      hsl(240deg 100% 80%) 0%,
      hsl(278deg 82% 77%) 18%,
      hsl(314deg 91% 77%) 31%,
      hsl(329deg 100% 79%) 43%,
      hsl(347deg 100% 81%) 53%,
      hsl(10deg 100% 81%) 63%,
      hsl(28deg 100% 77%) 72%,
      hsl(40deg 100% 76%) 81%,
      hsl(50deg 100% 77%) 90%,
      hsl(66deg 100% 80%) 100%
    )`,
      }}
    >
      <Link to="/">
        <div>
          <h1 className="text-2xl sm:text-4xl text-white" style={{ fontFamily: "EB Garamond" }}>
            DXOS Arena
          </h1>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <Button
          aria-label="Invite to room"
          onClick={() => client.shell.shareSpace({ spaceKey: space.key })}
          variant={"secondary"}
          size="small"
        >
          Invite to room
        </Button>
        {/* TODO(Zan): Identity panel crashes in 0.5.0 */}
        {/* <Avatar onClick={() => client.shell.open()} /> */}
      </div>
    </nav>
  );
};
