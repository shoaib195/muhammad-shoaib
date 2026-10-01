export type Project = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  challenge: string;
  platform: "Web" | "Mobile" | "Web · Mobile";
  period: string;
  company: string;
  cover: string;
  images: string[];
  overview: string;
  what: string;
  role: string[];
  tech: string[];
  features: string[];
  impact?: string[];
  links?: { live?: string; source?: string };
  status?: "Currently building" | "Shipped" | "Ongoing";
};

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectIds(): string[] {
  return projects.map((p) => p.id);
}

export const projects: Project[] = [
  {
    id: "crm-admin",
    name: "Sales CRM & Admin Platform",
    tagline: "Pipeline, leads and reporting for a growing sales team.",
    category: "CRM Platform",
    challenge: "Replace scattered spreadsheets with one system the whole sales team would actually use daily.",
    platform: "Web",
    period: "2022 — Present",
    company: "Linkstar",
    cover: "/v2/w1.jpg",
    images: ["/v2/w1.jpg", "/v1/p1.jpg", "/v1/p2.jpg"],
    overview:
      "A modular CRM used daily by sales and operations teams to track leads, deals, tasks and follow-ups, with role-based dashboards for managers.",
    what:
      "Centralises the full lead lifecycle — capture, qualification, assignment, follow-up and close — and surfaces performance in real-time dashboards.",
    role: [
      "Owned the frontend architecture: component system, routing, data layer and access control.",
      "Built reusable data tables, filters, kanban pipeline and chart widgets.",
      "Integrated REST APIs, auth flows and third-party services (email, calendar).",
    ],
    tech: ["React", "Next.js", "TypeScript", "REST APIs", "Supabase", "Chart.js", "Sass"],
    features: [
      "Role-based dashboards & permissions",
      "Kanban deal pipeline with drag & drop",
      "Advanced filtering, saved views and CSV export",
      "Activity timeline and reminders",
      "Responsive layout for tablet use in the field",
    ],
    impact: [
      "Replaced spreadsheet-based tracking for the whole sales team.",
      "Manager reporting moved from weekly exports to live dashboards.",
    ],
    status: "Currently building",
  },
  {
    id: "field-app",
    name: "Cross-Platform Field App",
    tagline: "React Native app for on-site teams, synced with the CRM.",
    category: "Mobile App",
    challenge: "Keep field updates reliable on poor connectivity without duplicating or losing data.",
    platform: "Mobile",
    period: "2023 — 2024",
    company: "Linkstar",
    cover: "/v2/w3.jpg",
    images: ["/v2/w3.jpg", "/v1/p3.jpg"],
    overview:
      "iOS & Android companion app for field staff to view assignments, capture notes and photos, and update status while offline.",
    what:
      "Keeps on-site teams and the office in sync — assignments flow down, updates and evidence flow back, even with poor connectivity.",
    role: [
      "Built the app end-to-end in React Native with a shared design system.",
      "Implemented offline-first sync, background uploads and push notifications.",
      "Coordinated API contracts with the backend team.",
    ],
    tech: ["React Native", "TypeScript", "REST APIs", "AsyncStorage", "Push Notifications"],
    features: [
      "Offline queue with conflict-safe sync",
      "Camera capture & photo evidence uploads",
      "Task checklists and status updates",
      "Deep links from notifications",
    ],
    impact: ["Cut manual status reporting from the field to near zero."],
    status: "Shipped",
  },
  {
    id: "ai-workflows",
    name: "AI-Assisted Support Workflows",
    tagline: "LLM-powered triage, drafting and summaries inside internal tools.",
    category: "AI Workflows",
    challenge: "Make model output useful without letting unreviewed text reach customers.",
    platform: "Web",
    period: "2024 — Present",
    company: "Linkstar",
    cover: "/v2/w2.jpg",
    images: ["/v2/w2.jpg", "/v1/p4.jpg"],
    overview:
      "A set of AI features embedded in internal dashboards: ticket triage, reply drafting, call-note summaries and data extraction from documents.",
    what:
      "Turns repetitive support and ops work into review-and-approve steps — the model proposes, the team verifies before anything ships.",
    role: [
      "Designed the streaming UI, prompt-review flow and safe-fallback states.",
      "Integrated OpenAI/Claude APIs with server-side guardrails and logging.",
      "Set up lightweight evals to measure draft quality over time.",
    ],
    tech: ["Next.js", "TypeScript", "OpenAI", "Claude", "Node.js", "PostgreSQL", "Supabase"],
    features: [
      "Streaming responses with edit-before-send",
      "Automatic ticket categorisation",
      "Summaries for long threads and calls",
      "Structured extraction from PDFs",
    ],
    impact: ["First-response drafting time reduced significantly for the support team."],
    status: "Ongoing",
  },
  {
    id: "hms",
    name: "Hospital Management System UI",
    tagline: "Clinical & admin interface for a multi-department HMS.",
    category: "Healthcare UI",
    challenge: "One consistent interface for very different departments, on desktops and tablets.",
    platform: "Web",
    period: "2021 — 2022",
    company: "Golpik",
    cover: "/v1/p1.jpg",
    images: ["/v1/p1.jpg", "/v2/w4.jpg"],
    overview:
      "Frontend for a hospital management product: patient records, appointments, billing and department dashboards.",
    what: "Gives clinical and admin staff one consistent interface across departments, on desktop and tablets.",
    role: [
      "Designed and built the UI layouts and component library.",
      "Implemented complex forms, schedulers and printable reports.",
      "Applied page optimisation and W3C markup standards.",
    ],
    tech: ["Vue", "React", "JavaScript", "Sass", "Bootstrap", "REST APIs"],
    features: [
      "Appointment scheduling calendar",
      "Patient records with audit trail",
      "Billing & invoice printing",
      "Department-level dashboards",
    ],
    status: "Shipped",
  },
  {
    id: "lead-gen",
    name: "Lead-Gen Landing Page System",
    tagline: "High-converting campaign pages built for speed and tracking.",
    category: "Lead Generation",
    challenge: "Launch new campaign pages fast without sacrificing Core Web Vitals or tracking.",
    platform: "Web",
    period: "2021 — 2022",
    company: "Golpik",
    cover: "/v2/w4.jpg",
    images: ["/v2/w4.jpg", "/v1/p2.jpg"],
    overview:
      "A reusable landing-page framework used across marketing campaigns, with A/B-friendly sections and analytics baked in.",
    what: "Lets marketing launch a new campaign page in hours instead of days, without sacrificing performance.",
    role: [
      "Built the section library and theming system.",
      "Optimised Core Web Vitals and form conversion flows.",
      "Wired analytics, pixels and CRM lead hand-off.",
    ],
    tech: ["HTML", "Sass", "JavaScript", "jQuery", "WordPress", "PHP"],
    features: ["Modular sections", "Multi-step lead forms", "Analytics & pixel tracking", "Fast, accessible markup"],
    status: "Shipped",
  },
  {
    id: "commerce",
    name: "E-commerce Storefronts",
    tagline: "Custom Shopify, Magento and WordPress builds.",
    category: "E-commerce",
    challenge: "Turn brand designs into fast storefronts the client team could run themselves.",
    platform: "Web",
    period: "2019 — 2021",
    company: "Digitonics Labs",
    cover: "/v1/p3.jpg",
    images: ["/v1/p3.jpg", "/v1/p4.jpg"],
    overview:
      "Storefronts and content sites for retail clients — custom themes, plugin work and performance tuning across CMS platforms.",
    what: "Turns brand designs into fast, maintainable storefronts the client team can run themselves.",
    role: [
      "Built custom WordPress themes and Shopify/Magento storefronts.",
      "Customised plugins, hooks and checkout flows.",
      "Debugged and standardised HTML/CSS/JS to W3C standards.",
    ],
    tech: ["Shopify", "Magento", "WordPress", "PHP", "JavaScript", "CSS"],
    features: ["Custom themes", "Product filtering & search", "Checkout customisation", "SEO-ready markup"],
    status: "Shipped",
  },
];
