## Project rules

- All editable portfolio content lives in `src/data/portfolio.ts`; components only read from it. Why: owner updates the whole site from one file.
- Built on TanStack Start (platform-fixed); `/projects/$slug` is the project-detail route. Why: the framework is established and production-ready.
- Never invent projects, URLs, certificates, metrics, or media; empty arrays render editorial empty states. Why: owner's accuracy requirement.
- Use only owner-supplied, platform-independent project media referenced from the central portfolio data; the unchanged resume is a static public PDF. Why: media remains portable and owner-editable.
