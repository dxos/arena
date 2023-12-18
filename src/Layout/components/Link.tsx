import React from "react";

export const Link = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const handleNavigation = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    window.history.pushState({}, "", props.href || "");
  };

  return <a {...props} onClick={handleNavigation} />;
};
