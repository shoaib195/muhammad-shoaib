/**
 * Home-page content that is specific to the current site structure
 * (stats, what-I-bring, process, about, contact aside, experience details).
 * Resume-focused: no education / full address / personal trivia.
 */

export const stats = [
  { value: "7+", label: "Years building", note: "Frontend since 2018" },
  { value: "30+", label: "Products shipped", note: "CRMs, apps, dashboards, storefronts" },
  { value: "Web + Mobile", label: "Platforms", note: "React · Next.js · React Native" },
  { value: "Remote", label: "Worldwide", note: "Karachi, PK · async-friendly" },
];

export const stackGroups = [
  { title: "Web", items: ["React", "Next.js", "TypeScript", "JavaScript"] },
  { title: "Mobile", items: ["React Native", "Expo"] },
  { title: "Backend", items: ["Node.js", "PHP", "Laravel"] },
  { title: "Data", items: ["MySQL", "Firebase", "Supabase"] },
  { title: "CMS", items: ["WordPress", "Shopify"] },
];

export const bring = [
  {
    title: "Product thinking",
    body: "Understand the product, the users, the constraints and the business goal before writing a line.",
    detail: "Scope, trade-offs, priorities",
  },
  {
    title: "Engineering discipline",
    body: "Clean architecture, maintainable code and scalable foundations that the next engineer can read.",
    detail: "Architecture, reviews, testing",
  },
  {
    title: "Interface quality",
    body: "Responsive, accessible, polished experiences that behave the same on every device and input.",
    detail: "Responsive, a11y, motion",
  },
  {
    title: "Performance",
    body: "Fast loading, optimised assets and production-ready implementation measured on real devices.",
    detail: "Core Web Vitals, bundles, caching",
  },
];

export const breakSequence = ["Layout", "Interaction", "Performance", "Accessibility", "Responsive", "Production"];

export const process = [
  {
    step: "01",
    title: "Understand",
    body: "Learn the product, users, constraints and goals. Ask the questions that change the build.",
    output: "Scope, success criteria, risks",
  },
  {
    step: "02",
    title: "Design & architect",
    body: "Turn requirements into scalable interfaces and technical systems before the first component.",
    output: "Component map, data flow, plan",
  },
  {
    step: "03",
    title: "Build",
    body: "Ship responsive, production-ready experiences in reviewable increments, with demos every week.",
    output: "Working software, PRs, demos",
  },
  {
    step: "04",
    title: "Refine",
    body: "Test, measure, optimise and keep improving once real users and real devices are involved.",
    output: "Metrics, fixes, iteration",
  },
];

export const processIncludes = ["Design-to-code handoff", "PR reviews + performance audits", "Weekly demos & clear updates"];

export const about = {
  heading: "I'm Shoaib.",
  statement: "I build interfaces, products and systems designed to survive production.",
  paragraphs: [
    "Frontend engineer with 7+ years across CRMs, dashboards, React Native apps, AI-assisted internal tools and CMS storefronts — four teams, thirty-plus shipped products.",
    "I prefer working close to the product: owning the frontend architecture, pairing with design and backend, and staying accountable for what ships, not just what was written.",
  ],
  prefer: ["Product teams", "Early-stage startups", "Long-term contracts", "Frontend architecture ownership"],
  stack: ["React", "Next.js", "TypeScript", "React Native", "Node.js", "Supabase"],
  remote: "Remote-first from Karachi (UTC+5), comfortable with async work and overlapping hours with EU/US teams.",
};

export const contactAside = {
  heading: "Available for select projects",
  items: ["Freelance", "Contract", "Product teams", "Consulting"],
  location: "Pakistan · Remote worldwide",
  reply: "Replies within 24 hours",
};

export const projectTypes = [
  "New product / MVP",
  "Web app or dashboard",
  "Mobile app (React Native)",
  "Frontend architecture / refactor",
  "Performance & accessibility",
  "AI-assisted workflow",
  "Other",
];

/** Extra detail per role, keyed by company (matches `experience` in data). */
export const experienceDetails: Record<string, { stack: string[]; outcomes: string[]; summary: string }> = {
  "Linkstar, Karachi": {
    summary: "Own the frontend for CRM platforms, dashboards and a React Native field app; lead AI-assisted internal tooling.",
    stack: ["React", "Next.js", "TypeScript", "React Native", "Supabase", "OpenAI"],
    outcomes: [
      "Replaced spreadsheet-based sales tracking with a live CRM used daily by the whole team.",
      "Shipped an offline-first field app that removed manual status reporting from the field.",
    ],
  },
  "Golpik, Karachi": {
    summary: "Designed and built CRM and hospital-management UI; delivered a reusable landing-page system for lead-gen campaigns.",
    stack: ["Vue", "React", "Sass", "jQuery", "PHP"],
    outcomes: [
      "Campaign pages went from days to hours to launch with the modular section library.",
      "Applied W3C standards and page optimisation across every delivered template.",
    ],
  },
  "Digitonics labs (Pvt.) Ltd., Karachi": {
    summary: "Custom WordPress themes and Shopify / Magento storefronts for retail clients, with plugin and checkout customisation.",
    stack: ["WordPress", "Shopify", "Magento", "PHP", "JavaScript"],
    outcomes: ["Delivered client storefronts that marketing teams could run without a developer."],
  },
  "Protege Global (PVT) Ltd., Karachi": {
    summary: "Static HTML pages, templates and cross-platform email layouts in collaboration with designers.",
    stack: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap"],
    outcomes: ["Built the markup discipline that still underpins how I ship UI today."],
  },
};
