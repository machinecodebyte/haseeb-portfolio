import { describe, expect, it } from "vitest";
import { allProjects, getProject, portfolio } from "@/data/portfolio";
import { buildSitemapXml, projectHead } from "@/lib/seo";

describe("Confirmed project classification", () => {
  it("includes exactly five distinct projects in All Work", () => {
    expect(allProjects()).toHaveLength(5);
    expect(new Set(allProjects().map((p) => p.id)).size).toBe(5);
    expect(new Set(allProjects().map((p) => p.slug)).size).toBe(5);
    expect(allProjects().every((p) => p.caseStudyEnabled)).toBe(true);
  });
  it("keeps only INVORA and PasteHub personal", () => {
    expect(portfolio.projects.personal.map((p) => p.title)).toEqual(["INVORA", "PasteHub"]);
    expect(
      portfolio.projects.personal.every(
        (p) => p.category === "personal" && !p.categoryPendingConfirmation,
      ),
    ).toBe(true);
  });
  it.each([
    ["Nawab Construction", "https://www.nawabconstruction.com/"],
    ["LinkUp Social", "https://linkupsocial.in/"],
    ["LinkUp Web", "https://linkupweb.in/"],
  ])("attributes %s to company work with its correct live URL", (title, url) => {
    const project = portfolio.projects.company.find((p) => p.title === title);
    expect(project?.category).toBe("company");
    expect(project?.company).toBe("Linkup Group Pvt Ltd");
    expect(project?.liveUrl).toBe(url);
    expect(project?.caseStudyEnabled).toBe(true);
    expect(project?.technologies).toEqual([]);
  });
  it("has exactly three company projects", () => {
    expect(portfolio.projects.company).toHaveLength(3);
  });
});

describe("Case study content and links", () => {
  it.each([
    ["invora", "INVORA"],
    ["pastehub", "PasteHub"],
    ["nawab-construction", "Nawab Construction"],
    ["linkup-social", "LinkUp Social"],
    ["linkup-web", "LinkUp Web"],
  ])("finds the %s case study without duplicating its project", (slug, title) => {
    const project = getProject(slug);
    expect(project?.title).toBe(title);
    expect(project?.caseStudyEnabled).toBe(true);
    expect(project?.caseStudySections?.length).toBeGreaterThan(0);
  });

  it("keeps the verified INVORA preview and separate source links", () => {
    const project = getProject("invora");
    expect(project?.liveUrl).toBe("https://invora-web.vercel.app/");
    expect(project?.sourceLinks?.map((link) => link.url)).toEqual(
      expect.arrayContaining([
        "https://github.com/machinecodebyte/invora-web",
        "https://github.com/machinecodebyte/invora-api",
      ]),
    );
  });

  it("does not add an unverified public preview or repository for PasteHub", () => {
    const project = getProject("pastehub");
    expect(project?.liveUrl).toBeFalsy();
    expect(project?.githubUrl).toBeFalsy();
    expect(project?.sourceLinks ?? []).toEqual([]);
  });

  it("does not resolve an unknown project slug", () => {
    expect(getProject("not-a-real-project")).toBeUndefined();
  });
});

describe("Case study metadata", () => {
  it.each(allProjects())("uses $title and its description for the project head", (project) => {
    const head = projectHead(project);
    expect(head.meta).toContainEqual({
      title: `${project.title} — Case Study | ${portfolio.site.name}`,
    });
    expect(head.meta).toContainEqual({ name: "description", content: project.description });
  });

  it.each(portfolio.projects.company)(
    "does not claim individual authorship of the $title company website",
    (project) => {
      const [script] = projectHead(project).scripts;
      if (!script || typeof script.children !== "string") {
        throw new Error("Project structured data is missing.");
      }
      const schema = JSON.parse(script.children) as {
        "@graph"?: { "@type": string; creator?: unknown }[];
      };
      const creativeWork =
        schema["@graph"]?.find((entry) => entry["@type"] === "CreativeWork") ?? schema;
      expect(creativeWork).not.toHaveProperty("creator");
    },
  );

  it("includes every enabled project in the sitemap when an origin is configured", () => {
    const originalUrl = portfolio.site.url;
    try {
      portfolio.site.url = "https://example.test";
      const sitemap = buildSitemapXml();
      expect(sitemap).toBeDefined();
      for (const project of allProjects()) {
        expect(sitemap).toContain(`<loc>https://example.test/projects/${project.slug}</loc>`);
      }
    } finally {
      portfolio.site.url = originalUrl;
    }
  });
});
