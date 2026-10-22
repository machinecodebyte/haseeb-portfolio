import { createFileRoute } from "@tanstack/react-router";

import { RouteLoading } from "@/components/layout/route-loading";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("contact"),
  pendingComponent: RouteLoading,
  pendingMs: 150,
  pendingMinMs: 150,
});
