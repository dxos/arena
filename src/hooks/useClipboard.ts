import { useEffect, useState } from "react";

/**
 * This module is a mashup of the following two hooks:
 * https://usehooks-ts.com/react-hook/use-copy-to-clipboard
 * https://github.com/danoc/react-use-clipboard
 */

interface UseClipboardOptions {
  /**
   * Reset the status after a certain number of milliseconds. This is useful
   * for showing a temporary success message.
   */
  successDuration?: number;
}

const copy = async (text: string) => {
  if (!navigator?.clipboard) {
    console.warn("Clipboard not supported");
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn("Copy failed", error);
    return false;
  }
};

export default function useClipboard(text: string, options?: UseClipboardOptions) {
  const [isCopied, setIsCopied] = useState(false);
  const successDuration = options && options.successDuration;

  useEffect(() => {
    if (isCopied && successDuration) {
      const id = setTimeout(() => setIsCopied(false), successDuration);
      return () => clearTimeout(id);
    }
  }, [isCopied, setIsCopied, successDuration]);

  return {
    isCopied,
    copy: async () => {
      const didCopy = await copy(text);
      setIsCopied(didCopy);
    },
  };
}
