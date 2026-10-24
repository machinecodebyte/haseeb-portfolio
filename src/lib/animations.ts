import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { hasCompletedIntro, introCompleteEvent } from "@/lib/intro";

type ScrollTriggerPlugin = (typeof import("gsap/ScrollTrigger"))["ScrollTrigger"];

let scrollTriggerPromise: Promise<ScrollTriggerPlugin> | undefined;

export function loadScrollTrigger() {
  if (!scrollTriggerPromise) {
    scrollTriggerPromise = import("gsap/ScrollTrigger")
      .then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        return ScrollTrigger;
      })
      .catch((error: unknown) => {
        scrollTriggerPromise = undefined;
        throw error;
      });
  }

  return scrollTriggerPromise;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Reveals every [data-reveal] (fade-up) and [data-mask] (line mask) inside scope on scroll. */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;

    let ctx: gsap.Context | undefined;
    let observer: IntersectionObserver | undefined;
    let cancelled = false;
    let loading = false;

    const initialise = () => {
      if (cancelled || ctx || loading) return;
      loading = true;
      void loadScrollTrigger()
        .then(() => {
          if (cancelled) return;
          observer?.disconnect();
          ctx = gsap.context(() => {
            gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((el) => {
              gsap.from(el.querySelectorAll(":scope > span > span"), {
                yPercent: 110,
                duration: 1.1,
                ease: "power4.out",
                stagger: 0.08,
                scrollTrigger: { trigger: el, start: "top 85%" },
              });
            });
            gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
              gsap.from(el, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%" },
              });
            });
          }, root);
        })
        .catch(() => {
          loading = false;
        });
    };

    const initialiseWhenNearby = () => {
      if (
        !("IntersectionObserver" in window) ||
        root.getBoundingClientRect().top <= innerHeight * 2
      ) {
        initialise();
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) initialise();
        },
        { rootMargin: "100% 0px" },
      );
      observer.observe(root);
    };

    const waitForHomeIntro = window.location.pathname === "/" && !hasCompletedIntro();
    if (waitForHomeIntro) {
      window.addEventListener(introCompleteEvent, initialiseWhenNearby, { once: true });
    } else {
      initialiseWhenNearby();
    }

    return () => {
      cancelled = true;
      window.removeEventListener(introCompleteEvent, initialiseWhenNearby);
      observer?.disconnect();
      ctx?.revert();
    };
  }, [scope]);
}

export { gsap };
