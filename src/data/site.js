// ---------------------------------------------------------------
// Site-wide info. Edit your links, email and Upwork numbers here.
// ---------------------------------------------------------------

export const site = {
  name: "Paul Ademola",
  brand: "PAVORA",
  tagline: "Designed with Vision. Built for Impact.",
  location: "Independent Designer · Nigeria · Worldwide",

  // Leave email empty until you're ready — the contact form will then
  // send people to Upwork instead.
  email: "",

  links: {
    upwork: "https://www.upwork.com/freelancers/~01c9c0334f82ec5468",
    linkedin: "https://www.linkedin.com/in/paul-ademola-68697226b",
    instagram: "https://www.instagram.com/designerpaul1",
    x: "https://x.com/", // add your X (Twitter) username at the end
  },
};

// Upwork numbers shown on the Home, About and Contact pages.
// Keep them in sync with your Upwork profile (last checked 31 Oct 2026).
export const stats = [
  { value: 4.9, decimals: 1, suffix: "", label: "Upwork rating" },
  { value: 18, suffix: "", label: "Total jobs done" },
  { value: 81, suffix: "%", label: "Job Success Score" },
  { value: 7, suffix: "+", label: "Years of experience" },
];

// "Insights from completed jobs" on Upwork — how many clients endorsed each
// quality. Shown on the About page. Update the numbers from your Upwork profile.
export const clientInsights = [
  { label: "Committed to Quality", count: 9 },
  { label: "Clear Communicator", count: 7 },
  { label: "Reliable", count: 7 },
  { label: "Collaborative", count: 4 },
  { label: "Detail Oriented", count: 4 },
  { label: "Accountable for Outcomes", count: 3 },
  { label: "Professional", count: 3 },
  { label: "Solution Oriented", count: 2 },
];

// Main navigation (used in the navbar, mobile menu and footer)
export const navLinks = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/#services" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export const socialLinks = [
  { label: "LinkedIn", href: site.links.linkedin, icon: "linkedin" },
  { label: "Upwork", href: site.links.upwork, icon: "upwork" },
  { label: "Instagram", href: site.links.instagram, icon: "instagram" },
  { label: "X (Twitter)", href: site.links.x, icon: "x" },
];
