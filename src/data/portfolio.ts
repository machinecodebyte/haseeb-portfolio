/**
 * SINGLE SOURCE OF TRUTH — edit everything about the portfolio here.
 * Components only read from this file. Optional fields can be omitted;
 * the UI hides any section, link or button whose data is missing.
 */

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: "personal" | "company";
  /** true until the owner confirms personal vs. company ownership */
  categoryPendingConfirmation?: boolean;
  featured: boolean;
  company?: string;
  client?: string;
  confidential?: boolean;
  role?: string;
  year?: string;
  description: string;
  overview?: string;
  problem?: string;
  solution?: string;
  architecture?: { layer: string; items: string[] }[];
  contributions?: string[];
  features?: string[];
  challenges?: string[];
  results?: string[];
  technologies: string[];
  coverImage?: string;
  gallery?: string[];
  liveUrl?: string;
  githubUrl?: string;
  caseStudyEnabled: boolean;
  status?: string;
  theme?: "ink" | "forest" | "paper";
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  issuedAt?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  skills?: string[];
  featured?: boolean;
};

export type Role = {
  title: string;
  start: string;
  end: string;
  promotion?: boolean;
  responsibilities: string[];
};
export type Experience = { company: string; start: string; end: string; roles: Role[] };
export type Education = {
  institution: string;
  degree: string;
  specialization?: string;
  start: string;
  end: string;
  status: string;
  focus: string[];
};

export type PortfolioRouteKey =
  "home" | "about" | "work" | "experience" | "expertise" | "education" | "credentials" | "contact";

export type PortfolioPageMetadata = {
  path: string;
  title: string;
  description: string;
};

const personal: Project[] = [
  {
    id: "invora",
    slug: "invora",
    title: "INVORA",
    subtitle: "Inventory & Forecasting Platform",
    category: "personal",
    featured: true,
    description:
      "A full-stack inventory and sales management platform that combines operational workflows with forecasting and analytical insights.",
    overview:
      "INVORA brings products, stock, sales and forecasting into one workspace. A Next.js frontend talks to FastAPI services, while background workers handle heavier jobs such as forecasting and reports.",
    architecture: [
      { layer: "Client", items: ["Next.js", "Vercel"] },
      { layer: "API", items: ["FastAPI", "CORS", "Health & readiness checks"] },
      { layer: "Data", items: ["Prisma", "Database"] },
      { layer: "Workers", items: ["Redis", "RQ", "Render"] },
    ],
    features: [
      "Product management",
      "Inventory management",
      "Sales transactions",
      "Sales forecasting",
      "Reorder recommendations",
      "Analytics",
      "Reports",
      "Background jobs",
      "System settings",
    ],
    contributions: [
      "Connected the Next.js frontend with FastAPI APIs.",
      "Integrated ML forecasting into the sales workflow.",
      "Used Prisma along with Redis/RQ worker flows for background jobs.",
      "Configured CORS plus health and readiness checks.",
      "Worked with Vercel and Render in the production setup.",
    ],
    technologies: ["Next.js", "FastAPI", "Prisma", "Redis", "RQ", "Vercel", "Render"],
    liveUrl: "https://invora-web.vercel.app/",
    caseStudyEnabled: true,
    status: "Live",
    theme: "ink",
  },
  {
    id: "pastehub",
    slug: "pastehub",
    title: "PasteHub",
    subtitle: "Code Snippet Manager",
    category: "personal",
    featured: false,
    description:
      "A developer productivity application for storing, organizing, and reusing code snippets and text notes.",
    overview:
      "PasteHub gives developers one organised place for the snippets and notes they reach for every day — with highlighting, one-click copying and reusable templates.",
    features: [
      "Syntax highlighting",
      "Clipboard copying",
      "Dynamic routing",
      "Reusable templates",
      "Organized snippet management",
      "Responsive interface",
      "Developer workflow improvements",
    ],
    technologies: ["React.js", "JavaScript", "Tailwind CSS"],
    // liveUrl / githubUrl: not supplied yet — buttons stay hidden until added
    caseStudyEnabled: true,
    theme: "forest",
  },
];

export const portfolio = {
  site: {
    name: "Haseeb Ahmed",
    monogram: "HA.",
    edition: "EDITION 001",
    year: "2026",
    title: "The Engineer's Edition",
    url: "", // set when published, e.g. https://haseebahmed.dev
  },
  seo: {
    title: "Haseeb Ahmed — Full-Stack Software Engineer | The Engineer's Edition",
    description:
      "Portfolio of Haseeb Ahmed, a full-stack software engineer building web experiences, backend systems and intelligent applications.",
    pages: {
      home: {
        path: "/",
        title: "Haseeb Ahmed — Full-Stack Software Engineer | The Engineer's Edition",
        description:
          "Portfolio of Haseeb Ahmed, a full-stack software engineer building web experiences, backend systems and intelligent applications.",
      },
      about: {
        path: "/about",
        title: "About Haseeb Ahmed — Full-Stack Software Engineer",
        description:
          "Learn about Haseeb Ahmed's full-stack engineering work across frontend and backend web applications, practical systems and machine learning study.",
      },
      work: {
        path: "/work",
        title: "Selected Work — Haseeb Ahmed",
        description:
          "Explore Haseeb Ahmed's personal projects and company-delivered web work, including INVORA, PasteHub and selected Linkup Group websites.",
      },
      experience: {
        path: "/experience",
        title: "Experience — Haseeb Ahmed",
        description:
          "Review Haseeb Ahmed's software engineering and people and business operations experience at Linkup Group Pvt Ltd.",
      },
      expertise: {
        path: "/expertise",
        title: "Expertise — Haseeb Ahmed",
        description:
          "See Haseeb Ahmed's technology toolkit across frontend engineering, backend systems, data, motion engineering and AI and ML exploration.",
      },
      education: {
        path: "/education",
        title: "Education — Haseeb Ahmed",
        description:
          "View Haseeb Ahmed's MCA specialisation in Machine Learning and Bachelor of Computer Applications education.",
      },
      credentials: {
        path: "/credentials",
        title: "Credentials — Haseeb Ahmed",
        description:
          "See the current credentials section for Haseeb Ahmed's engineering portfolio.",
      },
      contact: {
        path: "/contact",
        title: "Contact Haseeb Ahmed",
        description:
          "Contact Haseeb Ahmed about software engineering roles, projects and ideas, or download the current resume.",
      },
    } satisfies Record<PortfolioRouteKey, PortfolioPageMetadata>,
  },
  profile: {
    name: "Haseeb Ahmed",
    title: "Full-Stack Software Engineer",
    focus: "AI/ML applications, scalable web systems & frontend engineering",
    location: "Jhansi, Uttar Pradesh, India",
    locationShort: "Jhansi, India",
    email: "tech.haseebahmed@gmail.com",
    phone: "+91 73552 38033",
    resumeUrl: "/Haseeb-Ahmed-Resume.pdf",
    resumeDownloadLabel: "Download Resume",
    availability: { show: true, label: "Open to new opportunities" },
  },
  socialLinks: {
    github: "https://github.com/machinecodebyte",
    linkedin: "https://www.linkedin.com/in/haseeb-ahmed-8166b0157",
  },
  navigation: [
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Experience", href: "/experience" },
    { label: "Expertise", href: "/expertise" },
    { label: "Education", href: "/education" },
    { label: "Credentials", href: "/credentials" },
    { label: "Contact", href: "/contact" },
  ] as const,
  hero: {
    eyebrow: "Independent engineering portfolio — Edition 001",
    status: "[ System status: operational ]",
    headline: ["Building", "Digital", "Experiences"],
    accentWord: "Digital",
    headlineEnd: "that work.",
    intro:
      "Hi, I'm Haseeb Ahmed, a full-stack software engineer building thoughtful web experiences, practical backend systems, and intelligent applications.",
    annotation: "From interfaces to infrastructure.",
    panelTech: ["React.js", "Next.js", "Node.js", "FastAPI", "Python"],
    ctaPrimary: "View selected work",
    ctaSecondary: "Contact me",
  },
  marquee: [
    "Design",
    "Development",
    "Engineering",
    "Intelligent Systems",
    "Interfaces",
    "Infrastructure",
  ],
  about: {
    label: "01 / The Engineer",
    heading: ["More than code.", "Built around problem-solving."],
    statement: "Good software is a quiet agreement between the interface and the infrastructure.",
    paragraphs: [
      "Haseeb Ahmed is a software engineer with hands-on experience across frontend and backend web application development.",
      "His work spans React.js, Next.js, JavaScript, Tailwind CSS, Node.js, Express.js, FastAPI and REST APIs — along with deployment, debugging and performance improvements.",
      "At Linkup Group Pvt Ltd he progressed from Software Engineer to People & Business Operations Lead, while continuing his engineering responsibilities.",
      "He is currently pursuing an MCA specialising in Machine Learning.",
    ],
    modules: [
      { k: "Primary expertise", v: "Full-stack web applications" },
      { k: "Engineering philosophy", v: "Reusable, readable, reliable" },
      { k: "Learning focus", v: "Machine learning & data analytics" },
      { k: "Location", v: "Jhansi, India" },
    ],
  },
  work: {
    label: "02 / Selected Work",
    heading: ["Selected", "work."],
    personalLabel: "Personal projects / 01",
    companyLabel: "Client & company work / 02",
    companyHeading: ["Engineering delivered", "in the real world."],
    companyDescription:
      "Selected web applications and digital solutions contributed to through professional engineering work.",
    companyEmpty: "Selected professional work is being documented.",
  },
  projects: {
    personal,
    company: [
      {
        id: "nawab-construction",
        slug: "nawab-construction",
        title: "Nawab Construction",
        subtitle: "Construction Services Website",
        category: "company",
        featured: false,
        company: "Linkup Group Pvt Ltd",
        description:
          "A construction services web experience showcasing residential and commercial construction, renovation solutions, architecture services, pricing plans, and customer enquiry features.",
        liveUrl: "https://www.nawabconstruction.com/",
        technologies: [],
        caseStudyEnabled: false,
        theme: "ink",
      },
      {
        id: "linkup-social",
        slug: "linkup-social",
        title: "LinkUp Social",
        subtitle: "Digital Agency Website",
        category: "company",
        featured: false,
        company: "Linkup Group Pvt Ltd",
        description:
          "A modern digital agency website presenting branding, digital marketing, web solutions, agency expertise, and selected client work through an engaging interactive experience.",
        liveUrl: "https://linkupsocial.in/",
        technologies: [],
        caseStudyEnabled: false,
        theme: "paper",
      },
      {
        id: "linkup-web",
        slug: "linkup-web",
        title: "LinkUp Web",
        subtitle: "Web Development Agency Website",
        category: "company",
        featured: false,
        company: "Linkup Group Pvt Ltd",
        description:
          "A modern web development agency website showcasing custom development services, digital solutions, selected projects, case studies, and client enquiry experiences.",
        liveUrl: "https://linkupweb.in/",
        technologies: [],
        caseStudyEnabled: false,
        theme: "ink",
      },
    ] as Project[],
  },
  experience: {
    label: "03 / Career Journal",
    heading: ["A journey through", "engineering & leadership"],
    items: [
      {
        company: "Linkup Group Pvt Ltd",
        start: "Jul 2025",
        end: "Sep 2026",
        roles: [
          {
            title: "Software Engineer",
            start: "Jul 2025",
            end: "Aug 2026",
            responsibilities: [
              "Built and maintained responsive websites and web applications.",
              "Worked with React.js, JavaScript, HTML5, CSS3, Tailwind CSS, Node.js and Express.js.",
              "Created reusable UI components and integrated REST APIs.",
              "Worked on backend and database-driven features.",
              "Handled testing, debugging and application performance improvements.",
              "Supported deployments and production systems.",
              "Collaborated with designers and other team members.",
            ],
          },
          {
            title: "People & Business Operations Lead",
            start: "Aug 2026",
            end: "Sep 2026",
            promotion: true,
            responsibilities: [
              "Led day-to-day people and business operations.",
              "Continued hands-on software engineering responsibilities.",
              "Coordinated team priorities and managed project follow-ups.",
              "Supported internal communication.",
              "Coordinated delivery across client and internal projects.",
              "Worked with technical and business teams to resolve blockers and keep execution moving.",
            ],
          },
        ],
      },
    ] as Experience[],
  },
  skills: {
    label: "04 / The Toolkit",
    heading: ["The technologies", "behind the work."],
    groups: [
      {
        id: "frontend",
        title: "Frontend Engineering",
        visual: "browser",
        items: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Responsive Web Design"],
        note: "Component-driven interfaces that adapt to every screen.",
      },
      {
        id: "backend",
        title: "Backend Systems",
        visual: "api",
        items: ["Node.js", "Express.js", "FastAPI", "REST APIs"],
        note: "APIs and services that connect the product together.",
      },
      {
        id: "languages",
        title: "Languages",
        visual: "code",
        items: ["JavaScript (ES6+)", "Python", "C", "C++", "Java"],
        note: "The fundamentals, across paradigms.",
      },
      {
        id: "data",
        title: "Databases",
        visual: "data",
        items: ["MongoDB", "MySQL", "Prisma"],
        note: "Modelling and querying relational and document data.",
      },
      {
        id: "motion",
        title: "Motion Engineering",
        visual: "motion",
        items: ["GSAP", "ScrollTrigger"],
        note: "Purposeful motion that guides attention.",
      },
      {
        id: "tools",
        title: "Development Workflow",
        visual: "git",
        items: ["Git", "GitHub", "VS Code", "Postman", "Docker", "Redis"],
        note: "Version control, testing and containerised tooling.",
      },
      {
        id: "ai",
        title: "AI / ML Exploration",
        visual: "forecast",
        items: ["Python", "ML forecasting (INVORA)", "Data analytics"],
        note: "Applied through INVORA's forecasting and current MCA specialisation.",
      },
    ],
  },
  education: {
    label: "05 / Education",
    heading: ["The foundations", "behind the engineering."],
    items: [
      {
        institution: "Lovely Professional University",
        degree: "Master of Computer Applications (MCA)",
        specialization: "Machine Learning",
        start: "Aug 2024",
        end: "Present",
        status: "Pursuing",
        focus: ["Machine learning algorithms", "Python", "Data analytics"],
      },
      {
        institution: "Bundelkhand University",
        degree: "Bachelor of Computer Applications (Honours)",
        start: "Oct 2021",
        end: "Jul 2024",
        status: "Completed",
        focus: ["Computer science", "Programming", "Databases", "Web development"],
      },
    ] as Education[],
  },
  certifications: {
    label: "06 / Credentials",
    heading: ["Learning documented.", "Knowledge applied."],
    empty: "Credentials are being curated.",
    items: [] as Certification[],
  },
  contact: {
    label: "07 / Contact",
    heading: ["Let's build", "something", "that works."],
    copy: "Have a role, a project or an idea worth engineering? My inbox is open.",
    copyEmailLabel: "Copy email",
  },
  footer: {
    note: "Designed & engineered by Haseeb Ahmed.",
    colophon: "Set in Bowlby One, Oswald, Inter & IBM Plex Mono.",
  },
  settings: {
    showPreloader: true,
    showMarquee: true,
    showCertifications: true,
    showCompanyWork: true,
  },
};

export const allProjects = (): Project[] => [
  ...portfolio.projects.personal,
  ...portfolio.projects.company,
];
export const getProject = (slug: string) => allProjects().find((p) => p.slug === slug);
