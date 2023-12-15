import React from "react";
import "./buttons.css";
import { cn } from "../lib";

type ButtonVariant = "primary" | "danger" | "secondary";

type ButtonProps = React.PropsWithChildren<{
  "aria-label": string;
  onClick: () => void;
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

export const Examples = () => {
  return (
    <div className="p-2">
      <h2>Examples</h2>
      <Button aria-label="Invite to space" onClick={() => {}}>
        Invite to space
      </Button>
    </div>
  );
};
