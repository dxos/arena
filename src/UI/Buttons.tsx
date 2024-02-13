import React from "react";
import "./buttons.css";
import { cn } from "$lib/css";

type ButtonVariant = "primary" | "danger" | "secondary";
type ButtonSize = "small" | "medium";

type ButtonProps = React.PropsWithChildren<{
  "aria-label": string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  "aria-label": label,
  variant = "primary",
  size = "medium",
  ...props
}: ButtonProps) => {
  const variantClass = `button-${variant}`;

  const buttonClasses = cn("button", size);
  const insideClasses = cn("button-inside", variantClass, size);

  return (
    <button className={buttonClasses} type="button" aria-label={label} {...props}>
      <span className={insideClasses}>{children}</span>
    </button>
  );
};
