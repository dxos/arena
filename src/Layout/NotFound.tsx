import React from "react";
import { Panel } from "../UI/Panel";

export const NotFound = () => {
  return (
    <div className="m-8">
      <Panel>
        <div className="text-3xl font-bold">404</div>
        <div className="text-xl">Not Found</div>
      </Panel>
    </div>
  );
};
