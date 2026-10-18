import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

/** Real owner-supplied or publicly captured screenshots, never fabricated interfaces. */
export function ProjectArt({ project, className }: { project: Project; className?: string }) {
  if (project.coverImage)
    return (
      <img
        src={project.coverImage}
        alt={`${project.title} website screenshot`}
        loading="lazy"
        className={cn("h-full w-full bg-ink object-contain", className)}
      />
    );

  const dark = project.theme !== "paper";
  const bg =
    project.theme === "forest"
      ? "bg-forest text-forest-foreground"
      : project.theme === "paper"
        ? "bg-card"
        : "bg-ink text-ink-foreground";
  return (
    <div className={cn("relative h-full w-full overflow-hidden p-6", bg, className)} aria-hidden>
      <div
        className={cn(
          "flex h-full flex-col border",
          dark ? "border-ink-foreground/20" : "border-border",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 border-b px-3 py-2",
            dark ? "border-ink-foreground/20" : "border-border",
          )}
        >
          <i className="size-2 rounded-full bg-primary" />
          <i className="size-2 rounded-full bg-current opacity-30" />
          <i className="size-2 rounded-full bg-current opacity-30" />
          <span className="label-mono ml-3 opacity-60">{project.slug}.app</span>
        </div>
        {project.slug === "invora" ? <InvoraUI /> : <SnippetUI />}
      </div>
      <span className="label-mono absolute bottom-3 right-4 opacity-50">Illustrative preview</span>
    </div>
  );
}

function InvoraUI() {
  const bars = [38, 52, 44, 61, 57, 70, 66, 78];
  return (
    <div className="grid flex-1 grid-cols-4 gap-3 p-4">
      <div className="col-span-1 space-y-2">
        {["Products", "Inventory", "Sales", "Forecast", "Reports"].map((l, i) => (
          <div
            key={l}
            className={cn(
              "label-mono px-2 py-1.5",
              i === 3 ? "bg-primary text-primary-foreground" : "opacity-60",
            )}
          >
            {l}
          </div>
        ))}
      </div>
      <div className="col-span-3 flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {["SKU", "Stock", "Reorder"].map((k) => (
            <div key={k} className="border border-current/20 p-2">
              <div className="label-mono opacity-50">{k}</div>
              <div className="mt-1 h-3 w-2/3 bg-current opacity-80" />
            </div>
          ))}
        </div>
        <div className="relative flex flex-1 items-end gap-2 border border-current/20 p-3">
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={cn(
                "flex-1 transition-all duration-700 group-hover:opacity-100",
                i >= 6
                  ? "border border-dashed border-primary bg-primary/30"
                  : "bg-current opacity-70",
              )}
            />
          ))}
          <span className="label-mono absolute right-3 top-2 text-primary">Forecast →</span>
        </div>
      </div>
    </div>
  );
}

function SnippetUI() {
  return (
    <div className="grid flex-1 grid-cols-5 gap-3 p-4 font-mono text-[11px]">
      <div className="col-span-2 space-y-2">
        {["useDebounce.ts", "fetcher.js", "grid.css", "readme.md"].map((f, i) => (
          <div
            key={f}
            className={cn(
              "px-2 py-1.5",
              i === 0 ? "bg-primary text-primary-foreground" : "opacity-60",
            )}
          >
            {f}
          </div>
        ))}
      </div>
      <div className="col-span-3 space-y-1 border border-current/20 p-3 leading-relaxed">
        <div>
          <span className="text-primary">export function</span> useDebounce(v, ms) {"{"}
        </div>
        <div className="pl-3 opacity-80">const [d, set] = useState(v);</div>
        <div className="pl-3 opacity-80">
          useEffect(() =&gt; {"{"} … {"}"}, [v]);
        </div>
        <div className="pl-3">
          <span className="text-primary">return</span> d;
        </div>
        <div>{"}"}</div>
        <div className="label-mono mt-3 inline-block border border-current/40 px-2 py-1">
          ⧉ Copy
        </div>
      </div>
    </div>
  );
}
