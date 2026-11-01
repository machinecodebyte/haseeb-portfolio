import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { portfolio } from "@/data/portfolio";

import { Footer } from "./chrome";
import { FooterLanyardBadge } from "./footer-lanyard-badge";

describe("FooterLanyardBadge", () => {
  it("renders a connected, accessible profile badge from portfolio data", () => {
    render(<FooterLanyardBadge />);

    const badge = screen.getByTestId("footer-lanyard-badge");
    expect(
      screen.getByRole("heading", { name: `${portfolio.profile.name} profile badge` }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: portfolio.profile.name, level: 3 })).toBeVisible();
    expect(screen.getAllByText(portfolio.profile.title)).toHaveLength(2);
    expect(screen.getAllByText(portfolio.profile.locationShort)).toHaveLength(2);
    expect(screen.getByText(portfolio.hero.panelTech.slice(0, 4).join(" / "))).toBeVisible();
    expect(badge.querySelector("svg[aria-hidden='true']")).toBeInTheDocument();
    expect(badge.querySelector(".footer-lanyard-badge__clip")).toBeInTheDocument();
    expect(badge.querySelector(".footer-lanyard-badge__holder")).toBeInTheDocument();
  });

  it("uses pointer transforms without moving the lanyard or requiring touch interaction", () => {
    render(<FooterLanyardBadge />);

    const badge = screen.getByTestId("footer-lanyard-badge");
    vi.spyOn(badge, "getBoundingClientRect").mockReturnValue({
      bottom: 400,
      height: 400,
      left: 0,
      right: 400,
      toJSON: () => ({}),
      top: 0,
      width: 400,
      x: 0,
      y: 0,
    });

    fireEvent.pointerMove(badge, { clientX: 360, clientY: 80, pointerType: "mouse" });
    expect(badge.style.getPropertyValue("--footer-badge-rotate-x")).not.toBe("0deg");
    expect(badge.style.getPropertyValue("--footer-badge-rotate-y")).not.toBe("0deg");

    fireEvent.pointerLeave(badge);
    expect(badge.style.getPropertyValue("--footer-badge-rotate-x")).toBe("0deg");
    expect(badge.style.getPropertyValue("--footer-badge-rotate-y")).toBe("0deg");
  });
});

describe("Footer with profile badge", () => {
  it("adds the badge without replacing existing footer content or contact links", () => {
    render(<Footer />);

    expect(screen.getByTestId("footer-lanyard-badge")).toBeVisible();
    expect(screen.getByText(portfolio.footer.note)).toBeVisible();
    expect(screen.getByText(portfolio.footer.colophon)).toBeVisible();
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      portfolio.socialLinks.github,
    );
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      portfolio.socialLinks.linkedin,
    );
    expect(screen.getByRole("link", { name: /Email/ })).toHaveAttribute(
      "href",
      `mailto:${portfolio.profile.email}`,
    );
  });
});
