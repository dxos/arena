import { Intent, IntentResolverProvides, Plugin, PluginDefinition } from "@dxos/app-framework";
import React, { PropsWithChildren } from "react";
import { mkIntentBuilder } from "../lib";
import { zzfx } from "zzfx";

// TODO(Zan): Expose settings to disable sound effects
// TODO(Zan): Atlas should be composed of sounds sourced from different plugins

// --- Constants and Metadata -------------------------------------------------
export const SynthPluginMeta = { id: "Synth", name: "Synth Plugin" };

// --- Intents ----------------------------------------------------------------
const actionPrefix = "@arena.dxos.org/synth";

// TODO(Zan): A lot of these sounds could be improved. Proof of concept for now.
export const sfxAtlas = {
  boot: [1.47, , 57, 0.01, 0.14, 0.27, , 1.94, , -3.5, 19, 0.06, 0.13, , , , 0.07, 0.99, 0.09, 0.1],
  powerup: [1.1, 0.01, 657, 0.01, 0.07, 0.4, 1, 0.6, , , 150, , 0.08, , , , , 0.56, 0.01, 0.3],
  blip: [0.7, 0.01, 1500, 0.01, , 0.01, , 0.7, 10, -36, 540, 0.13, , , 39, , , 0.56, 0.01],
  check: [2.1, 0.01, 65.40639, 0.14, 0.06, 0.29, 1, 1.99, , , , , , 0.1, , , 0.05, 0.4, 0.04, 0.19],
  move: [0.1, , 2e3, 0.01, , 0.01, , 0.21, 10, -36, 540, 0.13, , , 39, , , 0.56, 0.01],
  "game-over": [, 0.01, 430, 0.09, 0.28, 0.32, 1, 1.21, , , -100, , 0.12, 0.2, , , , 0.49, 0.11],
};

export enum SynthIntent {
  PLAY_SOUND_FROM_ATLAS = `${actionPrefix}/synth`,
}

export namespace SynthIntent {
  export type PlaySoundFromAtlas = { sound: keyof typeof sfxAtlas };
}

type SynthIntents = {
  [SynthIntent.PLAY_SOUND_FROM_ATLAS]: SynthIntent.PlaySoundFromAtlas;
};

export const synthIntent = mkIntentBuilder<SynthIntents>(SynthPluginMeta.id);

const intentResolver = (intent: Intent, _plugins: Plugin[]) => {
  switch (intent.action) {
    case SynthIntent.PLAY_SOUND_FROM_ATLAS: {
      const { sound } = intent.data as SynthIntent.PlaySoundFromAtlas;
      console.log("Playing sound", sound);

      zzfx(...sfxAtlas[sound]);

      break;
    }
  }
};

// --- Plugin Definition ------------------------------------------------------
type SynthPluginProvidesCapabilities = IntentResolverProvides;

export default function InvitationPlugin(): PluginDefinition<SynthPluginProvidesCapabilities> {
  return {
    meta: SynthPluginMeta,

    provides: {
      context: (props: PropsWithChildren) => <>{props.children}</>,
      intent: { resolver: intentResolver },
    },
  };
}
