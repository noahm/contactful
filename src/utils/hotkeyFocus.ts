import { useRef, useCallback, useEffect } from "react";

const inputs = new Set(["INPUT", "TEXTAREA"]);
function isInputNode(e: EventTarget | null) {
  return e instanceof Element && inputs.has(e.tagName);
}

/**
 * Provides automatic hotkey focus to an input field
 * @param keys keyboard keys to match, all in a row
 * @returns ref to be passed to the element that should be focused
 */
export function useHotkeyFocus(keys: string) {
  const elementRef = useRef<HTMLInputElement>(null);
  const focusElement = useCallback(
    (evt: KeyboardEvent) => {
      if (!isInputNode(evt.target) && keys.includes(evt.key)) {
        evt.preventDefault();
        elementRef.current?.focus();
      }
    },
    [keys]
  );
  useEffect(() => {
    document.addEventListener("keyup", focusElement);
    return () => {
      document.removeEventListener("keyup", focusElement);
    };
  }, [focusElement]);
  return elementRef;
}
