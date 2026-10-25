import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const socialLinks = vi.hoisted(() => ({ instagram: "", whatsapp: "" }));
const route = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("@/data/portfolio", () => ({ portfolio: { socialLinks } }));
vi.mock("@tanstack/react-router", () => ({ useLocation: () => route }));

import { FloatingSocialLinks } from "@/components/layout/floating-social-links";

let onIntersection: IntersectionObserverCallback;
const observe = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
  socialLinks.instagram = "";
  socialLinks.whatsapp = "";
  route.pathname = "/";
  observe.mockClear();
  disconnect.mockClear();
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function (callback: IntersectionObserverCallback) {
      onIntersection = callback;
      return { observe, disconnect };
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("FloatingSocialLinks", () => {
  it("does not render links when destinations are missing", () => {
    render(<FloatingSocialLinks />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(observe).not.toHaveBeenCalled();
  });

  it("uses configured destinations and yields to footer controls", () => {
    // Reserved .invalid domains make these test-only destinations unambiguously fake.
    socialLinks.instagram = "https://example.invalid/instagram";
    socialLinks.whatsapp = "https://example.invalid/whatsapp";
    const content = () => (
      <>
        <footer data-testid="footer" />
        <FloatingSocialLinks />
      </>
    );
    const view = render(content());
    const instagram = screen.getByRole("link", { name: "Instagram" });
    const whatsapp = screen.getByRole("link", { name: "WhatsApp" });

    expect(instagram).toHaveAttribute("href", socialLinks.instagram);
    expect(whatsapp).toHaveAttribute("href", socialLinks.whatsapp);
    expect(instagram).toHaveClass("min-h-11", "min-w-11");
    expect(whatsapp.querySelector(".lucide-phone")).toBeInTheDocument();
    expect(observe).toHaveBeenCalledWith(screen.getByTestId("footer"));

    act(() => {
      onIntersection(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(instagram).toHaveAttribute("aria-hidden", "true");
    expect(whatsapp).toHaveAttribute("tabindex", "-1");

    act(() => {
      onIntersection(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(instagram).not.toHaveAttribute("aria-hidden");
    expect(whatsapp).not.toHaveAttribute("tabindex");

    route.pathname = "/work";
    view.rerender(content());
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledTimes(2);
  });
});
