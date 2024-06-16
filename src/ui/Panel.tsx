import { cn } from "$lib/css";
import { HTMLAttributes } from "react";

type PanelProps = { rimLight?: boolean } & HTMLAttributes<HTMLDivElement>;

export const Panel = ({ rimLight, ...props }: PanelProps) => {
  const classNames = cn(
    "text-gray-800",
    "bg-zinc-50",
    "dark:bg-zinc-900",
    "dark:text-white",
    "text-black",
    "border border-zinc-200 dark:border-zinc-600",
    "rounded-sm",
    "shadow-md",
    props.className,
  );

  return (
    <div className={cn("p-[1px] rounded-[2px]")}>
      <div {...props} className={classNames} />
    </div>
  );
};
