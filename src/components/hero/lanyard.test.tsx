import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LanyardFallback } from "./lanyard";
import type { LanyardBadgeData } from "./lanyard-types";

const badge: LanyardBadgeData = {
  name: "Haseeb Ahmed",
  title: "Full-Stack Software Engineer",
  location: "Jhansi, India",
  technologies: ["React.js", "Next.js", "Node.js", "FastAPI", "Python"],
  availability: "Open to new opportunities",
};

describe("LanyardFallback", () => {
  it("is server-renderable without a canvas and includes the complete badge information", () => {
    const markup = renderToStaticMarkup(<LanyardFallback badge={badge} />);

    expect(markup).toContain('data-testid="lanyard-fallback"');
    expect(markup).not.toContain("<canvas");
    expect(markup).toContain(badge.name);
    expect(markup).toContain(badge.title);
    expect(markup).toContain(badge.location);
    expect(markup).toContain(badge.availability);
    badge.technologies.forEach((technology) => expect(markup).toContain(technology));
  });

  it("keeps the non-WebGL fallback readable and uses initials when no owner portrait is configured", () => {
    render(<LanyardFallback badge={badge} />);

    expect(screen.getByTestId("lanyard-fallback")).toBeVisible();
    expect(screen.getByText("HA")).toBeVisible();
    expect(screen.getByText(badge.name)).toBeVisible();
    expect(screen.getByText(badge.title)).toBeVisible();
    expect(screen.getByText(badge.location)).toBeVisible();
    expect(screen.getByText(badge.availability!)).toBeVisible();
    badge.technologies.forEach((technology) => {
      expect(screen.getByText(technology)).toBeVisible();
    });
  });
});
