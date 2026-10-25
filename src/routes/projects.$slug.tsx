import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { allProjects, getProject } from "@/data/portfolio";
import { Footer, Nav, SmoothScroll } from "@/components/layout/chrome";
import { EdButton, MaskedHeading, SectionLabel } from "@/components/ui/editorial";
import { ProjectArt } from "@/components/projects/ProjectArt";
import { useReveal } from "@/lib/animations";
import { pageHead, projectHead } from "@/lib/seo";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project || !project.caseStudyEnabled) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    return p ? projectHead(p) : pageHead("work");
  },
  component: CaseStudy,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center">
      <Link to="/" className="font-display text-4xl hover:text-primary">
        Project not found — back home
      </Link>
    </div>
  ),
});

function Progress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () =>
      setP(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <div
      className="fixed left-0 top-0 z-[70] h-[3px] origin-left bg-primary"
      style={{ width: "100%", transform: `scaleX(${p})` }}
    />
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section data-reveal className="grid min-w-0 grid-cols-1 gap-6 border-t py-14 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-4">
        <p className="label-mono text-muted-foreground">{n}</p>
        <h2 className="mt-2 font-heading text-3xl uppercase">{title}</h2>
      </div>
      <div className="min-w-0 lg:col-span-8">{children}</div>
    </section>
  );
}

const List = ({ items }: { items: string[] }) => (
  <ul className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
    {items.map((x, i) => (
      <li key={x} className="flex min-w-0 gap-4 bg-background p-4">
        <span className="label-mono shrink-0 text-primary">{String(i + 1).padStart(2, "0")}</span>
        <span className="min-w-0">{x}</span>
      </li>
    ))}
  </ul>
);

function CaseStudy() {
  const { project: p } = Route.useLoaderData();
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  const list = allProjects().filter((x) => x.caseStudyEnabled);
  const idx = list.findIndex((x) => x.slug === p.slug);
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];
  let n = 0;
  const num = () => String(++n).padStart(2, "0") + " /";

  return (
    <>
      <Progress />
      <SmoothScroll />
      <Nav />
      <main ref={ref} className="pt-36">
        <div className="container-ed">
          <nav aria-label="Breadcrumb" className="label-mono text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link to="/work" className="hover:text-primary">
                  Work
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page">{p.title}</li>
            </ol>
          </nav>
          <Link
            to="/work"
            className="label-mono mt-8 inline-flex items-center gap-2 hover:text-primary"
          >
            <ArrowLeft className="size-3" /> All work
          </Link>
          <div className="mt-6">
            <SectionLabel>
              Case study — {p.category === "company" ? "Company work" : "Personal project"}
            </SectionLabel>
          </div>
          <MaskedHeading
            as="h1"
            lines={[p.title]}
            className="mt-6 text-[clamp(2.5rem,14vw,13rem)]"
          />
          {p.subtitle && (
            <p
              data-reveal
              className="font-heading text-2xl uppercase text-muted-foreground md:text-3xl"
            >
              {p.subtitle}
            </p>
          )}
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <p data-reveal className="text-xl leading-relaxed lg:col-span-7">
              {p.overview ?? p.description}
            </p>
            <dl
              data-reveal
              className="grid grid-cols-2 gap-px self-start border bg-border lg:col-span-5 [&>*:last-child:nth-child(odd)]:col-span-2"
            >
              {[
                ["Category", p.category === "company" ? "Company" : "Personal"],
                p.role && ["Role", p.role],
                p.year && ["Year", p.year],
                p.status && ["Status", p.status],
                p.company && !p.confidential && ["Company", p.company],
                ["Stack", `${p.technologies.length} technologies`],
              ]
                .filter(Boolean)
                .map((row) => {
                  const [k, v] = row as string[];
                  return (
                    <div key={k} className="bg-card p-4">
                      <dt className="label-mono text-muted-foreground">{k}</dt>
                      <dd className="mt-1 break-words font-heading uppercase">{v}</dd>
                    </div>
                  );
                })}
            </dl>
          </div>
          <div data-reveal className="mt-14 aspect-[16/9] overflow-hidden border">
            <ProjectArt project={p} />
          </div>

          <div className="mt-10">
            {p.problem && (
              <Block n={num()} title="The purpose">
                <p className="text-lg text-muted-foreground">{p.problem}</p>
              </Block>
            )}
            {p.solution && (
              <Block n={num()} title="Engineering approach">
                <p className="text-lg text-muted-foreground">{p.solution}</p>
              </Block>
            )}
            {p.architecture && (
              <Block n={num()} title="System architecture">
                <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
                  {p.architecture.map((a, i) => (
                    <div key={a.layer} className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="min-w-0 flex-1 border bg-ink p-4 text-ink-foreground">
                        <p className="label-mono text-primary">{a.layer}</p>
                        <ul className="mt-3 space-y-1 font-mono text-xs">
                          {a.items.map((x) => (
                            <li key={x}>{x}</li>
                          ))}
                        </ul>
                      </div>
                      {i < (p.architecture?.length ?? 0) - 1 && (
                        <ArrowRight className="hidden size-4 shrink-0 text-primary md:block" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="label-mono mt-3 text-muted-foreground">Simplified overview</p>
              </Block>
            )}
            {p.features && (
              <Block n={num()} title="Functional modules">
                <List items={p.features} />
              </Block>
            )}
            {p.contributions && (
              <Block n={num()} title="Key contributions">
                <List items={p.contributions} />
              </Block>
            )}
            {p.challenges && (
              <Block n={num()} title="Challenges">
                <List items={p.challenges} />
              </Block>
            )}
            {p.results && (
              <Block n={num()} title="Results">
                <List items={p.results} />
              </Block>
            )}
            <Block n={num()} title="Technology stack">
              <ul className="flex flex-wrap gap-2">
                {p.technologies.map((t) => (
                  <li key={t} className="font-heading border border-foreground px-4 py-2 uppercase">
                    {t}
                  </li>
                ))}
              </ul>
            </Block>
            {p.gallery && p.gallery.length > 0 && (
              <Block n={num()} title="Gallery">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {p.gallery.map((g) => (
                    <img
                      key={g}
                      src={g}
                      alt={`${p.title} screenshot`}
                      loading="lazy"
                      className="border"
                    />
                  ))}
                </div>
              </Block>
            )}
            {(p.liveUrl || p.githubUrl) && (
              <div data-reveal className="flex flex-wrap gap-3 border-t py-14">
                {p.liveUrl && (
                  <EdButton href={p.liveUrl} external>
                    Visit live project
                  </EdButton>
                )}
                {p.githubUrl && (
                  <EdButton href={p.githubUrl} external variant="outline">
                    View source
                  </EdButton>
                )}
              </div>
            )}
          </div>
        </div>

        {list.length > 1 && prev && next && (
          <nav
            aria-label="More projects"
            className="mt-10 grid grid-cols-1 border-t md:grid-cols-2"
          >
            <Link
              to="/projects/$slug"
              params={{ slug: prev.slug }}
              className="group border-b p-6 hover:bg-card sm:p-10 md:border-b-0 md:border-r"
            >
              <p className="label-mono text-muted-foreground">← Previous</p>
              <p className="mt-3 break-words font-display text-[clamp(2.35rem,12vw,3.125rem)] group-hover:text-primary">
                {prev.title}
              </p>
            </Link>
            <Link
              to="/projects/$slug"
              params={{ slug: next.slug }}
              className="group p-6 text-right hover:bg-card sm:p-10"
            >
              <p className="label-mono text-muted-foreground">Next →</p>
              <p className="mt-3 break-words font-display text-[clamp(2.35rem,12vw,3.125rem)] group-hover:text-primary">
                {next.title}
              </p>
            </Link>
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}
