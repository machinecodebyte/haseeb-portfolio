import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowDown } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { gsap, loadScrollTrigger, prefersReducedMotion } from "@/lib/animations";
import { countDecodableCharacters, decodeText } from "@/lib/continuous-decode";
import { hasCompletedIntro, introCompleteEvent, introReadyEvent, isIntroReady } from "@/lib/intro";
import { EdButton } from "@/components/ui/editorial";
import { cn } from "@/lib/utils";

const HERO_DECODE_TIMING = {
  eyebrow: {
    initialDelayMs: 80,
    decodeStepMs: 38,
    readableHoldMs: 1400,
    resetStepMs: 18,
    cycleDelayMs: 180,
  },
  edition: {
    initialDelayMs: 240,
    decodeStepMs: 110,
    readableHoldMs: 1320,
    resetStepMs: 60,
    cycleDelayMs: 280,
  },
} as const;

type DecodeTiming = (typeof HERO_DECODE_TIMING)[keyof typeof HERO_DECODE_TIMING];

function DecodingText({
  text,
  active,
  timing,
}: {
  text: string;
  active: boolean;
  timing: DecodeTiming;
}) {
  const maskedText = decodeText(text, 0);
  const [displayText, setDisplayText] = useState(text);
  const isLooping = useRef(false);
  const visualText = active ? (isLooping.current ? displayText : maskedText) : text;

  useEffect(() => {
    if (!active) {
      isLooping.current = false;
      setDisplayText(text);
      return;
    }

    let timer: number | undefined;
    let cancelled = false;
    const characterCount = countDecodableCharacters(text);

    const schedule = (callback: () => void, delay: number) => {
      timer = window.setTimeout(() => {
        timer = undefined;
        if (!cancelled) callback();
      }, delay);
    };

    const reveal = (decodedCharacters: number) => {
      setDisplayText(decodeText(text, decodedCharacters));
      if (decodedCharacters < characterCount) {
        schedule(() => reveal(decodedCharacters + 1), timing.decodeStepMs);
        return;
      }
      schedule(() => reset(characterCount - 1), timing.readableHoldMs);
    };

    const reset = (decodedCharacters: number) => {
      setDisplayText(decodeText(text, decodedCharacters));
      if (decodedCharacters > 0) {
        schedule(() => reset(decodedCharacters - 1), timing.resetStepMs);
        return;
      }
      schedule(() => reveal(1), timing.cycleDelayMs);
    };

    isLooping.current = true;
    setDisplayText(maskedText);

    if (characterCount > 0) schedule(() => reveal(1), timing.initialDelayMs);

    return () => {
      cancelled = true;
      isLooping.current = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [active, maskedText, text, timing]);

  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{visualText}</span>
    </span>
  );
}

function useHeroDecodeActive(heroRef: RefObject<HTMLElement | null>) {
  const [introComplete, setIntroComplete] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!portfolio.settings.showPreloader) {
      setIntroComplete(true);
      return;
    }

    const complete = () => {
      setIntroComplete(true);
      window.removeEventListener(introCompleteEvent, complete);
    };

    window.addEventListener(introCompleteEvent, complete);
    if (hasCompletedIntro()) complete();

    return () => window.removeEventListener(introCompleteEvent, complete);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    if (!("IntersectionObserver" in window)) {
      setHeroVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry?.isIntersecting ?? false),
      { threshold: 0.01 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroRef]);

  useEffect(() => {
    const updatePageVisibility = () => setPageVisible(document.visibilityState === "visible");
    updatePageVisibility();
    document.addEventListener("visibilitychange", updatePageVisibility);
    return () => document.removeEventListener("visibilitychange", updatePageVisibility);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches);
    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);
    return () => mediaQuery.removeEventListener("change", updateReducedMotion);
  }, []);

  return introComplete && heroVisible && pageVisible && !reducedMotion;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const { hero, profile, socialLinks, site } = portfolio;
  const decodeActive = useHeroDecodeActive(ref);
  const editionNumber = site.edition.match(/\d+$/)?.[0] ?? "";

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    let parallax: gsap.core.Tween | undefined;
    let cancelled = false;

    const initialiseParallax = () => {
      void loadScrollTrigger()
        .then(() => {
          if (cancelled || !ref.current) return;
          parallax = gsap.to(".h-mono", {
            yPercent: 25,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        })
        .catch(() => {
          // The static hero remains fully usable when this optional enhancement is unavailable.
        });
    };

    const initialiseParallaxOnScroll = () => {
      if (window.scrollY > 0) {
        initialiseParallax();
        return;
      }
      window.addEventListener("scroll", initialiseParallax, { once: true, passive: true });
    };

    const play = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".h-line > span", { yPercent: 115, duration: 1.2, stagger: 0.1 })
          .from(".h-meta", { y: 24, opacity: 0, stagger: 0.07, duration: 0.8 }, "-=0.8")
          .fromTo(
            ".h-underline",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
            "-=0.6",
          )
          .from(".h-panel", { y: 40, opacity: 0, duration: 1 }, "-=1");
      }, ref);
    };
    if (isIntroReady() || !portfolio.settings.showPreloader) play();
    else window.addEventListener(introReadyEvent, play, { once: true });

    if (hasCompletedIntro()) initialiseParallaxOnScroll();
    else window.addEventListener(introCompleteEvent, initialiseParallaxOnScroll, { once: true });

    const el = orb.current;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const xTo = el && gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" });
    const yTo = el && gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      if (xTo && yTo) {
        xTo((e.clientX / innerWidth - 0.5) * 40);
        yTo((e.clientY / innerHeight - 0.5) * 40);
      }
    };
    if (fine) window.addEventListener("pointermove", move);
    return () => {
      cancelled = true;
      ctx?.revert();
      parallax?.kill();
      window.removeEventListener(introReadyEvent, play);
      window.removeEventListener(introCompleteEvent, initialiseParallaxOnScroll);
      window.removeEventListener("scroll", initialiseParallax);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <section ref={ref} id="home" className="relative overflow-hidden pt-36 pb-12 paper-grain">
      <div
        className="h-mono pointer-events-none absolute -right-8 top-24 font-display text-[38vw] leading-none text-foreground/[0.04] select-none"
        aria-hidden
      >
        {site.monogram}
      </div>
      <div className="container-ed relative">
        <div className="h-meta label-mono flex flex-wrap items-center justify-between gap-3 border-b pb-4 text-muted-foreground">
          <DecodingText
            text={hero.eyebrow}
            active={decodeActive}
            timing={HERO_DECODE_TIMING.eyebrow}
          />
          <span>
            №{" "}
            <DecodingText
              text={editionNumber}
              active={decodeActive}
              timing={HERO_DECODE_TIMING.edition}
            />{" "}
            — {profile.locationShort}
          </span>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="font-display text-[clamp(2.8rem,7vw,7.4rem)]">
              {hero.headline.map((w) => (
                <span key={w} className="h-line line-mask">
                  <span className={cn("block", w === hero.accentWord && "text-primary")}>{w}</span>
                </span>
              ))}
              <span className="h-line line-mask">
                <span className="relative inline-block font-heading text-[0.42em] font-medium normal-case tracking-tight text-primary">
                  {hero.headlineEnd}
                  <span className="h-underline absolute -bottom-1 left-0 h-[3px] w-full origin-left bg-foreground" />
                </span>
              </span>
            </h1>
          </div>

          <aside
            className="h-panel self-end border bg-card lg:col-span-4"
            aria-label="Profile summary"
          >
            <div className="flex items-center justify-between border-b px-5 py-3">
              <span className="label-mono text-muted-foreground">profile.ts</span>
              <span className="flex gap-1.5">
                <i className="size-2 rounded-full bg-primary" />
                <i className="size-2 rounded-full bg-border" />
                <i className="size-2 rounded-full bg-border" />
              </span>
            </div>
            <div className="relative space-y-4 p-5">
              <div ref={orb} className="absolute right-5 top-5 size-16" aria-hidden>
                <div className="absolute inset-0 rounded-full border border-foreground/30" />
                <div className="absolute inset-3 rounded-full border border-primary" />
                <div className="absolute inset-[26px] rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-heading text-2xl uppercase">{profile.name}</p>
                <p className="text-sm text-muted-foreground">{profile.title}</p>
              </div>
              <dl className="space-y-2 font-mono text-xs">
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">location:</dt>
                  <dd>"{profile.locationShort}"</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">stack:</dt>
                  <dd className="text-forest">
                    [{hero.panelTech.map((t) => `"${t}"`).join(", ")}]
                  </dd>
                </div>
              </dl>
              {profile.availability.show && (
                <p className="label-mono inline-flex items-center gap-2 bg-forest px-3 py-1.5 text-forest-foreground">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse-dot" />
                  {profile.availability.label}
                </p>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-12 grid gap-8 border-t pt-8 lg:grid-cols-12">
          <p className="h-meta max-w-xl text-lg leading-relaxed lg:col-span-6">{hero.intro}</p>
          <p className="h-meta font-marker text-2xl text-primary -rotate-2 lg:col-span-3">
            {hero.annotation}
          </p>
          <div className="h-meta flex flex-wrap items-start gap-3 lg:col-span-12">
            <EdButton href="#work">{hero.ctaPrimary}</EdButton>
            <EdButton href="#contact" variant="outline">
              {hero.ctaSecondary}
            </EdButton>
            {profile.resumeUrl && (
              <EdButton href={profile.resumeUrl} download variant="outline">
                {profile.resumeDownloadLabel}
              </EdButton>
            )}
            <div className="label-mono ml-auto flex items-center gap-6 self-center">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  GitHub ↗
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  LinkedIn ↗
                </a>
              )}
              <a href="#about" className="hidden items-center gap-2 text-muted-foreground md:flex">
                Scroll <ArrowDown className="size-3 animate-bounce" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  if (!portfolio.settings.showMarquee) return null;
  const items = [...portfolio.marquee, ...portfolio.marquee];
  return (
    <div
      className="group overflow-hidden border-y border-foreground bg-primary py-4 text-primary-foreground"
      aria-hidden
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {items.map((m, i) => (
              <span key={i} className="flex items-center font-display text-3xl md:text-5xl">
                <span className="px-6">{m}</span>
                <span className="text-foreground">×</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
