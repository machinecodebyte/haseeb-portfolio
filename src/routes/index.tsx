import { createFileRoute } from "@tanstack/react-router";
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
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => pageHead("home"),
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
