import { useEffect, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";
import { hasCompletedIntro } from "@/lib/intro";
import { lockDocumentScroll } from "@/lib/scroll-lock";

const welcomeSessionKey = "ha:welcome-dialog-shown";
let openedInThisDocument = false;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function hasSeenWelcome() {
  try {
    return window.sessionStorage.getItem(welcomeSessionKey) === "true";
  } catch {
    return false;
  }
}

function rememberWelcome() {
  openedInThisDocument = true;
  try {
    window.sessionStorage.setItem(welcomeSessionKey, "true");
  } catch {
    // The in-memory flag still prevents repeat prompts in this document.
  }
}

function addName(copy: string, name: string) {
  return copy.split("{name}").join(name);
}

/** A once-per-session, client-only introduction that never delays the page render. */
export function WelcomeDialog() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dismissButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (openedInThisDocument || hasSeenWelcome()) return;

    let timer: number | undefined;
    let cancelled = false;

    const showWhenAvailable = () => {
      if (cancelled || openedInThisDocument || hasSeenWelcome()) return;
      const introStillRunning =
        window.location.pathname === "/" &&
        portfolio.settings.showPreloader &&
        !hasCompletedIntro();
      if (introStillRunning || document.querySelector('[role="dialog"][aria-modal="true"]')) {
        timer = window.setTimeout(showWhenAvailable, 250);
        return;
      }

      rememberWelcome();
      setOpen(true);
    };

    timer = window.setTimeout(showWhenAvailable, portfolio.welcome.delayMs);

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const activeElement = document.activeElement;
    returnFocusRef.current = activeElement instanceof HTMLElement ? activeElement : null;
    const releaseScroll = lockDocumentScroll();

    const focusFrame = window.requestAnimationFrame(() => {
      dismissButtonRef.current?.focus();
    });

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0]!;
      const last = focusable.at(-1)!;
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !dialogRef.current?.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !dialogRef.current?.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", trapFocus);
      releaseScroll();
      if (returnFocusRef.current?.isConnected) {
        returnFocusRef.current.focus({ preventScroll: true });
      }
    };
  }, [open]);

  if (!open) return null;

  const { welcome, profile } = portfolio;
  const heading = addName(welcome.heading, profile.name);
  const description = addName(welcome.description, profile.name);

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-dialog-title"
        aria-describedby="welcome-dialog-description"
        data-lenis-prevent
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[34rem] overflow-y-auto border border-foreground/20 bg-card p-6 shadow-2xl shadow-foreground/25 motion-safe:animate-welcome-dialog-in sm:p-8"
      >
        <div className="h-px w-12 bg-primary" aria-hidden />
        <h2
          id="welcome-dialog-title"
          className="mt-5 font-heading text-[clamp(2rem,7vw,3rem)] uppercase leading-[0.95]"
        >
          {heading}
        </h2>
        <p
          id="welcome-dialog-description"
          className="mt-5 max-w-prose leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
        <button
          ref={dismissButtonRef}
          type="button"
          onClick={() => setOpen(false)}
          className="mt-7 inline-flex min-h-11 items-center justify-center bg-primary px-5 py-3 font-heading text-sm uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-offset-3 motion-reduce:transition-none"
        >
          {welcome.dismissLabel}
        </button>
      </div>
    </div>
  );
}
