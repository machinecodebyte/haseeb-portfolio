import { describe, expect, it } from "vitest";
import { allProjects, portfolio } from "@/data/portfolio";

describe("Confirmed project classification", () => {
  it("includes exactly five distinct projects in All Work", () => {
    expect(allProjects()).toHaveLength(5);
    expect(new Set(allProjects().map((p) => p.id)).size).toBe(5);
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
    expect(project?.caseStudyEnabled).toBe(false);
    expect(project?.technologies).toEqual([]);
  });
  it("has exactly three company projects", () => {
    expect(portfolio.projects.company).toHaveLength(3);
  });
});
