import React from "react";
import { Panel } from "$ui/Panel";

export const NotFound = () => {
  return (
    <div className="m-8">
      <Panel>
        <div className="p-8 flex flex-col items-center gap-4">
          <div className="text-3xl font-bold">404</div>
          <div className="text-xs">
            We couldn't find anything at <code>{window.location.href}</code>
          </div>
        </div>
      </Panel>
    </div>
  );
};
