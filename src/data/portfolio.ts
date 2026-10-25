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
  caseStudySections?: {
    title: string;
    intro?: string;
    paragraphs?: string[];
    items?: { title: string; description: string }[];
  }[];
  sourceLinks?: { label: string; url: string }[];
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

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  /** A confirmed public Instagram profile URL. */
  instagram?: string;
  /** A confirmed full WhatsApp deep link, for example https://wa.me/<digits>. */
  whatsapp?: string;
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
      "INVORA brings products, stock, sales history and demand forecasting into one workspace. It connects day-to-day inventory operations with a clearer view of what may need replenishing next.",
    problem:
      "Inventory decisions depend on more than a current stock count. Product records, stock movements and sales history must be considered together before a business can anticipate demand and decide what to reorder.",
    solution:
      "A Next.js interface brings these workflows together against a FastAPI backend. Sales data feeds forecast runs, and the resulting demand estimates inform reorder recommendations alongside current stock and safety-stock settings.",
    architecture: [
      { layer: "Interface", items: ["Next.js", "API client", "React Query"] },
      { layer: "Application", items: ["FastAPI", "Authentication", "Domain modules"] },
      { layer: "Processing", items: ["Redis", "RQ workers", "Forecasting"] },
      { layer: "Persistence", items: ["PostgreSQL", "SQLAlchemy", "Forecast results"] },
    ],
    features: [
      "Product catalog and stock movements",
      "Sales transactions and CSV imports",
      "Dashboard analytics and reports",
      "Demand forecasts and reorder recommendations",
    ],
    contributions: [
      "Connected the Next.js frontend with FastAPI APIs.",
      "Integrated ML forecasting into the sales workflow.",
    ],
    caseStudySections: [
      {
        title: "From inventory records to action",
        intro:
          "The product connects operational data with the steps needed to review demand and decide what to replenish.",
        items: [
          {
            title: "Products and stock",
            description:
              "Product records and inventory movements provide the catalog and current stock context for later analysis.",
          },
          {
            title: "Sales history",
            description:
              "Sales transactions and validated CSV imports bring historical demand into the system for review and forecasting.",
          },
          {
            title: "Forecast and review",
            description:
              "Forecast runs produce stored results, with model evaluation metrics available when the data supports them. Dashboard views and reports make the results easier to inspect.",
          },
          {
            title: "Replenishment",
            description:
              "The reorder policy compares predicted demand and safety stock with current inventory to identify a positive stock gap.",
          },
        ],
      },
      {
        title: "Inside the forecasting workflow",
        paragraphs: [
          "The backend constructs lag and rolling-history features and uses a scikit-learn Random Forest regressor when enough history is available. Sparse histories follow a recent-average fallback; the implementation does not establish a general accuracy claim.",
          "Forecast work can be queued through Redis and RQ rather than holding a request open. The application records job state and persists forecast outputs with its SQLAlchemy-backed PostgreSQL data layer.",
        ],
      },
      {
        title: "Application boundaries",
        paragraphs: [
          "The frontend calls versioned backend modules for authentication, products, inventory, sales, forecasts, recommendations, reports and settings. The API client keeps access tokens in memory and uses a refresh-cookie flow to renew sessions.",
          "These details describe the implementation in the supplied repositories; they are not a claim about production capacity or measured business impact.",
        ],
      },
    ],
    technologies: [
      "Next.js",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "SQLAlchemy",
      "Redis",
      "RQ",
      "scikit-learn",
    ],
    liveUrl: "https://invora-web.vercel.app/",
    sourceLinks: [
      { label: "Frontend GitHub", url: "https://github.com/machinecodebyte/invora-web" },
      { label: "Backend GitHub", url: "https://github.com/machinecodebyte/invora-api" },
    ],
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
      "PasteHub is a developer-focused paste and snippet platform with separate frontend and backend applications. Its documented workflows bring code editing, organisation, sharing and reuse into one place.",
    problem:
      "Useful snippets and notes can become difficult to find and reuse when they are scattered across files, conversations and tools. Developers need an organised way to create, retrieve and share that material.",
    solution:
      "The documented application combines an editor and workspace-oriented interface with a modular API for managing pastes, access, history and related developer workflows.",
    architecture: [
      { layer: "Browser", items: ["React 19", "React Router", "Monaco Editor"] },
      { layer: "Client services", items: ["API client", "React Query", "Zustand"] },
      { layer: "Application", items: ["Express", "Validation", "Auth & services"] },
      { layer: "Data & events", items: ["Prisma / PostgreSQL", "Redis", "Socket.IO"] },
    ],
    features: [
      "Paste creation, editing and syntax highlighting",
      "Workspaces, folders, tags and search",
      "Sharing, access controls and version history",
      "Templates, import and export",
    ],
    caseStudySections: [
      {
        title: "A workspace for reusable material",
        intro:
          "The supplied frontend and backend audits describe a broad set of developer workflows across the two applications.",
        items: [
          {
            title: "Create and organise",
            description:
              "The frontend uses Monaco for code editing, while paste, workspace, folder, tag and search modules organise material for retrieval.",
          },
          {
            title: "Share and revisit",
            description:
              "Documented access controls, sharing and version-history flows support working with saved content beyond its first edit.",
          },
          {
            title: "Extend the workflow",
            description:
              "Templates, import and export, analytics, notifications and AI assistance are represented in the supplied implementation audits; live integrations were not verified.",
          },
        ],
      },
      {
        title: "Frontend to backend",
        paragraphs: [
          "React Router organises the interface; TanStack React Query and Zustand handle server and client state. React Hook Form and Zod support form handling and validation, while a shared service layer sends browser requests to the API.",
          "The Express application separates request validation, authentication and authorization from its services and repositories. Prisma connects the data layer to PostgreSQL; Redis and Socket.IO support documented cache and realtime boundaries.",
        ],
      },
      {
        title: "Security and current status",
        paragraphs: [
          "The audits describe Argon2id password hashing, access tokens and hashed refresh tokens. On the frontend, the API client includes credentials, keeps the access token in memory and retries token refresh; user changes clear the query cache.",
          "The supplied audits do not verify a running deployment, live database, Redis, realtime connections or external providers. Billing is documented as mock-only, and the browser CLI approval screen is absent, so those flows are not presented as production-ready.",
        ],
      },
    ],
    technologies: [
      "React 19",
      "Vite",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "Socket.IO",
    ],
    // liveUrl / githubUrl: not supplied yet — buttons stay hidden until added
    caseStudyEnabled: true,
    status: "Implementation documented; live operation unverified",
    theme: "forest",
  },
];

const socialLinks: SocialLinks = {
  github: "https://github.com/machinecodebyte",
  linkedin: "https://www.linkedin.com/in/haseeb-ahmed-8166b0157",
  instagram: "https://www.instagram.com/_ahmedhaseeb_/",
  whatsapp: "https://wa.me/917355238033",
};

export const portfolio = {
  site: {
    name: "Haseeb Ahmed",
    monogram: "HA.",
    edition: "EDITION 001",
    year: "2026",
    title: "The Engineer's Edition",
    url: "https://haseeb-portfolio-gules.vercel.app/", // set when published, e.g. https://haseebahmed.dev
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
  socialLinks,
  welcome: {
    delayMs: 8_000,
    heading: "Welcome to {name}'s Portfolio",
    description:
      "Hi there! I'm {name}, a software engineer passionate about building thoughtful digital experiences. Explore my projects, skills, and journey. Thanks for stopping by!",
    dismissLabel: "Okay",
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
        overview:
          "Nawab Construction presents a construction-services business to prospective customers, bringing its residential, commercial, renovation and design offerings into a single public website.",
        problem:
          "People considering a construction project need to understand the available services and find a straightforward way to begin an enquiry.",
        solution:
          "The website introduces the business and its services, then directs visitors toward a quote request or direct contact for an estimate.",
        features: [
          "Residential and commercial construction services",
          "Renovation, architecture and design information",
          "Pricing plans and plot-area estimate interface",
          "Quote and direct-contact routes",
        ],
        caseStudySections: [
          {
            title: "A construction enquiry journey",
            items: [
              {
                title: "Discover the offering",
                description:
                  "The site presents construction, renovation, architecture and design services so visitors can identify the work relevant to their project.",
              },
              {
                title: "Explore the project scope",
                description:
                  "Service information includes planning and design alongside construction. A pricing section presents multiple plans and a plot-area estimate interface for comparing a project with a selected plan.",
              },
              {
                title: "Ask for an estimate",
                description:
                  "The site's FAQ describes a quote form, phone and WhatsApp as ways for prospective customers to start an enquiry.",
              },
            ],
          },
          {
            title: "Professional context",
            paragraphs: [
              "This project is included in the portfolio's Linkup Group company work. The available information identifies the delivered website but does not establish a project-specific individual role or implementation stack.",
            ],
          },
        ],
        liveUrl: "https://www.nawabconstruction.com/",
        technologies: [],
        caseStudyEnabled: true,
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
        overview:
          "LinkUp Social presents a digital agency through its services, company story and selected work, with a clear route for prospective clients to make contact.",
        problem:
          "A multidisciplinary agency needs to communicate its identity and range of services while helping visitors discover relevant work and start a conversation.",
        solution:
          "The site combines an expressive agency introduction with service messaging, client stories, project showcases and enquiry links.",
        features: [
          "Digital agency and service presentation",
          "Client logos and selected work",
          "Founder and company story",
          "Contact and quote pathways",
        ],
        caseStudySections: [
          {
            title: "How the experience is organised",
            items: [
              {
                title: "Identity first",
                description:
                  "The homepage opens with a strong agency statement and illustrations of familiar social and digital platforms, introducing its focus through visual cues.",
              },
              {
                title: "Services and people",
                description:
                  "Repeated service labels, a founder introduction and links to the team and services sections give visitors multiple ways to understand the agency.",
              },
              {
                title: "Work and conversation",
                description:
                  "A client-logo strip, client stories and selected projects lead into a work showcase, while quote and contact links offer a next step.",
              },
            ],
          },
          {
            title: "Professional context",
            paragraphs: [
              "The site is part of the portfolio's Linkup Group company work. The available evidence supports the visible experience, but not a specific individual contribution, underlying stack or measured project outcome.",
            ],
          },
        ],
        liveUrl: "https://linkupsocial.in/",
        technologies: [],
        caseStudyEnabled: true,
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
        overview:
          "LinkUp Web introduces a web-development agency through service information, selected projects, case-study discovery and contact pathways.",
        problem:
          "Visitors evaluating a web partner need to understand the agency's approach, see examples of its work and know how to discuss a project.",
        solution:
          "The website connects a bold opening statement with service and strategy explanations, a selected-work area and prominent project-enquiry actions.",
        features: [
          "Website design, development and strategy content",
          "Selected project and case-study entry points",
          "Services, company and blog navigation",
          "Contact, quote and project-enquiry actions",
        ],
        caseStudySections: [
          {
            title: "From first impression to project enquiry",
            items: [
              {
                title: "Position the studio",
                description:
                  "Large display typography and visual technology ribbons introduce the agency alongside direct contact and quote actions.",
              },
              {
                title: "Explain the approach",
                description:
                  "Service and website-strategy sections describe design, development and user-experience offerings without requiring visitors to infer the scope from a project list.",
              },
              {
                title: "Explore and connect",
                description:
                  "Selected-work and case-study areas sit alongside navigation to services, company information and contact, providing paths from discovery to an enquiry.",
              },
            ],
          },
          {
            title: "Professional context",
            paragraphs: [
              "This is listed as Linkup Group company work. The site's advertised services do not establish the technology used to build the site or a project-specific personal responsibility.",
            ],
          },
        ],
        liveUrl: "https://linkupweb.in/",
        technologies: [],
        caseStudyEnabled: true,
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
