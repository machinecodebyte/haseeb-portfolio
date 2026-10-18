import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUp, Menu, X } from "lucide-react";
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
import { EdButton } from "@/components/ui/editorial";

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

export function Nav({ home = true }: { home?: boolean }) {
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setCompact(y > 40);
      setHidden(y > 300 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive("#" + e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    portfolio.navigation.forEach((n) => {
      const el = document.querySelector(n.href);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
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

  const href = (h: string) => (home ? h : "/" + h);

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
            <ul className="hidden items-center gap-7 lg:flex">
              {portfolio.navigation.map((n, i) => (
                <li key={n.href}>
                  <a
                    href={href(n.href)}
                    className={cn(
                      "group relative font-heading text-sm uppercase tracking-[0.1em] transition-colors hover:text-primary",
                      active === n.href && "text-primary",
                    )}
                  >
                    <span className="label-mono mr-1 text-[0.6rem] text-muted-foreground">
                      0{i + 1}
                    </span>
                    {n.label}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300",
                        active === n.href ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={href("#contact")}
              className="hidden bg-foreground px-4 py-2 font-heading text-sm uppercase tracking-[0.1em] text-background transition-colors hover:bg-primary lg:inline-block"
            >
              Let's talk
            </a>
            <button
              className="lg:hidden"
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
                <a
                  onClick={() => setOpen(false)}
                  href={href(n.href)}
                  className="m-link flex items-baseline gap-4 font-display text-5xl hover:text-primary"
                >
                  <span className="label-mono text-ink-foreground/50">0{i + 1}</span>
                  {n.label}
                </a>
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
    <footer className="bg-ink text-ink-foreground">
      <div className="container-ed py-12">
        <div
          className="font-display text-[22vw] leading-[0.8] text-ink-foreground/10 select-none"
          aria-hidden
        >
          {site.monogram}
        </div>
        <div className="mt-8 grid gap-6 border-t border-ink-foreground/20 pt-6 md:grid-cols-4">
          <p className="label-mono">{footer.note}</p>
          <p className="label-mono text-ink-foreground/60">{footer.colophon}</p>
          <div className="label-mono flex flex-wrap gap-5">
            {socialLinks.github && (
              <a
                className="hover:text-primary"
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                className="hover:text-primary"
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            )}
            <a className="hover:text-primary" href={`mailto:${profile.email}`}>
              Email
            </a>
            {profile.resumeUrl && (
              <EdButton href={profile.resumeUrl} download variant="inverse">
                {profile.resumeDownloadLabel}
              </EdButton>
            )}
          </div>
          <div className="flex justify-between md:justify-end gap-6">
            <span className="label-mono text-ink-foreground/60">
              © {site.year} {site.name}
            </span>
            <button
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="grid size-10 place-items-center border border-ink-foreground/40 transition-colors hover:border-primary hover:bg-primary"
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
