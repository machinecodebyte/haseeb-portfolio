import { createFileRoute } from "@tanstack/react-router";
import { portfolio } from "@/data/portfolio";
import { Footer, Nav, Preloader, SmoothScroll } from "@/components/layout/chrome";
import { Hero, Marquee } from "@/components/sections/hero";
import {
  About,
  Contact,
  Credentials,
  Education,
  Experience,
  Toolkit,
  Work,
} from "@/components/sections/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: portfolio.seo.title },
      { name: "description", content: portfolio.seo.description },
      { property: "og:title", content: portfolio.seo.title },
      { property: "og:description", content: portfolio.seo.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Preloader />
      <SmoothScroll lockUntilIntroComplete />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Experience />
        <Toolkit />
        <Education />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
