import { createFileRoute } from "@tanstack/react-router";

import { buildSitemapXml } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const sitemap = buildSitemapXml();
        if (!sitemap) {
          return new Response(
            "Sitemap is unavailable until the production site URL is configured.",
            {
              status: 404,
              headers: { "content-type": "text/plain; charset=utf-8" },
            },
          );
        }

        return new Response(sitemap, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
