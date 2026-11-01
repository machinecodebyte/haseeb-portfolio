import { type PointerEvent } from "react";

import { portfolio } from "@/data/portfolio";

const motionQuery = "(prefers-reduced-motion: reduce)";

function resetTilt(target: HTMLElement) {
  target.style.setProperty("--footer-badge-rotate-x", "0deg");
  target.style.setProperty("--footer-badge-rotate-y", "0deg");
  target.style.setProperty("--footer-badge-rotate-z", "0deg");
}

export function FooterLanyardBadge() {
  const { hero, profile, site } = portfolio;
  const [givenName, ...familyName] = profile.name.split(" ");
  const badgeSkills = hero.panelTech.slice(0, 4);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType === "touch" ||
      (typeof window !== "undefined" && window.matchMedia(motionQuery).matches)
    ) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;

    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));

    event.currentTarget.style.setProperty("--footer-badge-rotate-x", `${-y * 5}deg`);
    event.currentTarget.style.setProperty("--footer-badge-rotate-y", `${x * 8}deg`);
    event.currentTarget.style.setProperty("--footer-badge-rotate-z", `${x * 1.5}deg`);
  };

  return (
    <section
      aria-labelledby="footer-lanyard-heading"
      className="footer-lanyard-badge relative mt-12 border-y border-ink-foreground/20 sm:mt-16"
      data-testid="footer-lanyard-badge"
      onPointerLeave={(event) => resetTilt(event.currentTarget)}
      onPointerMove={handlePointerMove}
    >
      <h2 id="footer-lanyard-heading" className="sr-only">
        {profile.name} profile badge
      </h2>

      <div className="footer-lanyard-badge__stage">
        <div className="footer-lanyard-badge__support footer-lanyard-badge__support--left">
          <span>{profile.title}</span>
          <span className="hidden sm:inline">{profile.focus}</span>
        </div>
        <div className="footer-lanyard-badge__support footer-lanyard-badge__support--right">
          <span>{profile.locationShort}</span>
          <span>{site.edition}</span>
        </div>

        <p className="footer-lanyard-badge__name" aria-hidden="true">
          <span>{givenName}</span>
          {familyName.length > 0 && <span>{familyName.join(" ")}</span>}
        </p>

        <svg
          className="footer-lanyard-badge__strap"
          viewBox="0 0 400 280"
          fill="none"
          aria-hidden="true"
        >
          <path d="M62 0C87 58 121 124 199 234" stroke="rgba(255,253,248,0.22)" strokeWidth="22" />
          <path
            d="M338 0C313 58 279 124 201 234"
            stroke="rgba(255,253,248,0.22)"
            strokeWidth="22"
          />
          <path d="M62 0C87 58 121 124 199 234" stroke="#0B0B09" strokeWidth="15" />
          <path d="M338 0C313 58 279 124 201 234" stroke="#0B0B09" strokeWidth="15" />
          <path
            d="M62 0C87 58 121 124 199 234M338 0C313 58 279 124 201 234"
            stroke="rgba(241,90,36,0.58)"
            strokeDasharray="2 8"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <circle cx="200" cy="234" r="17" fill="#D8CBBB" />
          <circle cx="200" cy="234" r="10" fill="#1B1915" />
          <circle cx="200" cy="234" r="4" fill="#F15A24" />
        </svg>

        <div className="footer-lanyard-badge__holder">
          <span className="footer-lanyard-badge__clip" aria-hidden="true">
            <span />
          </span>
          <span
            className="footer-lanyard-badge__punch footer-lanyard-badge__punch--left"
            aria-hidden
          />
          <span
            className="footer-lanyard-badge__punch footer-lanyard-badge__punch--right"
            aria-hidden
          />
          <div className="footer-lanyard-badge__reflection" aria-hidden />

          <article className="footer-lanyard-badge__card">
            <div className="footer-lanyard-badge__card-header">
              <span className="font-display text-[1.7rem] leading-none tracking-[-0.07em]">
                {site.monogram.slice(0, -1)}
                <span className="text-primary">{site.monogram.slice(-1)}</span>
              </span>
              <span className="label-mono text-[0.5rem] text-muted-foreground">Portfolio ID</span>
            </div>

            <div className="footer-lanyard-badge__portrait" aria-hidden="true">
              <span>
                {profile.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>

            <div className="mt-4 border-b border-border pb-4">
              <p className="label-mono text-[0.52rem] text-muted-foreground">Software engineer</p>
              <h3 className="mt-1 font-heading text-[clamp(1.7rem,3.3vw,2.2rem)] uppercase leading-[0.88]">
                {profile.name}
              </h3>
              <p className="mt-2 max-w-[14rem] text-[0.72rem] leading-snug text-forest">
                {profile.title}
              </p>
            </div>

            <dl className="mt-4 space-y-3">
              <div>
                <dt className="label-mono text-[0.5rem] text-muted-foreground">Based in</dt>
                <dd className="mt-1 text-[0.72rem] font-medium">{profile.locationShort}</dd>
              </div>
              <div>
                <dt className="label-mono text-[0.5rem] text-muted-foreground">Toolkit</dt>
                <dd className="mt-1 text-[0.64rem] leading-relaxed text-foreground/80">
                  {badgeSkills.join(" / ")}
                </dd>
              </div>
            </dl>

            {profile.availability.show && (
              <p className="footer-lanyard-badge__availability">
                <span aria-hidden />
                {profile.availability.label}
              </p>
            )}
            <div className="footer-lanyard-badge__barcode" aria-hidden="true" />
          </article>
        </div>
      </div>
    </section>
  );
}
