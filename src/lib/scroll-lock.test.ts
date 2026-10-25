import { describe, expect, it, vi } from "vitest";

import { isDocumentScrollLocked, lockDocumentScroll } from "@/lib/scroll-lock";

describe("lockDocumentScroll", () => {
  it("keeps nested overlays locked and restores scrolling only after the last release", () => {
    const controller = { stop: vi.fn(), start: vi.fn() };
    const scrollWindow = window as unknown as { __lenis?: typeof controller };
    scrollWindow.__lenis = controller;
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "scroll";

    const releaseFirst = lockDocumentScroll();
    const releaseSecond = lockDocumentScroll();
    expect(controller.stop).toHaveBeenCalledOnce();
    expect(isDocumentScrollLocked()).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");

    releaseFirst();
    releaseFirst();
    expect(controller.start).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toBe("hidden");

    releaseSecond();
    expect(isDocumentScrollLocked()).toBe(false);
    expect(controller.start).toHaveBeenCalledOnce();
    expect(document.documentElement.style.overflow).toBe("auto");
    expect(document.body.style.overflow).toBe("scroll");

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    delete scrollWindow.__lenis;
  });
});
