import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUp, ArrowUpRight, Menu, X } from "lucide-react";
import Lenis from "lenis";
import { portfolio } from "@/data/portfolio";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/animations";
import {
  completeIntro,
  hasCompletedIntro,
  hasStartedIntro,
  introCompleteEvent,
  signalIntroReady,
  startIntro,
} from "@/lib/intro";
import { cn } from "@/lib/utils";

export function SmoothScroll({
  lockUntilIntroComplete = false,
}: {
  lockUntilIntroComplete?: boolean;
}) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1 });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const resume = () => {
      lenis.start();
      gsap.ticker.lagSmoothing(0);
    };
    const isIntroActive =
      lockUntilIntroComplete &&
      portfolio.settings.showPreloader &&
      !hasStartedIntro() &&
      !hasCompletedIntro();
    if (isIntroActive) {
      gsap.ticker.lagSmoothing(500, 33);
      lenis.stop();
      window.addEventListener(introCompleteEvent, resume, { once: true });
    } else {
      gsap.ticker.lagSmoothing(0);
    }
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener(introCompleteEvent, resume);
      if (isIntroActive && !hasCompletedIntro()) gsap.ticker.lagSmoothing(0);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [lockUntilIntroComplete]);
  return null;
}

export function Preloader() {
  const [done, setDone] = useState(() => hasCompletedIntro() || hasStartedIntro());
  const ref = useRef<HTMLDivElement>(null);
  const ownsIntro = useRef(false);
  const [givenName, ...familyName] = portfolio.profile.name.split(" ");
  useEffect(() => {
    const finish = () => {
      completeIntro();
      setDone(true);
    };

    if (
      !portfolio.settings.showPreloader ||
      hasCompletedIntro() ||
      (hasStartedIntro() && !ownsIntro.current) ||
      prefersReducedMotion()
    ) {
      signalIntroReady();
      finish();
      return;
    }

    const overlay = ref.current;
    if (!overlay) {
      signalIntroReady();
      finish();
      return;
    }

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const restoreScroll = () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    let completed = false;
    let frame = 0;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          completed = true;
          restoreScroll();
          finish();
        },
      });

      tl.set(".pl-label", { autoAlpha: 0, y: 10 })
        .set(".pl-ed", { autoAlpha: 0, y: 8 })
        .set(".pl-bar", { scaleX: 0 })
        .set(".pl-name", { autoAlpha: 0, xPercent: -125 })
        .set(".pl-subtitle", { autoAlpha: 0, y: 10 })
        .addLabel("intro")
        .to(".pl-label", { autoAlpha: 1, y: 0, duration: 0.3 }, "intro")
        .to(".pl-bar", { scaleX: 1, duration: 0.65, ease: "power2.inOut" }, "intro+=0.05")
        .to(
          ".pl-name",
          { autoAlpha: 1, xPercent: 0, duration: 1.05, ease: "power4.out" },
          "intro+=0.2",
        )
        .to(
          ".pl-subtitle",
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" },
          "intro+=0.9",
        )
        .to(".pl-ed", { autoAlpha: 1, y: 0, duration: 0.3 }, "intro+=1.15")
        .to({}, { duration: 0.55 })
        .to(overlay, { yPercent: -100, duration: 0.8, ease: "power4.inOut" });

      frame = window.requestAnimationFrame(() => {
        ownsIntro.current = true;
        startIntro();
        signalIntroReady();
        tl.play();
      });
    }, overlay);

    return () => {
      window.cancelAnimationFrame(frame);
      ctx.revert();
      if (!completed) restoreScroll();
    };
  }, []);
  if (done) return null;
  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-background p-6 md:p-10 paper-grain"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        minHeight: "100dvh",
        backgroundColor: "#F7F2E8",
      }}
      aria-hidden
    >
      <div
        className="pl-label invisible label-mono flex justify-between"
        style={{ visibility: "hidden" }}
      >
        <span>Initializing portfolio</span>
        <span>{portfolio.site.year}</span>
      </div>
      <div className="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 sm:inset-x-6">
        <div className="overflow-hidden px-1">
          <div
            className="pl-name invisible whitespace-nowrap text-center font-display text-[clamp(1.35rem,6.7vw,2rem)] leading-[0.88] sm:text-[clamp(2rem,8.3vw,9rem)]"
            style={{ visibility: "hidden" }}
          >
            {givenName}
            {familyName.length > 0 && <span className="text-primary"> {familyName.join(" ")}</span>}
          </div>
        </div>
        <p
          className="pl-subtitle invisible label-mono mt-5 text-center text-[0.6rem] tracking-[0.22em] text-muted-foreground sm:mt-6 sm:text-[0.7rem] sm:tracking-[0.28em]"
          style={{ visibility: "hidden" }}
        >
          {portfolio.profile.title}
        </p>
      </div>
      <div>
        <div
          className="pl-bar h-px origin-left scale-x-0 bg-foreground"
          style={{ transform: "scaleX(0)" }}
        />
        <div
          className="pl-ed invisible label-mono mt-3 flex justify-between"
          style={{ visibility: "hidden" }}
        >
          <span>The Engineer's Edition</span>
          <span>{portfolio.site.edition}</span>
        </div>
      </div>
    </div>
  );
}

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const activePath = pathname.startsWith("/projects/") ? "/work" : pathname;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setCompact(y > 40);
      setHidden(y > 300 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", key);
    menuRef.current?.querySelector("a")?.focus();
    if (!prefersReducedMotion())
      gsap.from(".m-link", {
        yPercent: 100,
        opacity: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: "power3.out",
      });
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500",
          hidden && !open && "-translate-y-full",
        )}
      >
        <div className="bg-foreground text-background">
          <div className="container-ed label-mono flex h-8 items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary animate-pulse-dot" />
              {portfolio.hero.status}
            </span>
            <span className="hidden sm:inline">
              {portfolio.site.title} — {portfolio.site.edition}
            </span>
          </div>
        </div>
        <nav
          aria-label="Primary"
          className={cn(
            "border-b bg-background/90 backdrop-blur transition-all",
            compact ? "py-2" : "py-4",
          )}
        >
          <div className="container-ed flex items-center justify-between gap-6">
            <Link to="/" className="flex items-baseline gap-3">
              <span className="font-display text-2xl">
                {portfolio.site.monogram.slice(0, -1)}
                <span className="text-primary">.</span>
              </span>
              <span className="label-mono hidden text-muted-foreground md:inline">
                Portfolio / {portfolio.site.year}
              </span>
            </Link>
            <ul className="hidden items-center gap-5 xl:flex">
              {portfolio.navigation.map((n, i) => (
                <li key={n.href}>
                  <Link
                    to={n.href}
                    preload={false}
                    className={cn(
                      "group relative font-heading text-sm uppercase tracking-[0.1em] transition-colors hover:text-primary",
                      activePath === n.href && "text-primary",
                    )}
                  >
                    <span className="label-mono mr-1 text-[0.6rem] text-muted-foreground">
                      0{i + 1}
                    </span>
                    {n.label}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300",
                        activePath === n.href ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              preload={false}
              className="hidden bg-foreground px-4 py-2 font-heading text-sm uppercase tracking-[0.1em] text-background transition-colors hover:bg-primary xl:inline-block"
            >
              Let's talk
            </Link>
            <button
              className="xl:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </nav>
      </header>
      {open && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-ink p-6 text-ink-foreground"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl">
              HA<span className="text-primary">.</span>
            </span>
            <button aria-label="Close menu" onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>
          <ul className="mt-12 space-y-2">
            {portfolio.navigation.map((n, i) => (
              <li key={n.href} className="overflow-hidden">
                <Link
                  onClick={() => setOpen(false)}
                  to={n.href}
                  preload={false}
                  className="m-link flex items-baseline gap-4 font-display text-5xl hover:text-primary"
                >
                  <span className="label-mono text-ink-foreground/50">0{i + 1}</span>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="label-mono mt-auto text-ink-foreground/60">{portfolio.profile.email}</div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const { site, footer, socialLinks, profile } = portfolio;
  return (
    <footer className="relative overflow-hidden bg-ink text-ink-foreground">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent"
        aria-hidden
      />
      <div className="container-ed relative py-16 sm:py-20 lg:py-24">
        <div
          className="pointer-events-none absolute -right-[0.08em] top-10 select-none font-display text-[clamp(11rem,27vw,25rem)] leading-none text-ink-foreground/[0.035]"
          aria-hidden
        >
          {site.monogram}
        </div>

        <div className="relative border-t border-ink-foreground/20 pt-7 sm:pt-9">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,1.1fr)] lg:gap-20">
            <div className="flex min-h-full flex-col justify-between gap-10">
              <div>
                <div className="font-display text-[clamp(7.25rem,18vw,16rem)] leading-[0.72] tracking-[-0.06em]">
                  {site.monogram.slice(0, -1)}
                  <span className="text-primary">{site.monogram.slice(-1)}</span>
                </div>
                <p className="label-mono mt-8 max-w-sm text-ink-foreground sm:mt-10">
                  {footer.note}
                </p>
              </div>

              <p className="label-mono max-w-xs leading-relaxed text-ink-foreground/55">
                {footer.colophon}
              </p>
            </div>

            <nav aria-label="Social and contact links" className="self-end">
              <div className="border-b border-ink-foreground/20">
                {socialLinks.github && (
                  <a
                    className="group relative grid min-h-18 grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-center gap-3 overflow-hidden border-t border-ink-foreground/20 px-1 py-4 transition-colors duration-300 hover:bg-ink-foreground/[0.045] focus-visible:outline-offset-[-3px] motion-reduce:transition-none"
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span
                      className="absolute inset-x-0 bottom-0 h-px w-0 bg-primary transition-[width] duration-500 motion-safe:group-hover:w-full motion-reduce:transition-none"
                      aria-hidden
                    />
                    <span className="label-mono relative text-[0.6rem] text-ink-foreground/50">
                      01
                    </span>
                    <span className="relative font-heading text-[clamp(1.5rem,2.6vw,2.2rem)] uppercase leading-none tracking-[0.06em] transition-transform duration-300 motion-safe:group-hover:translate-x-1.5 motion-reduce:transition-none">
                      GitHub
                    </span>
                    <ArrowUpRight
                      className="relative size-5 transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    className="group relative grid min-h-18 grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-center gap-3 overflow-hidden border-t border-ink-foreground/20 px-1 py-4 transition-colors duration-300 hover:bg-ink-foreground/[0.045] focus-visible:outline-offset-[-3px] motion-reduce:transition-none"
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span
                      className="absolute inset-x-0 bottom-0 h-px w-0 bg-primary transition-[width] duration-500 motion-safe:group-hover:w-full motion-reduce:transition-none"
                      aria-hidden
                    />
                    <span className="label-mono relative text-[0.6rem] text-ink-foreground/50">
                      02
                    </span>
                    <span className="relative font-heading text-[clamp(1.5rem,2.6vw,2.2rem)] uppercase leading-none tracking-[0.06em] transition-transform duration-300 motion-safe:group-hover:translate-x-1.5 motion-reduce:transition-none">
                      LinkedIn
                    </span>
                    <ArrowUpRight
                      className="relative size-5 transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </a>
                )}
                <a
                  className="group relative grid min-h-18 grid-cols-[2.5rem_minmax(0,1fr)_1.5rem] items-center gap-3 overflow-hidden border-t border-ink-foreground/20 px-1 py-4 transition-colors duration-300 hover:bg-ink-foreground/[0.045] focus-visible:outline-offset-[-3px] motion-reduce:transition-none"
                  href={`mailto:${profile.email}`}
                >
                  <span
                    className="absolute inset-x-0 bottom-0 h-px w-0 bg-primary transition-[width] duration-500 motion-safe:group-hover:w-full motion-reduce:transition-none"
                    aria-hidden
                  />
                  <span className="label-mono relative text-[0.6rem] text-ink-foreground/50">
                    03
                  </span>
                  <span className="relative font-heading text-[clamp(1.5rem,2.6vw,2.2rem)] uppercase leading-none tracking-[0.06em] transition-transform duration-300 motion-safe:group-hover:translate-x-1.5 motion-reduce:transition-none">
                    Email
                  </span>
                  <ArrowUpRight
                    className="relative size-5 transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </a>
              </div>
            </nav>
          </div>

          <div className="mt-14 flex items-center justify-between gap-6 border-t border-ink-foreground/20 pt-5 sm:mt-16">
            <span className="label-mono text-[0.6rem] text-ink-foreground/55 sm:text-[0.7rem]">
              © {site.year} {site.name}
            </span>
            <button
              type="button"
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex size-11 shrink-0 items-center justify-center border border-ink-foreground/40 text-ink-foreground transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-offset-[-3px] motion-reduce:transition-none sm:size-auto sm:gap-3 sm:px-3"
            >
              <span className="label-mono hidden text-[0.6rem] sm:inline">Back to top</span>
              <ArrowUp
                className="size-4 transition-transform duration-300 motion-safe:group-hover:-translate-y-1 motion-reduce:transition-none"
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
