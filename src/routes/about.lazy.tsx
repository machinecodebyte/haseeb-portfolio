import { createLazyFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/layout/page-shell";
import { About } from "@/components/sections/content";

export const Route = createLazyFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell>
      <About headingAs="h1" />
    </PageShell>
  );
}
