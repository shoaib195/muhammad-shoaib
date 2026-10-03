export type NavLink = { label: string; href: string };
export type SocialLink = { label: string; href: string };

export type LandingContent = {
  site: {
    name: string;
    firstName: string;
    email: string;
    phone: string;
    location: string;
    roleTitle: string;
    resumeUrl: string;
    resumeFileName: string;
  };
  nav: {
    links: NavLink[];
    cta: NavLink;
  };
  footer: {
    links: NavLink[];
  };
  socials: SocialLink[];
  hero: {
    portraitSrc: string;
    handLines: string[];
    proofText: string;
    badgeText: string;
    rating: string;
    titleLine1: string;
    titleAccent: string;
    lead: string;
    features: string[];
    primaryCta: NavLink;
    secondaryCta: NavLink;
    trustItems: string[];
    avatars: string[];
  };
  stats: { value: string; label: string; note: string }[];
  stackGroups: { title: string; items: string[] }[];
  gap: {
    tagline: string;
    dim: string;
    bright: string;
    brightAccent: string;
    body: string;
    bodyMutedBefore: string;
    bodyMutedUnderline: string;
    bodyMutedAfter: string;
    handLines: string[];
    items: { label: string; stack: string }[];
  };
  bring: {
    tagline: string;
    dim: string;
    bright: string;
    brightAccent: string;
    lead: string;
    items: { title: string; body: string; detail: string }[];
  };
  stakes: {
    tagline: string;
    dim: string;
    bright: string;
    brightAccent: string;
    lead: string;
    sequence: string[];
    leadSmall: string;
    closingDim: string;
    closingBrightBefore: string;
    closingBrightAccent: string;
  };
  showcase: {
    tagline: string;
    badge: string;
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    lead: string;
    leadNote: string;
  };
  experience: {
    tagline: string;
    dim: string;
    bright: string;
    brightAccent: string;
    aside: string;
    resumeLabel: string;
  };
  process: {
    tagline: string;
    dim: string;
    bright: string;
    brightAccent: string;
    lead: string;
    steps: { step: string; title: string; body: string; output: string }[];
    includes: string[];
  };
  about: {
    tagline: string;
    heading: string;
    statement: string;
    paragraphs: string[];
    prefer: string[];
    stack: string[];
    remote: string;
    imageSrc: string;
    caption: string;
    badge: string;
  };
  contact: {
    tagline: string;
    dim: string;
    bright: string;
    brightAccent: string;
    lead: string;
    aside: {
      heading: string;
      items: string[];
      location: string;
      reply: string;
    };
    projectTypes: string[];
  };
  cta: {
    titleLine1: string;
    titleAccent: string;
    lead: string;
    buttonLabel: string;
    buttonHref: string;
    note: string;
    socialText: string;
    avatars: string[];
  };
};

export type ExperienceItem = {
  id?: string;
  role: string;
  company: string;
  years: string;
  highlights: string[];
  summary: string;
  stack: string[];
  outcomes: string[];
  sortOrder?: number;
};
