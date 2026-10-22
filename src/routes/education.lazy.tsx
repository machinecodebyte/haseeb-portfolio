import { createLazyFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/layout/page-shell";
import { Education } from "@/components/sections/content";

export const Route = createLazyFileRoute("/education")({
  component: EducationPage,
});

function EducationPage() {
  return (
    <PageShell>
      <Education headingAs="h1" />
    </PageShell>
  );
}
