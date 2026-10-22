import { createLazyFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/layout/page-shell";
import { Credentials } from "@/components/sections/content";

export const Route = createLazyFileRoute("/credentials")({
  component: CredentialsPage,
});

function CredentialsPage() {
  return (
    <PageShell>
      <Credentials headingAs="h1" />
    </PageShell>
  );
}
