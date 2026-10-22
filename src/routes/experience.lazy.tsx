import { createLazyFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/layout/page-shell";
import { Experience } from "@/components/sections/content";

export const Route = createLazyFileRoute("/experience")({
  component: ExperiencePage,
});

function ExperiencePage() {
  return (
    <PageShell>
      <Experience headingAs="h1" />
    </PageShell>
  );
}
