let lockCount = 0;
let previousHtmlOverflow = "";
let previousBodyOverflow = "";

type SmoothScrollController = { stop: () => void; start: () => void };

function smoothScrollController() {
  return (window as unknown as { __lenis?: SmoothScrollController }).__lenis;
}

export function isDocumentScrollLocked() {
  return lockCount > 0;
}

/**
 * Shares a reversible document scroll lock between overlays. Each caller owns
 * one release function, so closing one dialog cannot unlock another.
 */
export function lockDocumentScroll() {
  if (typeof document === "undefined") return () => undefined;

  if (lockCount === 0) {
    previousHtmlOverflow = document.documentElement.style.overflow;
    previousBodyOverflow = document.body.style.overflow;
    smoothScrollController()?.stop();
  }

  lockCount += 1;
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  let released = false;
  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);

    if (lockCount === 0) {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      smoothScrollController()?.start();
    }
  };
}
