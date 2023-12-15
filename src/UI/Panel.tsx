import React, { CSSProperties, PropsWithChildren } from "react";
import { cn } from "../lib";

// TODO: Move this to a theme file
const customPanelStyles: CSSProperties = {
  boxShadow:
    "0 0 0 1px rgba(53,72,91,.14), 0 2.75px 2.21px rgba(0,0,0,.07), 0 6.65px 5.32px rgba(0,0,0,.043), 0 12.5px 10px rgba(0,0,0,.03), 0 22px 18px rgba(0,0,0,.03), 0 42px 33.4px rgba(0,0,0,.02), 0 100px 80px rgba(0,0,0,.017)",
};

export const Panel = ({ children }: PropsWithChildren<{}>) => {
  const classNames = cn(
    "flex flex-col items-center justify-center",
    "text-gray-800",
    "bg-gray-50 p-8",
    "rounded-sm"
  );

  return (
    <div className={classNames} style={{ ...customPanelStyles }}>
      {children}
    </div>
  );
};
