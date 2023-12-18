import { useClient } from "@dxos/react-client";
import { useSpace } from "@dxos/react-client/echo";
import React, { PropsWithChildren } from "react";
import { PersonIcon } from "../icons";
import { cn } from "../lib";
import { Link } from "./Link";

const RoundButton = ({
  children,
  label,
  onClick,
}: PropsWithChildren<{ label: string; onClick: () => void }>) => {
  const classNames = cn(
    "p-2",
    "flex items-center justify-center",
    "text-gray-900",
    "bg-gray-50",
    "rounded-full border border-gray-200 shadow-sm",
    "hover:bg-gray-100 hover:border-gray-300",
    "active:scale-90",
    "text-xs",
    "h-8"
  );

  return (
    <button type="button" className={classNames} onClick={onClick} aria-label={label}>
      {children}
    </button>
  );
};

const Avatar = ({ onClick }: { onClick: () => void }) => {
  return (
    <RoundButton label="Manage user" onClick={onClick}>
      <PersonIcon />
    </RoundButton>
  );
};

export const Nav = () => {
  const client = useClient();
  const space = useSpace();

  if (!space) return null;

  return (
    <nav className="p-4 flex justify-between items-center">
      {/* TODO(Zan): Don't reload the page */}
      <Link href="/">
        <div className="px-2 border border-gray-900 rounded-sm shadow-sm">
          <h1 className="font-bold text-3xl">Arena App</h1>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <RoundButton
          label="Invite to space"
          onClick={() => client.shell.shareSpace({ spaceKey: space.key })}
        >
          Invite to space
        </RoundButton>
        <Avatar onClick={() => client.shell.open()} />
      </div>
    </nav>
  );
};
