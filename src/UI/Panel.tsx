import React, { CSSProperties, HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../lib";

// TODO: Move this to a theme file
const customPanelStyles: CSSProperties = {
  boxShadow:
    "0 0 0 1px rgba(53,72,91,.14), 0 2.75px 2.21px rgba(0,0,0,.07), 0 6.65px 5.32px rgba(0,0,0,.043), 0 12.5px 10px rgba(0,0,0,.03), 0 22px 18px rgba(0,0,0,.03), 0 42px 33.4px rgba(0,0,0,.02), 0 100px 80px rgba(0,0,0,.017)",
  backgroundImage: "url('/images/noise.png')",
  backgroundSize: "80px 80px",
};

type PanelProps = HTMLAttributes<HTMLDivElement>;

export const Panel = ({ ...props }: PanelProps) => {
  const classNames = cn(
    "text-gray-800 dark:text-gray-200",
    "bg-gray-50 dark:bg-gray-900",
    "rounded-sm",
    props.className
  );

  return <div {...props} className={classNames} style={{ ...customPanelStyles, ...props.style }} />;
};
