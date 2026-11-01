// ---------------------------------------------------------------
// Services, testimonials and About-page lists. Edit the text freely.
// ---------------------------------------------------------------

// "art" picks which illustration shows next to the service:
// "web", "brand", "mobile" or "deck" (see src/components/Mockups.jsx)
export const services = [
  {
    title: "Product Design",
    description:
      "Intuitive websites, apps and dashboards shaped around real users and business goals.",
    art: "web",
  },
  {
    title: "Brand Strategy & Identity",
    description:
      "Distinctive identities that give your brand a clear voice and a look people remember.",
    art: "brand",
  },
  {
    title: "Graphic Design",
    description: "Clear, striking visuals for campaigns, social and every digital touchpoint.",
    art: "mobile",
  },
  {
    title: "Presentation Design",
    description: "Pitch and business decks that turn complex ideas into clear visual stories.",
    art: "deck",
  },
  {
    title: "Web Development",
    description:
      "Responsive, production-ready websites built with React and Tailwind CSS — designed and developed by one person.",
    art: "web",
  },
];

// Client reviews and testimonials live in src/data/assistant.js

export const whatIDo = [
  "Product Design (UI/UX)",
  "Brand Strategy & Identity",
  "Graphic Design",
  "Presentation Design",
  "Web Development (React, Tailwind CSS)",
];

// Tool tiles on the About page.
// "logo" is optional: drop an official logo file in public/images/tools/
// and put its path here. Without one, the tool's name is shown instead.
export const tools = [
  { name: "Figma", caption: "UI/UX & prototyping", logo: "/images/figma.webp" },
  { name: "Adobe Photoshop", caption: "Photo editing & mockups", logo: "/images/photoshop.webp" },
  { name: "Adobe Illustrator", caption: "Logos & vector art", logo: "/images/illustrator.webp" },
  { name: "VS Code", caption: "Writing the code", logo: "/images/vscode.webp" },
  { name: "React", caption: "Front-end builds", logo: "/images/react.webp" },
  { name: "Tailwind CSS", caption: "Fast, clean styling", logo: "/images/tailwind.webp" },
];

// "How I work" cards on the About page
export const process = [
  { title: "Discover", text: "Understand your business, users and goals before a single pixel moves." },
  { title: "Define", text: "Turn research into a clear plan, structure and success measures." },
  { title: "Design", text: "Shape the brand and interface — tested early, refined with you." },
  { title: "Deliver", text: "Hand off polished files or ship the live build in React and Tailwind." },
];

export const experience = [
  { role: "Independent Designer", place: "Upwork · Clients worldwide", years: "20XX — Now" },
  { role: "[Role]", place: "[Company]", years: "20XX — 20XX" },
];

// Options in the contact form's "Service" dropdown
export const serviceOptions = [
  "Product Design (UI/UX)",
  "Website & Mobile App Design",
  "Brand Strategy & Identity",
  "Graphic Design",
  "Presentation Design",
  "Web Development",
  "Something else",
];
