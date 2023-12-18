import React from "react";
import "./buttons.css";
import { cn } from "../lib";

type ButtonVariant = "primary" | "danger" | "secondary";

type ButtonProps = React.PropsWithChildren<{
  "aria-label": string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
}>;

export const Button = ({
  children,
  "aria-label": label,
  onClick,
  disabled,
  variant = "primary",
}: ButtonProps) => {
  const variantClass = `button-${variant}`;

  const insideClasses = cn("button-inside", variantClass);

  return (
    <button
      className="button"
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
    >
      <span className={insideClasses}>{children}</span>
    </button>
  );
};
