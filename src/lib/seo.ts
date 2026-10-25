import {
  allProjects,
  portfolio,
  type PortfolioPageMetadata,
  type PortfolioRouteKey,
  type Project,
} from "@/data/portfolio";

type JsonLdPrimitive = string | number | boolean | null;
type JsonLdValue = JsonLdPrimitive | JsonLdObject | JsonLdValue[];
type JsonLdObject = { [key: string]: JsonLdValue };

const jsonLdEscapes: Record<string, string> = {
  "&": "\\u0026",
  ">": "\\u003e",
  "<": "\\u003c",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

const normalizePath = (path: string) => (path === "/" ? path : `/${path.replace(/^\/+/, "")}`);

export function getSiteOrigin() {
  const configuredUrl = portfolio.site.url.trim();
  if (!configuredUrl) return undefined;

  try {
    const url = new URL(configuredUrl);
    return url.protocol === "http:" || url.protocol === "https:" ? url.origin : undefined;
  } catch {
    return undefined;
  }
}

export function getCanonicalUrl(path: string) {
  const origin = getSiteOrigin();
  return origin ? new URL(normalizePath(path), `${origin}/`).toString() : undefined;
}

function pageSchema(page: PortfolioPageMetadata): JsonLdObject {
  const canonical = getCanonicalUrl(page.path);
  const origin = getSiteOrigin();

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    ...(canonical ? { url: canonical } : {}),
    ...(origin
      ? {
          isPartOf: {
            "@type": "WebSite",
            name: portfolio.site.name,
            url: origin,
          },
        }
      : {}),
  };
}

function personSchema(): JsonLdObject {
  const socialProfiles = Object.values(portfolio.socialLinks).filter((link): link is string =>
    Boolean(link),
  );
  const skills = Array.from(new Set(portfolio.skills.groups.flatMap((group) => group.items)));
  const origin = getSiteOrigin();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolio.profile.name,
    jobTitle: portfolio.profile.title,
    email: portfolio.profile.email,
    address: portfolio.profile.location,
    knowsAbout: skills,
    ...(origin ? { url: origin } : {}),
    ...(socialProfiles.length > 0 ? { sameAs: socialProfiles } : {}),
  };
}

function homeGraph(page: PortfolioPageMetadata): JsonLdObject {
  const origin = getSiteOrigin();
  const website: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: portfolio.site.name,
    ...(origin ? { url: origin } : {}),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [personSchema(), website, pageSchema(page)],
  };
}

function baseMeta(page: PortfolioPageMetadata, type: "website" | "article" = "website") {
  const canonical = getCanonicalUrl(page.path);

  return [
    { title: page.title },
    { name: "description", content: page.description },
    { name: "robots", content: "index,follow" },
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:type", content: type },
    ...(canonical ? [{ property: "og:url", content: canonical }] : []),
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.description },
  ];
}

function jsonLdScript(schema: JsonLdObject) {
  return [
    {
      type: "application/ld+json",
      children: JSON.stringify(schema).replace(
        /[&><\u2028\u2029]/g,
        (character) => jsonLdEscapes[character] ?? character,
      ),
    },
  ];
}

export function pageHead(key: PortfolioRouteKey) {
  const page = portfolio.seo.pages[key];
  const canonical = getCanonicalUrl(page.path);

  return {
    meta: baseMeta(page),
    scripts: jsonLdScript(key === "home" ? homeGraph(page) : pageSchema(page)),
    links: canonical ? [{ rel: "canonical", href: canonical }] : [],
  };
}

export function projectHead(project: Project) {
  const page: PortfolioPageMetadata = {
    path: `/projects/${project.slug}`,
    title: `${project.title} — Case Study | ${portfolio.site.name}`,
    description: project.description,
  };
  const canonical = getCanonicalUrl(page.path);
  const origin = getSiteOrigin();
  const creativeWork: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.overview ?? project.description,
    ...(project.category === "personal"
      ? {
          creator: {
            "@type": "Person",
            name: portfolio.profile.name,
          },
        }
      : {}),
    ...(canonical ? { url: canonical } : {}),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };
  const breadcrumb: JsonLdObject | undefined = origin
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: getCanonicalUrl("/") ?? origin,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: getCanonicalUrl("/work") ?? `${origin}/work`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            ...(canonical ? { item: canonical } : {}),
          },
        ],
      }
    : undefined;

  return {
    meta: baseMeta(page, "article"),
    scripts: jsonLdScript(
      breadcrumb
        ? { "@context": "https://schema.org", "@graph": [creativeWork, breadcrumb] }
        : creativeWork,
    ),
    links: canonical ? [{ rel: "canonical", href: canonical }] : [],
  };
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

export function buildSitemapXml() {
  const origin = getSiteOrigin();
  if (!origin) return undefined;

  const paths = [
    ...Object.values(portfolio.seo.pages).map((page) => page.path),
    ...allProjects()
      .filter((project) => project.caseStudyEnabled)
      .map((project) => `/projects/${project.slug}`),
  ];
  const locations = Array.from(new Set(paths))
    .map((path) => getCanonicalUrl(path))
    .filter((url): url is string => Boolean(url))
    .map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locations}
</urlset>`;
}

export function buildRobotsTxt() {
  const sitemap = getCanonicalUrl("/sitemap.xml");
  return ["User-agent: *", "Allow: /", ...(sitemap ? [`Sitemap: ${sitemap}`] : [])].join("\n");
}
