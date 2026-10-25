import { createRouter, isNotFound, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { allProjects, type Project } from "@/data/portfolio";
import { routeTree } from "@/routeTree.gen";
import { Route as projectRoute } from "@/routes/projects.$slug";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it.each([
    "/",
    "/about",
    "/work",
    "/experience",
    "/expertise",
    "/education",
    "/credentials",
    "/contact",
    "/projects/invora",
    "/projects/pastehub",
    "/projects/nawab-construction",
    "/projects/linkup-social",
    "/projects/linkup-web",
  ])("matches a real page for %s instead of falling back to not found", (pathname) => {
    const router = createRouter({ routeTree });

    const matches = router.matchRoutes(pathname);

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});

describe("Project route loader", () => {
  const loadProject = projectRoute.options.loader as unknown as (context: {
    params: { slug: string };
  }) => { project: Project };

  it.each(allProjects())("loads the existing $title record by slug", (project) => {
    expect(loadProject({ params: { slug: project.slug } }).project).toBe(project);
  });

  it("returns TanStack's not-found result for an unknown slug", () => {
    let thrown: unknown;
    try {
      loadProject({ params: { slug: "not-a-real-project" } });
    } catch (error) {
      thrown = error;
    }
    expect(isNotFound(thrown)).toBe(true);
  });
});
