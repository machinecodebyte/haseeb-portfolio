import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { Instagram, MessageCircle, Phone } from "lucide-react";

import { portfolio } from "@/data/portfolio";

type FloatingLinkProps = {
  href: string;
  label: string;
  side: "left" | "right";
  tone: "paper" | "forest";
  icon: ReactNode;
  obscured: boolean;
};

function FloatingLink({ href, label, side, tone, icon, obscured }: FloatingLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      aria-hidden={obscured || undefined}
      tabIndex={obscured ? -1 : undefined}
      className={[
        "fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-medium shadow-lg shadow-foreground/15 transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-offset-2 motion-reduce:transform-none motion-reduce:transition-none sm:bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-4",
        obscured && "pointer-events-none invisible",
        side === "left"
          ? "left-[max(0.75rem,env(safe-area-inset-left))] sm:left-[max(1.25rem,env(safe-area-inset-left))]"
          : "right-[max(0.75rem,env(safe-area-inset-right))] sm:right-[max(1.25rem,env(safe-area-inset-right))]",
        tone === "paper"
          ? "border-foreground/20 bg-card/95 text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
          : "border-forest bg-forest text-forest-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground",
      ].join(" ")}
    >
      {icon}
      <span className="max-[359px]:sr-only">{label}</span>
    </a>
  );
}

/**
 * Site-wide social CTAs. They intentionally render only after the owner has
 * supplied verified destinations in the central portfolio data.
 */
export function FloatingSocialLinks() {
  const { instagram, whatsapp } = portfolio.socialLinks;
  const { pathname } = useLocation();
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    if (!instagram && !whatsapp) return;

    const footer = document.querySelector("footer");
    if (!footer) {
      setFooterVisible(false);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const update = () => {
        const bounds = footer.getBoundingClientRect();
        setFooterVisible(bounds.top < window.innerHeight && bounds.bottom > 0);
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }

    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry?.isIntersecting ?? false);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, [instagram, whatsapp, pathname]);

  if (!instagram && !whatsapp) return null;

  return (
    <>
      {instagram && (
        <FloatingLink
          href={instagram}
          label="Instagram"
          side="left"
          tone="paper"
          icon={<Instagram className="size-4 shrink-0" aria-hidden />}
          obscured={footerVisible}
        />
      )}
      {whatsapp && (
        <FloatingLink
          href={whatsapp}
          label="WhatsApp"
          side="right"
          tone="forest"
          icon={
            <span className="relative size-4 shrink-0" aria-hidden>
              <MessageCircle className="size-full" />
              <Phone className="absolute left-1 top-[3px] size-2" strokeWidth={2.5} />
            </span>
          }
          obscured={footerVisible}
        />
      )}
    </>
  );
}
