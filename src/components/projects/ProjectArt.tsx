import type { ReactNode } from "react";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type ArtProps = {
  project: Project;
  className?: string | undefined;
};

function ArtFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("group relative h-full w-full overflow-hidden", className)}
    >
      {children}
    </div>
  );
}

export function ProjectArt({ project, className }: { project: Project; className?: string }) {
  // The named projects intentionally select bespoke JSX artwork before the reusable image fallback.
  switch (project.slug) {
    case "invora":
      return <InvoraArt project={project} className={className} />;
    case "pastehub":
      return <PasteHubArt project={project} className={className} />;
    case "nawab-construction":
      return <NawabConstructionArt project={project} className={className} />;
    case "linkup-social":
      return <LinkUpSocialArt project={project} className={className} />;
    case "linkup-web":
      return <LinkUpWebArt project={project} className={className} />;
    default:
      if (project.coverImage) {
        return (
          <img
            src={project.coverImage}
            alt={project.title}
            loading="lazy"
            className={cn("h-full w-full bg-ink object-contain", className)}
          />
        );
      }

      return <GenericProjectArt project={project} className={className} />;
  }
}

function InvoraArt({ project, className }: ArtProps) {
  const navigation = [
    { label: "Catalogue", active: false },
    { label: "Inventory", active: false },
    { label: "Forecast", active: true },
    { label: "Reports", active: false },
  ];

  return (
    <ArtFrame className={cn("bg-[#131a16] text-[#f4efe4]", className)}>
      <div className="absolute -right-16 -top-14 size-40 rounded-full border border-[#ef8b56]/20" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#1b2b23]/55" />
      <div className="relative flex h-full min-h-0 flex-col p-3 pt-10 sm:p-4 sm:pt-12">
        <header className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-heading text-base uppercase tracking-[0.12em] sm:text-lg">
              {project.title}
            </p>
            <p className="label-mono mt-0.5 truncate text-[8px] text-[#b8c9bb] sm:text-[9px]">
              Inventory overview
            </p>
          </div>
          <span className="label-mono shrink-0 border border-[#ef8b56]/50 px-2 py-1 text-[8px] text-[#ef8b56]">
            Operations
          </span>
        </header>

        <div className="mt-3 grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
          <aside className="hidden min-h-0 flex-col border border-[#aec0aa]/20 bg-[#15231c]/85 p-2 sm:flex">
            <p className="label-mono mb-3 text-[8px] text-[#9eb39f]">Workspace</p>
            <div className="space-y-1.5 text-[9px] uppercase tracking-[0.08em] text-[#c5d3c7]">
              {navigation.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "border border-transparent px-2 py-1.5",
                    item.active && "border-[#ef8b56]/60 bg-[#ef8b56] text-[#1a1b16]",
                  )}
                >
                  {item.label}
                </div>
              ))}
            </div>
            <div className="mt-auto border-t border-[#aec0aa]/20 pt-2">
              <span className="label-mono text-[8px] text-[#9eb39f]">Workspace active</span>
            </div>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-col border border-[#aec0aa]/25 bg-[#1b2a22]/90 p-2.5 shadow-[0_12px_34px_rgba(0,0,0,0.18)] transition duration-500 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:border-[#ef8b56]/60 motion-reduce:transform-none motion-reduce:transition-none sm:p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-heading text-sm uppercase tracking-wide text-[#f4efe4] sm:text-base">
                Inventory health
              </p>
              <span className="label-mono text-[8px] text-[#9eb39f]">Current view</span>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <MiniStat label="Stock health" accent="bg-[#9ec899]" />
              <MiniStat label="Reorder queue" accent="bg-[#ef8b56]" />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="border border-[#aec0aa]/20 bg-[#17251e] px-2 py-1.5">
                <span className="label-mono text-[8px] text-[#afc4b1]">Product view</span>
                <span className="mt-1 block h-px w-3/4 bg-[#9ec899]/60" />
              </div>
              <div className="border border-[#aec0aa]/20 bg-[#17251e] px-2 py-1.5">
                <span className="label-mono text-[8px] text-[#afc4b1]">Inventory flow</span>
                <span className="mt-1 block h-px w-2/3 bg-[#ef8b56]/70" />
              </div>
            </div>

            <div className="relative mt-2 min-h-[82px] flex-1 overflow-hidden border border-[#aec0aa]/20 bg-[#122018]/65">
              <div className="absolute inset-x-2 top-2 flex items-center justify-between gap-3">
                <span className="label-mono text-[8px] text-[#b9cdbb]">Forecast analysis</span>
                <span className="label-mono text-[8px] text-[#ef8b56]">Projected</span>
              </div>
              <svg
                viewBox="0 0 320 132"
                preserveAspectRatio="none"
                className="absolute inset-x-0 bottom-0 h-[76%] w-full"
              >
                <path d="M0 104H320M0 67H320M0 30H320" stroke="#aec0aa" strokeOpacity="0.16" />
                <path
                  d="M8 108 L42 89 L76 96 L110 65 L144 76 L178 46 L204 54 L204 132 L8 132 Z"
                  fill="#86b985"
                  fillOpacity="0.16"
                />
                <path
                  d="M8 108 L42 89 L76 96 L110 65 L144 76 L178 46 L204 54"
                  fill="none"
                  stroke="#a9d2a1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="transition-colors duration-500 group-hover:stroke-[#ef8b56] motion-reduce:transition-none"
                />
                <path
                  d="M204 54 L238 42 L272 60 L312 29"
                  fill="none"
                  stroke="#ef8b56"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="7 6"
                  className="transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
                />
                <line
                  x1="204"
                  y1="14"
                  x2="204"
                  y2="122"
                  stroke="#ef8b56"
                  strokeOpacity="0.58"
                  strokeDasharray="3 5"
                />
              </svg>
              <div className="absolute bottom-2 left-2 flex items-center gap-3">
                <span className="label-mono text-[8px] text-[#c4d5c4]">History</span>
                <span className="h-px w-4 bg-[#ef8b56]" />
                <span className="label-mono text-[8px] text-[#ef8b56]">Projection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ArtFrame>
  );
}

function MiniStat({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="border border-[#aec0aa]/20 bg-[#17251e] p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="label-mono truncate text-[8px] text-[#afc4b1]">{label}</span>
        <span className={cn("size-1.5 shrink-0 rounded-full", accent)} />
      </div>
      <div className="mt-2 h-1 overflow-hidden bg-[#aec0aa]/15">
        <span
          className={cn(
            "block h-full w-2/3 origin-left opacity-80 transition duration-500 motion-safe:group-hover:scale-x-110 motion-safe:group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none",
            accent,
          )}
        />
      </div>
    </div>
  );
}

function PasteHubArt({ project, className }: ArtProps) {
  const files = [
    { name: "clean-input.js", active: true },
    { name: "button.css", active: false },
    { name: "request.js", active: false },
  ];

  return (
    <ArtFrame className={cn("bg-[#0b2c23] text-[#eff6e8]", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(157,214,176,0.18),transparent_40%)]" />
      <div className="absolute inset-x-3 bottom-3 top-10 flex min-h-0 flex-col border border-[#9bd2b2]/35 bg-[#123a2f] shadow-[0_16px_36px_rgba(0,0,0,0.24)] transition duration-500 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:border-[#c8f0c9]/65 motion-reduce:transform-none motion-reduce:transition-none sm:inset-x-4 sm:bottom-4 sm:top-11">
        <header className="flex h-8 shrink-0 items-center gap-2 border-b border-[#9bd2b2]/25 px-2.5 sm:px-3">
          <span className="font-heading text-sm tracking-wide text-[#eff6e8]">{project.title}</span>
          <span className="label-mono hidden border border-[#9bd2b2]/30 px-1.5 py-0.5 text-[8px] text-[#a8d8b5] sm:inline">
            Snippets
          </span>
          <div className="ml-auto flex max-w-[52%] items-center gap-2 border border-[#9bd2b2]/25 bg-[#0d3026] px-2 py-1 text-[#a8d8b5]">
            <span className="size-1.5 shrink-0 rounded-full border border-current" />
            <span className="label-mono truncate text-[8px]">Search library</span>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[7rem_minmax(0,1fr)]">
          <aside className="hidden min-h-0 border-r border-[#9bd2b2]/20 p-2 sm:block">
            <p className="label-mono mb-2 text-[8px] text-[#a8d8b5]">Library</p>
            <div className="space-y-1">
              {files.map((file) => (
                <div
                  key={file.name}
                  className={cn(
                    "truncate border border-transparent px-2 py-1.5 font-mono text-[9px] text-[#bddcca] transition-colors duration-300 motion-reduce:transition-none",
                    file.active &&
                      "border-[#b9ecc1]/35 bg-[#1a4a3c] text-[#f2f8ed] motion-safe:group-hover:border-[#b9ecc1]/70",
                  )}
                >
                  {file.name}
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-[#9bd2b2]/20 pt-2">
              <span className="label-mono text-[8px] text-[#8fbba0]">Personal shelf</span>
            </div>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-col bg-[#0d3026] p-2.5 sm:p-3">
            <div className="flex items-center justify-between gap-3 border-b border-[#9bd2b2]/20 pb-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-[#b9ecc1]" />
                <span className="truncate font-mono text-[9px] text-[#e8f4e6]">clean-input.js</span>
              </div>
              <span className="label-mono shrink-0 text-[8px] text-[#a8d8b5]">JavaScript</span>
            </div>

            <div className="min-h-0 flex-1 pt-3 font-mono text-[9px] leading-[1.75] text-[#dbeedc] sm:text-[10px]">
              <p>
                <span className="mr-3 text-[#709b7c]">01</span>
                <span className="text-[#b9ecc1]">const</span> cleanSnippet = (value) =&gt; {"{"}
              </p>
              <p>
                <span className="mr-3 text-[#709b7c]">02</span>
                <span className="pl-3 text-[#b9ecc1]">return</span> value.trim();
              </p>
              <p>
                <span className="mr-3 text-[#709b7c]">03</span>
                {"}"};
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-[#9bd2b2]/20 pt-2">
              <span className="label-mono text-[8px] text-[#8fbba0]">Reusable snippet</span>
              <span className="label-mono border border-[#b9ecc1]/35 px-2 py-1 text-[8px] text-[#c8f0c9] transition duration-300 motion-safe:group-hover:bg-[#b9ecc1] motion-safe:group-hover:text-[#0d3026] motion-reduce:transition-none">
                Copy code
              </span>
            </div>
          </div>
        </div>
      </div>
    </ArtFrame>
  );
}

function NawabConstructionArt({ project, className }: ArtProps) {
  return (
    <ArtFrame className={cn("bg-[#eee3cf] text-[#342920]", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(93,67,45,0.06)_1px,transparent_1px),linear-gradient(rgba(93,67,45,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <svg
        viewBox="0 0 460 250"
        preserveAspectRatio="xMidYMid meet"
        className="relative h-full w-full transition-transform duration-500 motion-safe:group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none"
      >
        <g>
          <line x1="54" y1="205" x2="406" y2="205" stroke="#5d432d" strokeOpacity="0.58" />
          <line x1="75" y1="45" x2="75" y2="205" stroke="#b97850" strokeWidth="1.5" />
          <line x1="69" y1="45" x2="81" y2="45" stroke="#b97850" strokeWidth="1.5" />
          <line x1="69" y1="205" x2="81" y2="205" stroke="#b97850" strokeWidth="1.5" />
          <path d="M75 51 l-3 6 h6 Z M75 199 l-3 -6 h6 Z" fill="#b97850" />
          <text
            x="48"
            y="128"
            fill="#8c6448"
            fontSize="8"
            fontFamily="var(--font-mono)"
            transform="rotate(-90 48 128)"
          >
            ELEVATION
          </text>

          <polygon
            points="112,78 183,38 331,38 260,78"
            fill="#d9c5a5"
            stroke="#5d432d"
            strokeWidth="1.5"
          />
          <polygon
            points="112,78 260,78 260,191 112,191"
            fill="#c8ad86"
            stroke="#5d432d"
            strokeWidth="1.5"
          />
          <polygon
            points="260,78 331,38 331,151 260,191"
            fill="#ad8c67"
            stroke="#5d432d"
            strokeWidth="1.5"
          />

          <g stroke="#5d432d" strokeOpacity="0.72" strokeWidth="1">
            <line x1="135" y1="100" x2="135" y2="171" />
            <line x1="168" y1="100" x2="168" y2="171" />
            <line x1="201" y1="100" x2="201" y2="171" />
            <line x1="234" y1="100" x2="234" y2="171" />
            <line x1="125" y1="119" x2="247" y2="119" />
            <line x1="125" y1="146" x2="247" y2="146" />
            <line x1="125" y1="171" x2="247" y2="171" />
            <line x1="279" y1="81" x2="279" y2="180" />
            <line x1="301" y1="67" x2="301" y2="167" />
            <line x1="263" y1="113" x2="325" y2="78" />
            <line x1="263" y1="146" x2="325" y2="111" />
          </g>

          <rect x="187" y="143" width="39" height="48" fill="#473426" />
          <rect x="195" y="151" width="23" height="40" fill="#d7b87d" fillOpacity="0.5" />
          <path d="M112 78 L260 78 L331 38" fill="none" stroke="#b97850" strokeWidth="2.5" />
          <path d="M98 199 H352" stroke="#b97850" strokeWidth="2" />
        </g>

        <g fill="#765137" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.4">
          <text x="101" y="27">
            ARCHITECTURAL STUDY
          </text>
          <text x="326" y="214">
            ELEVATION A
          </text>
          <text x="94" y="221">
            MATERIAL / SANDSTONE
          </text>
        </g>
        <path
          d="M356 59 h43 M377 38 v42 M372 43 l5 -5 l5 5 M372 75 l5 5 l5 -5"
          fill="none"
          stroke="#b97850"
          strokeWidth="1.4"
        />
      </svg>
      <div className="absolute bottom-4 left-4 border-l-2 border-[#b97850] pl-3 sm:bottom-5 sm:left-5">
        <p className="font-heading text-lg uppercase tracking-wide sm:text-xl">{project.title}</p>
        <p className="label-mono mt-1 text-[8px] text-[#765137]">Built environment</p>
      </div>
    </ArtFrame>
  );
}

function LinkUpSocialArt({ project, className }: ArtProps) {
  return (
    <ArtFrame className={cn("bg-[#241638] text-[#fbf1dd]", className)}>
      <div className="absolute -right-16 -top-16 size-64 rounded-full border border-[#c8abff]/25" />
      <div className="absolute right-8 top-8 size-28 rounded-full border border-[#c8abff]/30 sm:size-40" />
      <div className="absolute right-10 top-10 size-24 rounded-full border border-[#bde85a]/55 sm:size-32" />
      <div className="absolute left-[18%] top-0 h-full w-px bg-[#c8abff]/20" />

      <div className="relative h-full p-4 pt-11 sm:p-5 sm:pt-12">
        <div className="max-w-[66%]">
          <p className="label-mono text-[8px] text-[#c8abff]">Creative signals</p>
          <h4 className="mt-2 font-display text-[clamp(2.2rem,7vw,5.4rem)] leading-[0.78] tracking-[-0.04em]">
            {project.title}
          </h4>
          <p className="mt-3 max-w-[14rem] font-heading text-sm uppercase tracking-wide text-[#d7c3ff] sm:text-base">
            {project.subtitle}
          </p>
        </div>

        <div className="absolute bottom-5 left-4 right-4 h-[42%] sm:bottom-6 sm:left-5 sm:right-5">
          <div className="absolute bottom-0 left-0 w-[48%] border border-[#c8abff]/45 bg-[#382253] p-3 shadow-[10px_10px_0_rgba(189,232,90,0.18)] transition-transform duration-500 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:-rotate-3 motion-reduce:transform-none motion-reduce:transition-none">
            <span className="label-mono text-[8px] text-[#bde85a]">Strategy</span>
            <span className="mt-5 block h-px w-full bg-[#c8abff]/40" />
            <span className="mt-2 block h-6 w-2/3 bg-[#f0e1bd]" />
          </div>
          <div className="absolute bottom-[13%] left-[31%] w-[46%] rotate-6 border border-[#bde85a]/50 bg-[#bde85a] p-3 text-[#241638] shadow-[9px_9px_0_rgba(200,171,255,0.2)] transition-transform duration-500 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:rotate-3 motion-reduce:transform-none motion-reduce:transition-none">
            <span className="label-mono text-[8px]">Culture</span>
            <span className="mt-5 block h-1.5 w-full bg-[#241638]" />
            <span className="mt-2 block h-1.5 w-2/3 bg-[#241638]/50" />
          </div>
          <div className="absolute -bottom-1 right-0 grid size-[34%] place-items-center rounded-full border border-[#c8abff]/50 bg-[#241638] text-center transition-transform duration-500 motion-safe:group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none">
            <span className="label-mono text-[8px] leading-[1.45] text-[#fbf1dd]">
              Digital
              <br />
              culture
            </span>
          </div>
        </div>

        <svg viewBox="0 0 160 160" className="absolute bottom-0 right-0 h-[68%] w-[48%] opacity-60">
          <path d="M8 130 C46 76 84 166 151 30" fill="none" stroke="#c8abff" strokeWidth="1" />
          <path d="M0 102 C42 48 89 142 160 12" fill="none" stroke="#bde85a" strokeWidth="1.4" />
          <circle cx="126" cy="52" r="5" fill="#bde85a" />
          <circle cx="59" cy="116" r="3" fill="#c8abff" />
        </svg>
      </div>
    </ArtFrame>
  );
}

function LinkUpWebArt({ project, className }: ArtProps) {
  return (
    <ArtFrame className={cn("bg-[#eee1cc] text-[#2e2620]", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_49.5%,rgba(204,100,61,0.13)_50%,transparent_50.5%)] bg-[size:24px_24px]" />
      <div className="absolute inset-x-3 bottom-3 top-10 z-10 flex min-h-0 flex-col border border-[#41352b]/55 bg-[#fff7e8] shadow-[0_13px_28px_rgba(69,48,30,0.16)] transition-transform duration-500 motion-safe:group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none sm:inset-x-4 sm:bottom-4 sm:top-11">
        <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-[#41352b]/25 px-2.5 sm:px-3">
          <span className="size-1.5 rounded-full bg-[#d86d44]" />
          <span className="size-1.5 rounded-full bg-[#dcb98d]" />
          <span className="size-1.5 rounded-full bg-[#41352b]/30" />
          <span className="ml-2 font-heading text-[11px] uppercase tracking-[0.14em] sm:text-xs">
            {project.title}
          </span>
          <div className="ml-auto hidden items-center gap-3 font-mono text-[8px] uppercase tracking-[0.1em] text-[#776554] sm:flex">
            <span>Work</span>
            <span>Studio</span>
            <span>Contact</span>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-12 gap-2 p-2.5 sm:gap-3 sm:p-3">
          <div className="col-span-7 flex min-h-0 flex-col border border-[#41352b]/25 bg-[#f5e7d0] p-2.5 sm:p-3">
            <span className="label-mono text-[8px] text-[#a64e30]">Responsive web</span>
            <div className="mt-auto">
              <p className="font-display text-[clamp(1.25rem,3.5vw,2.4rem)] leading-[0.82] tracking-[-0.04em]">
                DIGITAL
                <br />
                SYSTEMS
              </p>
              <div className="mt-3 h-1.5 w-full bg-[#2e2620]" />
              <div className="mt-1.5 h-1.5 w-3/5 bg-[#d86d44]" />
            </div>
          </div>
          <div className="col-span-5 grid min-h-0 grid-rows-2 gap-2">
            <div className="border border-[#41352b]/25 bg-[#2e2620] p-2.5 text-[#fff7e8]">
              <span className="label-mono text-[8px] text-[#f0b494]">Interface</span>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                <span className="h-6 bg-[#fff7e8]" />
                <span className="h-6 bg-[#d86d44]" />
                <span className="h-6 bg-[#fff7e8]/40" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="border border-[#41352b]/25 bg-[#d86d44]" />
              <span className="border border-[#41352b]/25 bg-[#dcb98d]" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 w-[23%] min-w-[68px] max-w-[124px] border border-[#41352b]/65 bg-[#fff7e8] p-1.5 shadow-[7px_7px_0_rgba(216,109,68,0.38)] transition-transform duration-500 motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none sm:bottom-6 sm:right-6 sm:p-2">
        <div className="flex items-center justify-between border-b border-[#41352b]/25 pb-1.5">
          <span className="label-mono text-[7px] text-[#776554]">Mobile</span>
          <span className="size-1 rounded-full bg-[#d86d44]" />
        </div>
        <div className="mt-2 border border-[#41352b]/25 bg-[#f5e7d0] p-1.5">
          <span className="block h-4 bg-[#2e2620]" />
          <span className="mt-1 block h-1.5 w-4/5 bg-[#d86d44]" />
          <span className="mt-1 block h-1.5 w-3/5 bg-[#41352b]/35" />
          <span className="mt-2 block h-7 bg-[#dcb98d]" />
        </div>
      </div>
    </ArtFrame>
  );
}

function GenericProjectArt({ project, className }: ArtProps) {
  const technologies = project.technologies.slice(0, 3);

  return (
    <ArtFrame className={cn("bg-[#ebe2d2] text-[#302820]", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(48,40,32,0.07)_1px,transparent_1px),linear-gradient(rgba(48,40,32,0.07)_1px,transparent_1px)] bg-[size:22px_22px]" />
      <div className="relative flex h-full flex-col justify-end p-4 pt-12 sm:p-5 sm:pt-14">
        <div className="border border-[#302820]/35 bg-[#fff9ee]/90 p-4 shadow-[8px_8px_0_rgba(48,40,32,0.12)]">
          <p className="label-mono text-[8px] text-[#8a6e58]">Project study</p>
          <p className="mt-2 font-display text-3xl leading-none">{project.title}</p>
          {project.subtitle && (
            <p className="mt-2 font-heading text-sm uppercase tracking-wide text-[#705d4e]">
              {project.subtitle}
            </p>
          )}
          {technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className="label-mono border border-[#302820]/25 px-1.5 py-1 text-[8px]"
                >
                  {technology}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </ArtFrame>
  );
}
