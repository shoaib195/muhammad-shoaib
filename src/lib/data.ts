export const site = {
  name: "VERONICA PW",
  fullName: "Veronica PW",
  email: "hello@veronicapw.com",
  location: "Based in London / Born in Saint-P.",
  availability: "Currently available for freelance worldwide.",
  disciplines: "Web & Mobile / UX&UI / Branding",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Behance", href: "https://behance.net" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
};

export const navLinks = [
  { label: "Playbook", href: "#work" },
  { label: "Socials", href: "#socials" },
  { label: "Contacts", href: "#contact" },
];

export type ProjectLayout = "split" | "full" | "asymmetric" | "editorial";

export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tech: string[];
  layout: ProjectLayout;
};

export const projects: Project[] = [
  {
    id: "aurora",
    number: "01",
    title: "Aurora Desk",
    category: "Product Design",
    year: "2025",
    description:
      "A calm workspace product for creative teams — dark surfaces, soft light, and motion that feels cinematic.",
    tech: ["Figma", "Next.js", "Motion"],
    layout: "split",
  },
  {
    id: "north",
    number: "02",
    title: "Northline",
    category: "Brand + Web",
    year: "2024",
    description:
      "An editorial brand system and scroll-led site for a mobility studio based in Europe.",
    tech: ["Brand", "WebGL", "CMS"],
    layout: "full",
  },
  {
    id: "signal",
    number: "03",
    title: "Signal Atlas",
    category: "UX / UI",
    year: "2024",
    description:
      "Research-heavy interface for AI-assisted reading — density without noise, hierarchy with room to breathe.",
    tech: ["UX", "UI", "Prototype"],
    layout: "asymmetric",
  },
  {
    id: "folio",
    number: "04",
    title: "Folio Transit",
    category: "Visual Identity",
    year: "2023",
    description:
      "Identity and digital presence for a photography collective — typography as the primary medium.",
    tech: ["Identity", "Art Direction"],
    layout: "editorial",
  },
];

export const capabilities = [
  {
    number: "01",
    title: "Web & Mobile",
    description:
      "Responsive product interfaces and marketing surfaces with cinematic motion, strong type, and production-ready craft.",
  },
  {
    number: "02",
    title: "UX & UI Design",
    description:
      "Flows, systems, and visual language designed for clarity first — then elevated with texture, light, and restraint.",
  },
  {
    number: "03",
    title: "Brand Systems",
    description:
      "Identities that travel from still frames to interactive experiences without losing their editorial voice.",
  },
  {
    number: "04",
    title: "Motion Design",
    description:
      "Scroll storytelling, micro-interactions, and ambient animation that support hierarchy instead of competing with it.",
  },
];

export const experience = [
  {
    year: "2023 — Now",
    role: "Independent Designer",
    company: "Studio Practice",
    impact:
      "Partnering with founders and agencies on brand-led digital products, portfolios, and visual systems.",
  },
  {
    year: "2021 — 2023",
    role: "Senior Product Designer",
    company: "Product Studio",
    impact:
      "Led interface design for multi-surface products — design systems, motion language, and complex workflows.",
  },
  {
    year: "2019 — 2021",
    role: "Visual Designer",
    company: "Creative Agency",
    impact:
      "Shipped brand campaigns and digital experiences with a focus on typography, composition, and polish.",
  },
];

export const about = {
  lead: "I design digital experiences that feel cinematic — quiet light, strong type, and motion with intention.",
  body: "My practice sits between visual design and product craft. I build interfaces and brand systems that communicate before they decorate, with a focus on atmosphere, hierarchy, and human detail.",
};
