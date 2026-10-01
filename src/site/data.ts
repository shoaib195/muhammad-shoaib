export {
  site,
  socials,
  brands,
  capabilities,
  skillGroups,
  processSteps,
  selectedWorks,
  collageImages,
  experience,
  education,
  achievements,
  hobbies,
} from "@/variations/elian/data";

// Routes: "/" is the single-page home, "/work" is the dedicated projects page.
// "/#id" links smooth-scroll to a home section (SmartLink handles cross-page).
export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
];

export const navCta = { label: "Let's work together", href: "/#contact" };

export const footerLinks = [{ label: "Home", href: "/" }, ...navLinks];
