import {
  Intent,
  IntentResolverProvides,
  Plugin,
  PluginDefinition,
  useIntent,
} from "@dxos/app-framework";
import React, { PropsWithChildren } from "react";
import { mkIntentBuilder } from "../lib";
import { atom } from "signia";
import { v4 as uuid } from "uuid";
import { Toast } from "@dxos/react-ui";
import { useValue } from "signia-react";
import { match } from "ts-pattern";

// --- Constants and Metadata -------------------------------------------------
export const ToasterPluginMeta = { id: "Toaster", name: "Toaster Plugin" };

// --- State ------------------------------------------------------------------
type Toast = { id: string; title: string; description: string; duration?: number };

const toastsAtom = atom<Toast | undefined>("toasts", undefined);

// --- Intents ----------------------------------------------------------------
const actionPrefix = "@arena.dxos.org/toaster";

export enum ToasterIntent {
  ISSUE_TOAST = `${actionPrefix}/issue-toast`,
  CLEAR_TOAST = `${actionPrefix}/clear-toast`,
}

export namespace ToasterIntent {
  export type IssueToast = Omit<Toast, "id">;
  export type ClearToast = undefined;
}

type ToasterIntents = {
  [ToasterIntent.ISSUE_TOAST]: ToasterIntent.IssueToast;
  [ToasterIntent.CLEAR_TOAST]: ToasterIntent.ClearToast;
};

export const toasterIntent = mkIntentBuilder<ToasterIntents>(ToasterPluginMeta.id);

const intentResolver = (intent: Intent, _plugins: Plugin[]) => {
  match(intent.action as ToasterIntent)
    .with(ToasterIntent.ISSUE_TOAST, () => {
      const { duration, ...toastData } = intent.data as ToasterIntent.IssueToast;

      toastsAtom.set({ id: uuid(), duration: duration ?? 3000, ...toastData });
    })
    .with(ToasterIntent.CLEAR_TOAST, () => toastsAtom.set(undefined))
    .exhaustive();
};

// --- Plugin Definition ------------------------------------------------------
type ToasterPluginProvidesCapabilities = IntentResolverProvides;

export default function ToasterPlugin(): PluginDefinition<ToasterPluginProvidesCapabilities> {
  return {
    meta: ToasterPluginMeta,

    provides: {
      context: (props: PropsWithChildren) => {
        const { dispatch } = useIntent();
        const toast = useValue(toastsAtom);

        const open = toast !== undefined;
        const onOpenChange = (open: boolean) => {
          if (!open) {
            dispatch(toasterIntent(ToasterIntent.CLEAR_TOAST));
          }
        };

        return (
          <Toast.Provider duration={3000}>
            <Toast.Viewport />
            {/* TODO(Zan): Move this to a surface to not re-render the app sub-tree when toasting */}
            <Toast.Root open={open} onOpenChange={onOpenChange}>
              <Toast.Body>
                <Toast.Title>{toast?.title}</Toast.Title>
                <Toast.Description>{toast?.description}</Toast.Description>
              </Toast.Body>
            </Toast.Root>
            {props.children}
          </Toast.Provider>
        );
      },
      intent: { resolver: intentResolver },
    },
  };
}
