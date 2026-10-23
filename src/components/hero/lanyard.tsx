import { useEffect, useState, type ComponentType } from "react";

import { prefersReducedMotion } from "@/lib/animations";

import type { LanyardBadgeData } from "./lanyard-types";

type LanyardCanvas = ComponentType<{ badge: LanyardBadgeData }>;

const isLocalPortrait = (url: string | undefined) => Boolean(url?.startsWith("/"));

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function supportsWebGL() {
  if (
    typeof window === "undefined" ||
    (!("WebGLRenderingContext" in window) && !("WebGL2RenderingContext" in window))
  ) {
    return false;
  }

  const canvas = document.createElement("canvas");

  try {
    const context =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });

    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function BadgeAvatar({ badge }: { badge: LanyardBadgeData }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (isLocalPortrait(badge.photoUrl) && !imageFailed) {
    return (
      <img
        src={badge.photoUrl}
        alt={`Portrait of ${badge.name}`}
        className="size-full object-cover"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <span className="flex size-full items-center justify-center bg-ink font-display text-3xl text-ink-foreground">
      {initials(badge.name)}
    </span>
  );
}

export function LanyardFallback({ badge }: { badge: LanyardBadgeData }) {
  return (
    <div
      className="relative mx-auto h-full w-full max-w-sm overflow-visible"
      data-testid="lanyard-fallback"
    >
      <div
        className="absolute left-1/2 top-5 z-10 size-5 -translate-x-1/2 rounded-full border-[3px] border-ink bg-primary shadow-[0_3px_0_color-mix(in_oklab,var(--foreground)_30%,transparent)]"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-8 h-36 w-7 -translate-x-1/2 bg-forest shadow-[inset_2px_0_0_color-mix(in_oklab,var(--foreground)_18%,transparent),inset_-2px_0_0_color-mix(in_oklab,var(--paper)_26%,transparent)]"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-[9.25rem] h-10 w-16 -translate-x-1/2 rounded-b-md border-x border-b border-foreground/35 bg-muted shadow-[0_4px_8px_color-mix(in_oklab,var(--foreground)_20%,transparent)]"
        aria-hidden
      />
      <div className="absolute left-1/2 top-[11rem] w-[min(18.5rem,calc(100%-1.5rem))] -translate-x-1/2 border bg-card p-4 shadow-[10px_12px_0_color-mix(in_oklab,var(--foreground)_10%,transparent)]">
        <div className="flex items-start gap-3 border-b border-border pb-3">
          <div className="size-16 shrink-0 overflow-hidden border border-foreground/30 bg-ink">
            <BadgeAvatar badge={badge} />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-2xl leading-none uppercase">{badge.name}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{badge.title}</p>
          </div>
        </div>
        <dl className="mt-3 space-y-2 font-mono text-[0.62rem] leading-relaxed">
          <div className="flex gap-2">
            <dt className="shrink-0 text-muted-foreground">location:</dt>
            <dd>{badge.location}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">stack:</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5 text-forest">
              {badge.technologies.map((technology) => (
                <span key={technology} className="border border-forest/25 px-1.5 py-0.5">
                  {technology}
                </span>
              ))}
            </dd>
          </div>
        </dl>
        {badge.availability && (
          <p className="label-mono mt-3 inline-flex items-center gap-2 bg-forest px-2.5 py-1.5 text-[0.58rem] text-forest-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {badge.availability}
          </p>
        )}
      </div>
    </div>
  );
}

function AccessibleBadgeData({ badge }: { badge: LanyardBadgeData }) {
  return (
    <div className="sr-only">
      <p>{badge.name}</p>
      <p>{badge.title}</p>
      <p>Location: {badge.location}</p>
      <p>Technology stack: {badge.technologies.join(", ")}</p>
      {badge.availability && <p>Availability: {badge.availability}</p>}
    </div>
  );
}

export function LanyardBadge({ badge }: { badge: LanyardBadgeData }) {
  const [CanvasLanyard, setCanvasLanyard] = useState<LanyardCanvas | null>(null);

  useEffect(() => {
    let cancelled = false;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const loadCanvas = () => {
      if (mediaQuery.matches || prefersReducedMotion() || !supportsWebGL()) {
        setCanvasLanyard(null);
        return;
      }

      void import("./lanyard-canvas")
        .then(({ default: LanyardCanvas }) => {
          if (!cancelled && !mediaQuery.matches) setCanvasLanyard(() => LanyardCanvas);
        })
        .catch(() => {
          if (!cancelled) setCanvasLanyard(null);
        });
    };

    loadCanvas();
    mediaQuery.addEventListener("change", loadCanvas);

    return () => {
      cancelled = true;
      mediaQuery.removeEventListener("change", loadCanvas);
    };
  }, []);

  return (
    <div className="relative h-[30rem] w-full sm:h-[33rem]">
      {CanvasLanyard ? <CanvasLanyard badge={badge} /> : <LanyardFallback badge={badge} />}
      {CanvasLanyard && <AccessibleBadgeData badge={badge} />}
    </div>
  );
}
