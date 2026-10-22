import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import { portfolio, type Project } from "@/data/portfolio";
import { gsap, prefersReducedMotion, useReveal } from "@/lib/animations";
import { CopyEmail, EdButton, MaskedHeading, SectionLabel } from "@/components/ui/editorial";
import { ProjectArt } from "@/components/projects/ProjectArt";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SectionHeadingTag = "h1" | "h2";

/* ---------- ABOUT ---------- */
export function About({ headingAs = "h2" }: { headingAs?: SectionHeadingTag } = {}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const { about } = portfolio;
  return (
    <section ref={ref} id="about" className="container-ed py-28">
      <SectionLabel>{about.label}</SectionLabel>
      <div className="mt-8 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MaskedHeading
            as={headingAs}
            lines={about.heading}
            className="text-[clamp(2.6rem,6vw,5.5rem)]"
          />
          <blockquote
            data-reveal
            className="mt-12 border-l-4 border-primary pl-6 font-heading text-3xl uppercase leading-tight md:text-4xl"
          >
            “{about.statement}”
          </blockquote>
        </div>
        <div className="space-y-6 text-lg leading-relaxed lg:col-span-5 lg:pt-4">
          {about.paragraphs.map((p, i) => (
            <p
              data-reveal
              key={i}
              className={i === 0 ? "text-xl font-medium" : "text-muted-foreground"}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
      <dl className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {about.modules.map((m, i) => (
          <div
            data-reveal
            key={m.k}
            className="group flex min-h-56 min-w-0 flex-col border bg-card p-6 transition-colors duration-300 hover:border-primary hover:bg-background"
          >
            <dt className="label-mono text-muted-foreground">
              0{i + 1} / {m.k}
            </dt>
            <dd className="my-6 font-heading text-3xl uppercase leading-tight motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1">
              {m.v}
            </dd>
            <div aria-hidden className="mt-auto flex items-center justify-between border-t pt-4">
              <span className="h-1 w-8 origin-left bg-primary motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-x-150" />
              <ArrowUpRight className="size-5 text-primary" />
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- WORK ---------- */
function ProjectCard({
  project,
  index,
  large,
}: {
  project: Project;
  index: number;
  large?: boolean;
}) {
  return (
    <article
      data-reveal
      className={cn(
        "group flex flex-col border bg-card",
        large ? "lg:col-span-8" : "lg:col-span-4",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden border-b",
          large ? "aspect-[16/10]" : "aspect-[4/3] lg:aspect-auto lg:flex-1 lg:min-h-[340px]",
        )}
      >
        <div className="h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <ProjectArt project={project} />
        </div>
        <span className="label-mono absolute left-4 top-4 bg-background px-2 py-1">
          № {String(index + 1).padStart(2, "0")}
        </span>
        {project.status && (
          <span className="label-mono absolute right-4 top-4 bg-primary px-2 py-1 text-primary-foreground">
            {project.status}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 w-full">
            <h3
              className={cn(
                "font-display leading-tight",
                project.category === "company" ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl",
              )}
            >
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="mt-2 font-heading uppercase tracking-wide text-muted-foreground">
                {project.subtitle}
              </p>
            )}
          </div>
          <span className="label-mono text-muted-foreground">
            {project.category === "company" ? (project.company ?? "Company") : "Personal"}
          </span>
        </div>
        <p className="text-muted-foreground">{project.description}</p>
        {project.technologies.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <li key={t} className="label-mono border px-2 py-1">
                {t}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap gap-5 border-t pt-4 font-heading text-sm uppercase tracking-[0.1em]">
          {project.caseStudyEnabled && (
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="group/l inline-flex items-center gap-2 hover:text-primary"
            >
              Case study{" "}
              <ArrowUpRight className="size-4 transition-transform group-hover/l:rotate-45" />
            </Link>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-primary"
            >
              Live site <ArrowUpRight className="size-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-primary"
            >
              GitHub <ArrowUpRight className="size-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function Work({ headingAs = "h2" }: { headingAs?: SectionHeadingTag } = {}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const { work, projects, settings } = portfolio;
  const [tab, setTab] = useState<"all" | "personal" | "company">("all");
  const sorted = [...projects.personal].sort((a, b) => Number(b.featured) - Number(a.featured));
  const tabs = [
    { id: "all", label: "All work" },
    { id: "personal", label: "Personal" },
    ...(settings.showCompanyWork ? [{ id: "company", label: "Company work" }] : []),
  ] as const;

  return (
    <section ref={ref} id="work" className="border-t py-28">
      <div className="container-ed">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel>{work.label}</SectionLabel>
            <MaskedHeading
              as={headingAs}
              lines={work.heading}
              className="mt-6 text-[clamp(3rem,9vw,8rem)]"
            />
          </div>
          <div role="tablist" aria-label="Filter work" className="flex border">
            {tabs.map((t) => (
              <Button
                variant="ghost"
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={cn(
                  "label-mono h-auto rounded-none px-3 py-3 transition-colors hover:bg-foreground hover:text-background",
                  tab === t.id ? "bg-foreground text-background" : "hover:text-primary",
                )}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        {tab !== "company" && (
          <div className="mt-16">
            <p className="label-mono mb-6 border-b pb-3 text-muted-foreground">
              {work.personalLabel}
            </p>
            <div className="grid gap-6 lg:grid-cols-12">
              {sorted.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} large={i % 3 === 0} />
              ))}
            </div>
          </div>
        )}
      </div>

      {settings.showCompanyWork && tab !== "personal" && (
        <div className="mt-24 bg-ink py-20 text-ink-foreground">
          <div className="container-ed">
            <SectionLabel tone="inverse">{work.companyLabel}</SectionLabel>
            <div className="mt-6 grid gap-8 lg:grid-cols-12">
              <MaskedHeading
                lines={work.companyHeading}
                className="text-[clamp(2.4rem,5.5vw,5rem)] lg:col-span-8"
              />
              <p data-reveal className="self-end text-ink-foreground/70 lg:col-span-4">
                {work.companyDescription}
              </p>
            </div>
            {projects.company.length > 0 ? (
              <div className="mt-14 grid gap-6 text-foreground lg:grid-cols-12">
                {projects.company.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} />
                ))}
              </div>
            ) : (
              <div
                data-reveal
                className="mt-14 flex flex-col items-start gap-4 border border-dashed border-ink-foreground/30 p-10 md:flex-row md:items-center md:justify-between"
              >
                <p className="font-heading text-2xl uppercase">{work.companyEmpty}</p>
                <span className="label-mono text-ink-foreground/50">
                  [ status: in preparation ]
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- EXPERIENCE ---------- */
export function Experience({ headingAs = "h2" }: { headingAs?: SectionHeadingTag } = {}) {
  const ref = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);
  useReveal(ref);
  useEffect(() => {
    if (!line.current || prefersReducedMotion()) return;
    const t = gsap.fromTo(
      line.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: line.current.parentElement,
          start: "top 70%",
          end: "bottom 60%",
          scrub: true,
        },
      },
    );
    return () => {
      t.scrollTrigger?.kill();
      t.kill();
    };
  }, []);
  const { experience } = portfolio;
  return (
    <section ref={ref} id="experience" className="border-t bg-card py-28">
      <div className="container-ed grid gap-14 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionLabel>{experience.label}</SectionLabel>
            <MaskedHeading
              as={headingAs}
              lines={experience.heading.flatMap((line) => line.split(" "))}
              className="experience-heading mt-6 text-[2rem] leading-none tracking-normal sm:text-5xl md:text-6xl lg:text-[2.5rem] xl:text-[3.5rem] 2xl:text-[4rem] [&_.line-mask]:whitespace-nowrap [&_.line-mask]:pb-[0.14em]"
            />
            {experience.items.map((e) => (
              <p data-reveal key={e.company} className="label-mono mt-8 text-muted-foreground">
                {e.company}
                <br />
                {e.start} — {e.end}
              </p>
            ))}
          </div>
        </div>
        <div className="relative min-w-0 lg:col-span-7">
          <div className="absolute left-[11px] top-0 h-full w-px bg-border" />
          <div
            ref={line}
            className="absolute left-[11px] top-0 h-full w-px origin-top bg-primary"
          />
          <ol className="space-y-20">
            {experience.items
              .flatMap((e) => e.roles.map((r) => ({ ...r, company: e.company })))
              .map((r, i) => (
                <li data-reveal key={r.title} className="relative pl-12">
                  <span className="absolute left-0 top-2 grid size-6 place-items-center border-2 border-primary bg-background font-mono text-[10px]">
                    {i + 1}
                  </span>
                  <div className="font-display text-6xl text-foreground/15 md:text-8xl">
                    {r.start.split(" ")[1]}
                  </div>
                  {r.promotion && (
                    <p className="label-mono mt-2 inline-flex items-center gap-2 bg-primary px-2 py-1 text-primary-foreground">
                      <span className="animate-bounce">↑</span> Promotion — engineering continued
                    </p>
                  )}
                  <h3 className="mt-3 font-heading text-3xl uppercase md:text-4xl">{r.title}</h3>
                  <p className="label-mono mt-2 text-muted-foreground">
                    {r.company} · {r.start} — {r.end}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {r.responsibilities.map((x) => (
                      <li key={x} className="flex gap-4 border-b pb-3 text-muted-foreground">
                        <span className="text-primary">—</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- TOOLKIT ---------- */
function Visual({ kind }: { kind: string }) {
  switch (kind) {
    case "browser":
      return (
        <div className="border border-current/30">
          <div className="flex gap-1 border-b border-current/30 p-2">
            <i className="size-1.5 rounded-full bg-primary" />
            <i className="size-1.5 rounded-full bg-current opacity-40" />
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            <div className="col-span-3 h-4 bg-current opacity-80 transition-all duration-500 group-hover:w-2/3" />
            <div className="h-10 bg-primary transition-all duration-500 group-hover:col-span-2" />
            <div className="h-10 bg-current opacity-20" />
            <div className="h-10 bg-current opacity-20" />
          </div>
        </div>
      );
    case "api":
      return (
        <div className="space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-primary px-1.5 text-primary-foreground">GET</span>/api/products
            <span className="ml-auto opacity-50 transition-opacity group-hover:opacity-100">→</span>
          </div>
          <div className="h-px origin-left scale-x-50 bg-current transition-transform duration-700 group-hover:scale-x-100" />
          <div className="opacity-60">200 OK {"{ items: [...] }"}</div>
        </div>
      );
    case "data":
      return (
        <svg viewBox="0 0 200 70" className="w-full">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="4" y="20" width="50" height="30" />
            <rect x="146" y="5" width="50" height="25" />
            <rect x="146" y="42" width="50" height="25" />
            <path
              d="M54 35 H100 V17 H146 M100 35 V55 H146"
              className="text-primary"
              stroke="currentColor"
              strokeDasharray="4 3"
            />
          </g>
        </svg>
      );
    case "motion":
      return (
        <div className="overflow-hidden font-display text-4xl">
          <span className="block transition-transform duration-700 ease-out group-hover:-translate-y-full">
            Reveal
          </span>
          <span className="block text-primary transition-transform duration-700 ease-out group-hover:-translate-y-full">
            Reveal
          </span>
        </div>
      );
    case "git":
      return (
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 36 }).map((_, i) => (
            <i
              key={i}
              className={cn(
                "aspect-square",
                [2, 5, 9, 14, 17, 20, 26, 31, 33].includes(i)
                  ? "bg-primary"
                  : "bg-current opacity-15",
              )}
            />
          ))}
        </div>
      );
    case "forecast":
      return (
        <svg viewBox="0 0 200 60" className="w-full" fill="none" strokeWidth="2">
          <path d="M0 50 L30 42 L60 46 L90 30 L120 34" stroke="currentColor" />
          <path d="M120 34 L150 22 L180 18 L200 8" stroke="var(--primary)" strokeDasharray="5 4" />
        </svg>
      );
    default:
      return <div className="font-mono text-sm opacity-70">{"> compile && run"}</div>;
  }
}

export function Toolkit({ headingAs = "h2" }: { headingAs?: SectionHeadingTag } = {}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [open, setOpen] = useState<string | null>(null);
  const { skills } = portfolio;
  const spans = [
    "lg:col-span-7",
    "lg:col-span-5",
    "lg:col-span-4",
    "lg:col-span-4",
    "lg:col-span-4",
    "lg:col-span-6",
    "lg:col-span-6",
  ];
  return (
    <section ref={ref} id="expertise" className="border-t py-28">
      <div className="container-ed">
        <SectionLabel>{skills.label}</SectionLabel>
        <MaskedHeading
          as={headingAs}
          lines={skills.heading}
          className="mt-6 text-[clamp(2.6rem,6vw,5.5rem)]"
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          {skills.groups.map((g, i) => {
            const isOpen = open === g.id;
            const dark = i === 0 || i === 6;
            return (
              <button
                type="button"
                data-reveal
                key={g.id}
                onClick={() => setOpen(isOpen ? null : g.id)}
                aria-expanded={isOpen}
                className={cn(
                  "group flex min-h-[260px] flex-col gap-6 border p-6 text-left transition-colors duration-300",
                  spans[i],
                  dark ? "bg-ink text-ink-foreground" : "bg-card hover:bg-background",
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="label-mono opacity-60">{String(i + 1).padStart(2, "0")}</span>
                  <Plus
                    className={cn(
                      "size-4 transition-transform duration-300",
                      isOpen ? "rotate-45" : "group-hover:rotate-90",
                    )}
                  />
                </div>
                <div className="max-w-xs">
                  <Visual kind={g.visual} />
                </div>
                <div className="mt-auto">
                  <h3 className="font-heading text-2xl uppercase">{g.title}</h3>
                  <div
                    className={cn(
                      "grid transition-all duration-500",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100",
                    )}
                  >
                    <p className="overflow-hidden pt-2 text-sm opacity-70">{g.note}</p>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((t) => (
                      <li key={t} className="label-mono border border-current/25 px-2 py-1">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- EDUCATION ---------- */
export function Education({ headingAs = "h2" }: { headingAs?: SectionHeadingTag } = {}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const { education } = portfolio;
  return (
    <section ref={ref} id="education" className="border-t bg-forest py-28 text-forest-foreground">
      <div className="container-ed">
        <SectionLabel tone="inverse">{education.label}</SectionLabel>
        <MaskedHeading
          as={headingAs}
          lines={education.heading}
          className="mt-6 text-[clamp(2.4rem,5.5vw,5rem)]"
        />
        <div className="mt-14 grid gap-px bg-forest-foreground/20 md:grid-cols-2">
          {education.items.map((e) => (
            <article data-reveal key={e.institution} className="bg-forest p-8">
              <div className="flex items-center justify-between">
                <span className="label-mono">
                  {e.start} — {e.end}
                </span>
                <span
                  className={cn(
                    "label-mono px-2 py-1",
                    e.status === "Pursuing"
                      ? "bg-primary text-primary-foreground"
                      : "border border-forest-foreground/40",
                  )}
                >
                  {e.status}
                </span>
              </div>
              <h3 className="mt-10 font-heading text-3xl uppercase">{e.degree}</h3>
              {e.specialization && (
                <p className="mt-2 font-marker text-xl text-primary">
                  Specialisation: {e.specialization}
                </p>
              )}
              <p className="label-mono mt-4 opacity-70">{e.institution}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {e.focus.map((f) => (
                  <li key={f} className="label-mono border border-forest-foreground/30 px-2 py-1">
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CREDENTIALS ---------- */
export function Credentials({ headingAs = "h2" }: { headingAs?: SectionHeadingTag } = {}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const { certifications, settings } = portfolio;
  if (!settings.showCertifications) return null;
  return (
    <section ref={ref} id="credentials" className="border-t py-28">
      <div className="container-ed">
        <SectionLabel>{certifications.label}</SectionLabel>
        <MaskedHeading
          as={headingAs}
          lines={certifications.heading}
          className="mt-6 text-[clamp(2.4rem,5.5vw,5rem)]"
        />
        {certifications.items.length ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certifications.items.map((c) => (
              <article data-reveal key={c.id} className="border bg-card">
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full border-b object-cover"
                  />
                )}
                <div className="space-y-3 p-6">
                  <p className="label-mono text-muted-foreground">
                    {c.issuer}
                    {c.issuedAt && ` · ${c.issuedAt}`}
                  </p>
                  <h3 className="font-heading text-2xl uppercase">{c.title}</h3>
                  {c.credentialId && <p className="label-mono">ID: {c.credentialId}</p>}
                  {c.skills && (
                    <ul className="flex flex-wrap gap-2">
                      {c.skills.map((s) => (
                        <li key={s} className="label-mono border px-2 py-1">
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                  {c.credentialUrl && (
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="label-mono inline-flex items-center gap-1 text-primary"
                    >
                      Verify credential <ArrowUpRight className="size-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div data-reveal className="mt-14 grid gap-6 border border-dashed p-10 md:grid-cols-3">
            <p className="font-heading text-2xl uppercase md:col-span-2">{certifications.empty}</p>
            <div className="flex gap-2 md:justify-end">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 w-12 border bg-card"
                  style={{ transform: `rotate(${(i - 1) * 6}deg)` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- CONTACT ---------- */
export function Contact({ headingAs = "h2" }: { headingAs?: SectionHeadingTag } = {}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const { contact, profile, socialLinks } = portfolio;
  return (
    <section ref={ref} id="contact" className="border-t bg-primary py-28 text-primary-foreground">
      <div className="container-ed">
        <SectionLabel tone="inverse">{contact.label}</SectionLabel>
        <MaskedHeading
          as={headingAs}
          lines={contact.heading}
          className="mt-6 text-[clamp(3rem,10vw,9.5rem)]"
        />
        <div className="mt-14 grid gap-10 border-t border-primary-foreground/30 pt-10 lg:grid-cols-12">
          <p data-reveal className="text-xl lg:col-span-5">
            {contact.copy}
          </p>
          <div data-reveal className="space-y-5 lg:col-span-7">
            <a
              href={`mailto:${profile.email}`}
              className="block break-all font-heading text-3xl uppercase underline-offset-8 hover:underline md:text-5xl"
            >
              {profile.email}
            </a>
            <div className="flex flex-wrap items-center gap-6">
              <CopyEmail email={profile.email} label={contact.copyEmailLabel} />
              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                className="label-mono hover:underline"
              >
                {profile.phone}
              </a>
              <span className="label-mono opacity-80">{profile.location}</span>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              {socialLinks.linkedin && (
                <EdButton href={socialLinks.linkedin} external variant="inverse">
                  LinkedIn
                </EdButton>
              )}
              {socialLinks.github && (
                <EdButton href={socialLinks.github} external variant="inverse">
                  GitHub
                </EdButton>
              )}
              {profile.resumeUrl && (
                <EdButton href={profile.resumeUrl} download variant="inverse">
                  Download résumé
                </EdButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
