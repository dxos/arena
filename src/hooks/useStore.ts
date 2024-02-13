import { useCallback, useState } from "react";
import { inc } from "$lib/math";

const EXECUTION_LIMIT = 10000;

export type Exec<TState, TAction> = (state: TState, action: TAction) => [TState, TAction[]];

type Accumulator<TState> = {
  count: number;
  nextState: TState;
};

export const applyAction = <TState, TAction>(
  state: TState,
  action: TAction,
  exec: Exec<TState, TAction>,
  acc: Accumulator<TState> = { count: 0, nextState: state }
): Accumulator<TState> => {
  if (acc.count > EXECUTION_LIMIT) {
    throw new Error(
      `Execution limit exceeded (${EXECUTION_LIMIT} iterations). This is likely due to an infinite loop in your store machine.`
    );
  }

  const [newState, actions] = exec(acc.nextState || state, action);

  acc.count = inc(acc.count);
  acc.nextState = newState;

  // If there are actions to apply, recursively apply them
  for (const action of actions) {
    acc = applyAction(acc.nextState, action, exec, acc);
  }

  return acc;
};

export const useStore = <TState, TAction>(initial: TState, exec: Exec<TState, TAction>) => {
  const [state, setState] = useState(initial);

  const send = useCallback(
    (action: TAction) => {
      setState((prevState) => {
        const { nextState } = applyAction(prevState, action, exec);
        return nextState;
      });
    },
    [exec, setState]
  );

  return {
    state,
    send,
  };
};

// Experiment!
// Can we pass in an object from echo, and then allow the exec funtion to mutate it directly?
export const useMutatingStore = <TState, TAction>(state: TState, exec: Exec<TState, TAction>) => {
  const send = useCallback(
    (action: TAction) => {
      void applyAction(state, action, exec);
    },
    [exec, state]
  );

  return { send };
};
