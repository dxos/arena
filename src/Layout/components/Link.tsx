import React from "react";

type LinkProps = { to: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export const Link = (props: LinkProps) => {
  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    window.history.pushState({}, "", props.to || "");
  };

  return <a href={props.to} {...props} onClick={handleNavigation} />;
};
