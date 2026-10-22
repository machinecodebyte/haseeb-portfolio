import { createLazyFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/layout/page-shell";
import { Toolkit } from "@/components/sections/content";

export const Route = createLazyFileRoute("/expertise")({
  component: ExpertisePage,
});

function ExpertisePage() {
  return (
    <PageShell>
      <Toolkit headingAs="h1" />
    </PageShell>
  );
}
