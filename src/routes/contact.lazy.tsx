import { createLazyFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/layout/page-shell";
import { Contact } from "@/components/sections/content";

export const Route = createLazyFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell>
      <Contact headingAs="h1" />
    </PageShell>
  );
}
