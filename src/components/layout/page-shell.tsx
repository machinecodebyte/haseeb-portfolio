import { type ReactNode } from "react";

import { Footer, Nav, SmoothScroll } from "@/components/layout/chrome";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main className="pt-20 sm:pt-24">{children}</main>
      <Footer />
    </>
  );
}
