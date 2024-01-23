import React, { CSSProperties, HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../lib";

const rimGradient = `linear-gradient(
  100deg,
  hsla(240deg 100% 80% / 0.09) 0%,
  hsla(278deg 82% 77% / 0.15) 18%,
  hsla(314deg 91% 77% / 0.18) 31%,
  hsla(329deg 100% 79% / 0.09) 43%,
  hsla(347deg 100% 81% / 0.12) 53%,
  hsla(10deg 100% 81% / 0.09) 63%,
  hsla(28deg 100% 77% / 0.09) 72%,
  hsla(40deg 100% 76% / 0.19) 81%,
  hsla(50deg 100% 77% / 0.09) 90%,
  hsla(66deg 100% 80% / 0.03) 100%
)`;

// TODO: Move this to a theme file
const customPanelStyles: CSSProperties = {
  boxShadow: `
    0 0 0 1px rgba(155, 155, 155, 0.065),
    0 2.75px 3px rgba(0, 0, 0, 0.24),
    0 22px 18px rgba(0,0,0,.01)`,
  backgroundImage: "url('/images/noise.png')",
  backgroundSize: "80px 80px",
};

type PanelProps = { rimLight?: boolean } & HTMLAttributes<HTMLDivElement>;

export const Panel = ({ rimLight, ...props }: PanelProps) => {
  const classNames = cn(
    "text-gray-800",
    "bg-stone-50",
    "dark:bg-zinc-900",
    "dark:text-white",
    "text-black",
    "rounded-sm",
    props.className
  );

  const styles: CSSProperties = rimLight ? { backgroundImage: rimGradient } : {};

  return (
    <div className="p-[1px] rounded-[2px]" style={styles}>
      <div {...props} className={classNames} style={{ ...customPanelStyles, ...props.style }} />
    </div>
  );
};
