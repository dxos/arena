import { useIntent } from "@dxos/app-framework";
import { useIdentity } from "@dxos/react-client/halo";
import { Input, Select } from "@dxos/react-ui";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useValue } from "signia-react";
import { PlayerOrdering, Variation, playerOrdering } from "../GameProvides";
import { Button } from "../UI/Buttons";
import { Panel } from "../UI/Panel";
import { InvitationIntent, gameProvidesAtom, invitationIntent } from "./invitation-plugin";

const useOnSubmit = () => {
  const identity = useIdentity();
  const { dispatch } = useIntent();

  return useCallback(
    (data: any, _event: any) => {
      if (!identity) {
        throw new Error("No identity");
      }

      const creatorId = identity.identityKey.toHex();
      const gameDescription = {
        gameId: data.gameId,
        variantId: data.variationId,
        timeControl: undefined,
        playerOrdering: data.playerOrdering,
      };

      dispatch(
        invitationIntent(InvitationIntent.CREATE_INVITATION, { creatorId, gameDescription })
      );
    },
    [dispatch, identity]
  );
};

export const CreateInvitation = () => {
  const gameProvides = useValue(gameProvidesAtom);
  const onSubmit = useOnSubmit();

  if (gameProvides.length === 0) {
    throw new Error("No game provides");
  }

  const variations = gameProvides.reduce((map, game) => {
    map[game.id] = game.variations;
    return map;
  }, {} as Record<string, Variation[]>);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      gameId: gameProvides[0].id,
      variationId: gameProvides[0].variations[0].id,
      playerOrdering: "creator-first" as PlayerOrdering,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="max-w-lg p-1 mx-auto">
          <Panel className="p-4 flex flex-col gap-3">
            <h2 className="text-2xl font-bold">New Game</h2>
            <div className="flex flex-col items-start gap-2">
              <Input.Root>
                <Input.Label>Game Name</Input.Label>

                <Select.Root
                  value={watch("gameId")}
                  onValueChange={(value) => setValue("gameId", value)}
                >
                  <Select.TriggerButton placeholder="Type" classNames="is-full" />
                  <Select.Portal>
                    <Select.Content>
                      <Select.Viewport>
                        {gameProvides.map((game) => (
                          <Select.Option key={game.id} value={game.id}>
                            {game.displayName}
                          </Select.Option>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </Input.Root>
              <Input.Root>
                <Input.Label>Variation</Input.Label>
                <Select.Root
                  value={watch("variationId")}
                  onValueChange={(value) => setValue("variationId", value)}
                >
                  <Select.TriggerButton placeholder="Type" classNames="is-full" />
                  <Select.Portal>
                    <Select.Content>
                      <Select.Viewport>
                        {variations[watch("gameId")].map((variation) => (
                          <Select.Option key={variation.id} value={variation.id}>
                            {variation.displayName}
                          </Select.Option>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </Input.Root>
              <Input.Root>
                <Input.Label>Player Order</Input.Label>
                <div className="flex flex-col sm:flex-row gap-1 items-center justify-between w-full">
                  {playerOrdering.map((ordering) => (
                    <Button
                      key={ordering}
                      type="button"
                      variant={watch("playerOrdering") === ordering ? "danger" : "primary"}
                      onClick={() => setValue("playerOrdering", ordering)}
                      aria-label={ordering}
                    >
                      {ordering}
                    </Button>
                  ))}
                </div>
              </Input.Root>
              <br />
              <div className="w-full flex flex-row-reverse">
                <Button type="submit" aria-label="Create game" variant="secondary">
                  Create game
                </Button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </form>
  );
};
