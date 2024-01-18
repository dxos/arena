import React, { CSSProperties, HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../lib";

// TODO: Move this to a theme file
const customPanelStyles: CSSProperties = {
  boxShadow: `
    0 0 0 1px rgba(53,72,91,.14),
    0 2.75px 2.21px rgba(0,0,0,.07),
    0 22px 18px rgba(0,0,0,.01)`,
  backgroundImage: "url('/images/noise.png')",
  backgroundSize: "80px 80px",
};

type PanelProps = HTMLAttributes<HTMLDivElement>;

export const Panel = ({ ...props }: PanelProps) => {
  const classNames = cn(
    "text-gray-800",
    "bg-stone-50",
    "dark: bg-grey-900",
    "dark:text-white",
    "text-black",
    "rounded-sm",
    props.className
  );

  return <div {...props} className={classNames} style={{ ...customPanelStyles, ...props.style }} />;
};
