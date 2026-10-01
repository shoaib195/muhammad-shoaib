export const site = {
  brand: "PORTIX",
  name: "PORTIA WILLSON",
  tagline: "DESIGN THAT CONVERTS VISITORS INTO BUYERS",
  role: "UI & UX DESIGNER",
  email: "info@portix.com",
  phone: "+123 456 789 00",
  address: "12273 Dream Avenue, London, 123456 United Kingdom",
  copyright: "© 2026 Portix. All rights reserved.",
};

export const navLinks = [
  { label: "WORKS", href: "#works" },
  { label: "ABOUT", href: "#showreel" },
  { label: "EXPERIENCE", href: "#process" },
  { label: "CONTACT", href: "#contact" },
] as const;

export const works = [
  {
    id: "p1",
    title: "Minimal Design Shift",
    category: "Branding Design",
    image: "/v1/p1.jpg",
    tall: true,
  },
  {
    id: "p2",
    title: "Timeless Visual Look",
    category: "Minimal Design Website",
    image: "/v1/p2.jpg",
    tall: false,
  },
  {
    id: "p3",
    title: "Brand Revival Strategy",
    category: "UI/UX Design · Custom",
    image: "/v1/p3.jpg",
    tall: false,
  },
  {
    id: "p4",
    title: "Iconic Visual Touch",
    category: "Website · UI/UX Design",
    image: "/v1/p4.jpg",
    tall: true,
  },
] as const;

export const showreel = {
  headingLeft: "SHOW",
  headingRight: "REEL",
  aboutTitle: "Why work with me",
  about:
    "I believe the best brands come from true collaboration. When we work together, you're not just getting a designer — you're getting a partner invested in turning visitors into buyers with clarity, craft, and conversion-first thinking.",
  cta: "GET A QUOTE",
  studioImage: "/v1/studio.jpg",
  stats: [
    { value: "120+", label: "Projects delivered" },
    { value: "98%", label: "Client satisfaction" },
    { value: "12", label: "Years experience" },
  ],
};

export const processSteps = [
  {
    number: "01",
    title: "PLAN AHEAD",
    body: "Successful projects start with careful planning. We work closely with you to understand goals, audience, and constraints — then map a clear strategy.",
  },
  {
    number: "02",
    title: "WORK SMART",
    body: "Smart systems beat busywork. We prioritize high-impact design decisions, rapid prototyping, and focused iteration that keeps momentum.",
  },
  {
    number: "03",
    title: "MOVE SAFELY",
    body: "Your brand is in safe hands. Every screen, flow, and detail is handled with care using proven process and collaborative reviews.",
  },
  {
    number: "04",
    title: "DELIVER ON TIME",
    body: "We ship on schedule. Clear milestones, transparent communication, and a dedicated focus on launching work that performs.",
  },
] as const;

export const recognition = {
  heading: "GET RECOMMENDED BY",
  items: [
    {
      name: "Nexora",
      rating: "4.9",
      year: "2012",
      blurb:
        "Trusted for reliable, seamless digital solutions — clients share strong experiences across product launches.",
    },
    {
      name: "ByteWave",
      rating: "4.8",
      year: "2013",
      blurb:
        "Highlighted for high-quality design projects demonstrating innovation and visual impact.",
    },
    {
      name: "CloudNest",
      rating: "5.0",
      year: "2014",
      blurb:
        "Recognized for cutting-edge product experiences and polished, conversion-led interfaces.",
    },
    {
      name: "NovaStack",
      rating: "4.9",
      year: "2016",
      blurb:
        "Celebrated for elegant systems thinking and designs that scale with ambitious brands.",
    },
  ],
  logos: ["Google", "Behance", "Dribbble", "Clutch"],
};

export const testimonial = {
  quote:
    "Working with this UI/UX designer was an absolute pleasure. They understood our vision quickly and transformed it into a clean, modern, & user-friendly design.",
  name: "Almond D. Bowson",
  role: "Manager",
  avatar: "/v1/avatar.jpg",
};

export const cta = {
  title: "LET'S TALK NOW",
  subtitle: "Have a project in mind? Let's build something that converts.",
};

export const blogs = [
  {
    id: "b1",
    title: "The Journey of Exceptional Design",
    excerpt:
      "Behind every great digital experience lies a journey — a thoughtful process that transforms an abstract idea into an engaging product.",
    category: "PROCESS",
    date: "Nov 23, 2024",
    image: "/v1/blog1.jpg",
  },
  {
    id: "b2",
    title: "How to Build a Scalable Website",
    excerpt:
      "As products grow, structure becomes strategy. Scalable systems keep experiences fast, clear, and ready for what comes next.",
    category: "WEB",
    date: "Jun 23, 2025",
    image: "/v1/blog2.jpg",
  },
  {
    id: "b3",
    title: "Essential Web Development Practices",
    excerpt:
      "Speed is the first impression a website makes. Users decide within seconds whether to stay — craft that moment carefully.",
    category: "CRAFT",
    date: "Jul 23, 2025",
    image: "/v1/blog3.jpg",
  },
  {
    id: "b4",
    title: "Conversion Rates and Engagement",
    excerpt:
      "With structure in place, visual design turns function into feeling — color, type, imagery, and motion working as one.",
    category: "GROWTH",
    date: "Oct 23, 2025",
    image: "/v1/blog4.jpg",
  },
] as const;

export const faqs = [
  {
    q: "What services do you offer?",
    a: "I specialize in UI/UX design, including user research, wireframing, prototyping, usability testing, and visual design. I focus on creating intuitive, user-centered digital experiences that convert.",
  },
  {
    q: "What is your design process?",
    a: "My process typically includes research, problem definition, wireframing, prototyping, and testing. I start by understanding user needs and business goals, then refine until the product feels inevitable.",
  },
  {
    q: "Which tools do you use for design?",
    a: "I primarily use Figma for UI design and prototyping, along with Adobe tools and FigJam for collaboration. For handoff, I work closely with developers to keep implementation smooth.",
  },
  {
    q: "Do you work with developers and teams?",
    a: "Yes. I collaborate with developers, product managers, and stakeholders to ensure designs are practical, accessible, and ready for production.",
  },
  {
    q: "How long does a typical project take?",
    a: "Timelines vary by scope. A focused landing page may take 2–3 weeks; a full product redesign often runs 6–10 weeks with clear milestones and reviews along the way.",
  },
] as const;

export const socials = [
  { label: "Instagram", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "Behance", href: "#" },
  { label: "LinkedIn", href: "#" },
] as const;

export const footerLinks = [
  { label: "Works", href: "#works" },
  { label: "About", href: "#showreel" },
  { label: "Process", href: "#process" },
  { label: "Articles", href: "#craft" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;
