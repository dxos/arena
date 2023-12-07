import React from "react";
import { PersonIcon } from "../icons";
import { cn } from "../lib";
import { useClient } from "@dxos/react-client";

const Avatar = ({ onClick }: { onClick: () => void }) => {
  const classNames = cn(
    "p-2",
    "flex items-center justify-center",
    "text-gray-900",
    "bg-gray-50",
    "rounded-full border border-gray-200 shadow-sm",
    "hover:bg-gray-100 hover:border-gray-300",
    "active:scale-90"
  );
  return (
    <button
      type="button"
      className={classNames}
      aria-label="Manage user"
      onClick={onClick}
    >
      <PersonIcon />
    </button>
  );
};

export const Nav = () => {
  const client = useClient();
  const onClick = () => {
    console.log("clicked");
    client.shell.open();
  };

  return (
    <nav className="p-4 flex justify-between items-center">
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 fit-content text-slate-50 px-2 border border-gray-900 rounded-sm shadow-md	">
        <h1 className="font-bold text-3xl">Arena App</h1>
      </div>
      <Avatar onClick={onClick} />
    </nav>
  );
};
