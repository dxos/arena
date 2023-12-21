import React from "react";
import "./buttons.css";
import { cn } from "../lib";

type ButtonVariant = "primary" | "danger" | "secondary";

type ButtonProps = React.PropsWithChildren<{
  "aria-label": string;
  variant?: ButtonVariant;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  "aria-label": label,
  variant = "primary",
  ...props
}: ButtonProps) => {
  const variantClass = `button-${variant}`;

  const insideClasses = cn("button-inside", variantClass);

  return (
    <button className="button" type="button" aria-label={label} {...props}>
      <span className={insideClasses}>{children}</span>
    </button>
  );
};
