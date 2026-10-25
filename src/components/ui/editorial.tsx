import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function MaskedHeading({
  lines,
  className,
  as: Tag = "h2",
}: {
  lines: readonly string[];
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag data-mask className={cn("font-display min-w-0 max-w-full", className)}>
      {lines.map((l) => (
        <span key={l} className="line-mask">
          <span className="block">{l}</span>
        </span>
      ))}
    </Tag>
  );
}

export function SectionLabel({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "inverse";
}) {
  return (
    <div
      data-reveal
      className={cn(
        "label-mono flex items-center gap-3",
        tone === "inverse" ? "text-ink-foreground/70" : "text-muted-foreground",
      )}
    >
      <span className="h-px w-10 bg-primary" />
      {children}
    </div>
  );
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || window.matchMedia("(pointer: coarse)").matches) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.25);
      yTo((e.clientY - r.top - r.height / 2) * 0.25);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div ref={ref} className={cn("inline-block", className)}>
      {children}
    </div>
  );
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "inverse";
  external?: boolean;
  download?: boolean;
};
export function EdButton({ href, children, variant = "primary", external, download }: BtnProps) {
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
    outline: "border border-foreground text-foreground hover:bg-foreground hover:text-background",
    inverse:
      "border border-ink-foreground/40 text-ink-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground",
  }[variant];
  return (
    <Magnetic>
      <a
        href={href}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={cn(
          "group inline-flex items-center gap-3 px-6 py-4 font-heading text-sm uppercase tracking-[0.12em] transition-colors duration-300",
          styles,
        )}
      >
        {children}
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
      </a>
    </Magnetic>
  );
}

export function CopyEmail({ email, label }: { email: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* ignore */
        }
      }}
      className="label-mono border-b border-current pb-1 transition-colors hover:text-primary"
      aria-live="polite"
    >
      {copied ? "Copied to clipboard ✓" : label}
    </button>
  );
}
