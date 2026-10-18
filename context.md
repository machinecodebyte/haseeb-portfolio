# Haseeb Ahmed Portfolio — Technical Context

## 1. Project identity

This is Haseeb Ahmed's public, editorial-style software-engineering portfolio. It is a responsive TanStack Start server-rendered application: the home route presents the portfolio sections and supported projects expose case-study routes. Its visual system uses warm paper, dark ink, orange, and forest accents with oversized editorial typography and purposeful motion.

The project is active and production-oriented. It is deliberately **not a Next.js application**: the repository's project rules state that TanStack Start is platform-fixed, so the existing `/projects/$slug` route is the supported equivalent of the illustrative Next.js dynamic route in the supplied migration brief.

## 2. Technology stack

| Technology               | Version         | Role                                                                |
| ------------------------ | --------------- | ------------------------------------------------------------------- |
| TanStack Start           | 1.168.60        | SSR application framework and request middleware                    |
| TanStack Router          | 1.170.41        | File-based routes, route metadata, loaders, links, and 404 handling |
| React / React DOM        | 19.2.0          | UI rendering                                                        |
| TypeScript               | 5.8.3           | Strict, no-emit application type checking                           |
| Vite                     | 8.1.5           | Development server and production build                             |
| Tailwind CSS             | 4.2.1           | Utility styling, with CSS theme tokens in `src/styles.css`          |
| GSAP / ScrollTrigger     | 3.15.0          | Entrance and scroll-driven animation                                |
| Lenis                    | 1.3.26          | Smooth scrolling when reduced motion is not requested               |
| Lucide React             | 0.575.0         | Icons                                                               |
| Vitest + Testing Library | 4.1.10 / 16.0.0 | Unit and routing tests                                              |

The Vite configuration uses the standard TanStack Start, React, Tailwind, and TypeScript-path plugins directly. It has no platform-specific build wrapper.

## 3. Directory structure

```text
.
├── public/                         # Static resume, favicon, crawler rules
├── src/
│   ├── assets/                     # CDN-pointer JSON modules for project images
│   ├── components/
│   │   ├── layout/                 # Preloader, smooth scroll, navigation, footer
│   │   ├── projects/               # Project image/illustrative-preview renderer
│   │   ├── sections/               # Homepage content sections
│   │   └── ui/                     # Active editorial primitives and button
│   ├── data/portfolio.ts           # Single source of editable portfolio content
│   ├── lib/                        # Motion, error handling, and class helpers
│   ├── routes/                     # TanStack file routes
│   ├── test/                       # Vitest setup and invariants
│   ├── router.tsx                  # Router factory and query-client context
│   ├── routeTree.gen.ts            # Generated route tree; do not edit by hand
│   ├── server.ts                   # SSR entry/error normalization
│   ├── start.ts                    # Start request and CSRF middleware
│   └── styles.css                  # Tailwind import, tokens, utilities, keyframes
├── context.md                      # This technical handoff
├── package.json                    # Scripts and dependencies
├── vite.config.ts                  # Platform-fixed Vite/TanStack configuration
├── tsconfig.json                   # Strict TypeScript settings and `@` alias
├── eslint.config.js                # ESLint and Prettier configuration
└── vitest.config.ts                # jsdom test configuration
```

## 4. Routes, layout, and SEO

| URL               | Source                          | Behavior and data                                                                                                                                                       |
| ----------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`               | `src/routes/index.tsx`          | Renders preloader, navigation, hero, marquee, about, work, experience, toolkit, education, credentials, contact, and footer. Uses `portfolio`.                          |
| `/projects/$slug` | `src/routes/projects.$slug.tsx` | Loader resolves a project via `getProject`. It returns 404 unless the project exists and has `caseStudyEnabled: true`; page data and metadata derive from that project. |
| any unmatched URL | `src/routes/__root.tsx`         | Root not-found component presents a home link.                                                                                                                          |

`src/routes/__root.tsx` supplies the HTML shell, Google font links, favicon, global stylesheet, baseline metadata, React Query provider, error boundary, and TanStack scripts. Home and case-study routes add accurate title, description, Open Graph title/description/type, and Twitter card metadata. No production domain has been confirmed: `portfolio.site.url` remains empty. `public/robots.txt` permits crawlers. There is no generated sitemap or structured-data implementation in the current source.

## 5. Application architecture and components

All page components read content from `src/data/portfolio.ts`; they do not own editable personal or project copy.

| Path                                     | Responsibility                                                                                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/router.tsx`                         | Creates the TanStack Router with a `QueryClient`, route tree, scroll restoration, and preload policy.                                                              |
| `src/routes/index.tsx`                   | Composes the home-page modules.                                                                                                                                    |
| `src/routes/projects.$slug.tsx`          | Builds the case study, reading loader data; includes scroll progress, architecture, gallery, links, and previous/next case-study navigation.                       |
| `src/components/layout/chrome.tsx`       | `Preloader`, `SmoothScroll`, responsive `Nav`, and `Footer`. Navigation observes section visibility, locks body scroll for its mobile dialog, and supports Escape. |
| `src/components/sections/hero.tsx`       | Hero and marquee. Coordinates the preloader event with GSAP hero animation and uses portfolio CTAs/social links.                                                   |
| `src/components/sections/content.tsx`    | `About`, `Work`, `Experience`, `Toolkit`, `Education`, `Credentials`, and `Contact`. `Work` owns the local All Work/Personal/Company filter state.                 |
| `src/components/projects/ProjectArt.tsx` | Shows an owner-supplied CDN image when available, otherwise renders a clearly labelled decorative preview for a project.                                           |
| `src/components/ui/editorial.tsx`        | `MaskedHeading`, `SectionLabel`, magnetic button wrapper, `EdButton`, and `CopyEmail`.                                                                             |
| `src/components/ui/button.tsx`           | Small class-variance-authority/Radix Slot button used by the work filter.                                                                                          |
| `src/lib/animations.ts`                  | Registers ScrollTrigger only in the browser, exposes the reduced-motion check, and implements scoped, cleanup-safe reveal animations.                              |
| `src/lib/utils.ts`                       | `cn` class-name merge helper.                                                                                                                                      |
| `src/start.ts`                           | Start-level error middleware and CSRF middleware for server functions.                                                                                             |
| `src/server.ts`                          | SSR entry wrapper that converts catastrophic server errors into the local HTML error page.                                                                         |
| `src/lib/error-capture.ts`               | Retains detailed error/cause information briefly so the SSR wrapper can log useful failures.                                                                       |
| `src/lib/error-page.ts`                  | Standalone fallback HTML for SSR failures.                                                                                                                         |

There are no app-specific API routes, database clients, server functions, or global state libraries. Shared portfolio state is immutable module data; interaction state is local React state.

## 6. Centralized content management

Edit `src/data/portfolio.ts` for all owner-managed content. It exports the `Project`, `Certification`, `Role`, `Experience`, and `Education` types, the `portfolio` object, `allProjects()`, and `getProject(slug)`.

| Desired change                              | Where to edit                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| Name, contact, resume, social URLs          | `portfolio.site`, `portfolio.profile`, `portfolio.socialLinks`           |
| Titles, descriptions, SEO                   | `portfolio.site`, `portfolio.seo`, and per-project fields                |
| Navigation and section copy                 | `portfolio.navigation` and the matching section object                   |
| Personal project                            | `personal` array                                                         |
| Company project                             | `portfolio.projects.company` array                                       |
| Project screenshots                         | Owner-supplied portable asset plus `coverImage`/`gallery` on the project |
| Experience, skills, education, certificates | Corresponding arrays/objects in `portfolio`                              |
| Conditional sections                        | `portfolio.settings`                                                     |

Current personal projects are **INVORA** and **PasteHub**. Current company work is **Nawab Construction**, **LinkUp Social**, and **LinkUp Web**. The explicit test suite protects this five-project split. Company projects deliberately have no invented technologies or case studies; their cards retain verified live URLs. The home-page All Work filter renders personal and company sections together, while Personal and Company filter choices show their respective categories.

No project screenshot assets are currently bundled. `ProjectArt` renders its existing clearly labelled illustrative fallback when `coverImage` is absent. Add only owner-supplied, platform-independent assets and reference them from `src/data/portfolio.ts`. The real resume is `public/Haseeb-Ahmed-Resume.pdf`, served at `/Haseeb-Ahmed-Resume.pdf`; the header/footer/contact CTAs use `profile.resumeUrl`.

## 7. Design system

`src/styles.css` defines the actual design tokens. Main colors are background `oklch(0.962 0.016 85)` (#F7F2E8), foreground `oklch(0.21 0.02 65)` (#21180F), card #FFFDF8, orange primary `oklch(0.66 0.2 40)` (#F15A24), border #D8CBBB, ink #1B1915, and forest `oklch(0.36 0.07 158)` (#0C4A2E). Radius is 2px.

Google Fonts load Bowlby One/Oswald for display and headings, Inter for body copy, IBM Plex Mono for labels, and Permanent Marker for annotations. `container-ed` caps width at 1440px and uses responsive inline padding. Typography combines `font-display`, `font-heading`, `label-mono`, `line-mask`, paper grain, thin borders, and CSS grid. Tailwind's normal responsive tiers (`sm`, `md`, `lg`, `xl`, `2xl`) drive layout changes; major compositions collapse to single-column or flexible layouts on smaller widths.

## 8. Animation and accessibility

GSAP drives the preloader, hero entrance/parallax, masked headings, `[data-reveal]` scroll reveals, timeline line, and mobile-menu links. `useReveal` scopes GSAP contexts to a component and reverts them at unmount. `SmoothScroll` connects Lenis to GSAP's ticker and destroys it during cleanup. `Magnetic` only enables on fine pointers. CSS supplies the marquee and status-dot animations.

`prefers-reduced-motion` disables GSAP/Lenis setup and CSS marquee/pulse animation. Accessible patterns include semantic sections/headings/lists, labelled primary navigation and mobile dialog, `aria-expanded` filter/toolkit state, keyboard Escape to close the mobile menu, focus-visible outlines, descriptive image alt text, external-link rel protection, and live copy-email feedback. Known limitation: focus is placed in the mobile menu but focus is not fully trapped within it.

## 9. Assets, configuration, and security

`public/favicon.ico`, `public/robots.txt`, and the unchanged resume are the public static assets. No environment-variable names are referenced by application source. The framework can inject `VITE_*` variables through its platform config, but none are consumed by this portfolio.

The SSR layer adds CSRF protection for any future TanStack server functions. There is no authentication, persistence layer, or secret in this repository. Do not place tokens, credentials, or private URLs in `portfolio.ts` or committed configuration.

## 10. Build, tests, and maintenance

```sh
npm install
npm run dev
npm run typecheck
npm run test
npm run lint
npm run build
npm run preview
```

`src/test/portfolio.test.ts` verifies unique project IDs, the exact Personal/Company distribution, and verified company URLs. `src/test/app-routing.test.tsx` verifies that `/` matches a real route. `src/test/setup.ts` loads Testing Library matchers. The generated `src/routeTree.gen.ts` belongs to the router toolchain; do not manually edit it.

## 11. Known limitations

- No deployment domain, sitemap, canonical tag, social-preview image, or structured data is confirmed in source.
- Browser-level responsive, animation, live-link, and PDF download checks require a running browser and were not encoded as automated tests.
- Fonts are loaded from Google Fonts at runtime.
- The app intentionally remains TanStack Start rather than Next.js because of the repository platform constraint.

## 12. Instructions for future coding assistants

1. Read this file and the relevant source before making changes; source code is the final authority if it has evolved.
2. Keep all editable portfolio content in `src/data/portfolio.ts`; components should only consume it.
3. Preserve the editorial visual system, responsive behavior, resume download, verified links, and personal/company separation.
4. Do not invent projects, URLs, certificates, metrics, screenshots, or claims. Empty arrays intentionally render editorial empty states.
5. Preserve GSAP lifecycle cleanup and reduced-motion behavior. Make browser-global access only from effects or existing browser guards.
6. Make focused TypeScript-safe changes; avoid duplicate components and unnecessary dependencies.
7. Retain TanStack Start and its direct Vite plugin configuration unless a framework migration is explicitly requested.
8. Update this document after material architecture, route, data-model, asset, or animation changes.

In short: TanStack Start renders a centralized, data-driven editorial portfolio; reusable section/layout primitives implement it; GSAP/Lenis provide progressively enhanced motion; and a small test suite protects critical project-data and route invariants.
