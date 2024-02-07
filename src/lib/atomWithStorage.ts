import { Atom, atom, react } from "signia";

// Inspired by the Jotai Utility
// https://github.com/pmndrs/jotai/pull/394

type Storage<Value> = {
  getItem: (key: string) => Value;
  setItem: (key: string, newValue: Value) => void;
};

const defaultStorage: Storage<unknown> = {
  getItem: (key) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      throw new Error("no value stored");
    }
    return JSON.parse(storedValue);
  },
  setItem: (key, newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  },
};

export function atomWithStorage<Value>(
  key: string,
  initialValue: Value,
  storage: Storage<Value> = defaultStorage as Storage<Value>
): Atom<Value> {
  const getInitialValue = () => {
    try {
      return storage.getItem(key);
    } catch (_e) {
      return initialValue;
    }
  };

  const baseAtom = atom(key, getInitialValue());

  react(`${key}__reactor`, () => storage.setItem(key, baseAtom.value));

  return baseAtom;
}
