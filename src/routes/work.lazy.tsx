import { createLazyFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/layout/page-shell";
import { Work } from "@/components/sections/content";

export const Route = createLazyFileRoute("/work")({
  component: WorkPage,
});

function WorkPage() {
  return (
    <PageShell>
      <Work headingAs="h1" />
    </PageShell>
  );
}
