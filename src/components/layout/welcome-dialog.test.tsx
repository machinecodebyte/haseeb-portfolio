import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { WelcomeDialog } from "@/components/layout/welcome-dialog";
import { completeIntro } from "@/lib/intro";

afterEach(() => {
  vi.useRealTimers();
  window.sessionStorage.clear();
});

describe("WelcomeDialog", () => {
  it("waits for the intro and other dialogs, appears once, and restores scrolling", () => {
    vi.useFakeTimers();
    const view = render(<WelcomeDialog />);

    act(() => vi.advanceTimersByTime(8_000));
    expect(screen.queryByRole("dialog")).toBeNull();

    const otherDialog = document.createElement("div");
    otherDialog.setAttribute("role", "dialog");
    otherDialog.setAttribute("aria-modal", "true");
    document.body.appendChild(otherDialog);
    act(() => {
      completeIntro();
      vi.advanceTimersByTime(250);
    });
    expect(
      screen.queryByRole("dialog", { name: "Welcome to Haseeb Ahmed's Portfolio" }),
    ).toBeNull();

    otherDialog.remove();
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(
      screen.getByRole("dialog", { name: "Welcome to Haseeb Ahmed's Portfolio" }),
    ).toBeInTheDocument();
    expect(window.sessionStorage.getItem("ha:welcome-dialog-shown")).toBe("true");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Okay" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");

    view.unmount();
    render(<WelcomeDialog />);
    act(() => {
      vi.advanceTimersByTime(8_000);
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
