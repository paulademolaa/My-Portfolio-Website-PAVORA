// ---------------------------------------------------------------
// Services, testimonials and About-page lists. Edit the text freely.
// ---------------------------------------------------------------

// "art" picks which illustration shows next to the service:
// "web", "brand", "mobile" or "deck" (see src/components/Mockups.jsx)
export const services = [
  {
    title: "Brand Strategy",
    description: "We dig into your idea, audience and goals so your brand says exactly what you stand for.",
    art: "brand",
  },
  {
    title: "Logo & Brand Identity",
    description: "Logo, colours, typography and brand guidelines. Every PAVORA project starts here.",
    art: "brand",
  },
  {
    title: "Flyers & Ads",
    description: "Flyers, social ads and campaign visuals that introduce your brand, even before you have a website.",
    art: "mobile",
  },
  {
    title: "UI/UX Design in Figma",
    description: "Websites and apps designed in Figma, with a clickable prototype before anything is built.",
    art: "web",
  },
  {
    title: "Website Development",
    description: "Your Figma design built into a fast, responsive website with React and Tailwind CSS.",
    art: "web",
  },
  {
    title: "Presentation Design",
    description: "Pitch decks in your brand style, ready for investors, partners or customers.",
    art: "deck",
  },
];

// The PAVORA process, shown on the Services page
export const phases = [
  { title: "Logo & branding", text: "Always first. Flyers and ads can follow right away.", tag: "Phase 1" },
  { title: "Design in Figma", text: "Your website or app, designed and clickable.", tag: "Phase 2" },
  { title: "Development", text: "Built, tested and launched, if you go live.", tag: "Phase 3" },
  { title: "Presentation", text: "A pitch deck when you're ready to present.", tag: "Phase 4" },
];

// The downloadable guide on the Services page (file lives in public/files/)
export const servicesGuide = { href: "/files/PAVORA-What-We-Do.pdf", label: "PAVORA — What We Do (PDF)" };

// Client reviews and testimonials live in src/data/assistant.js

export const whatIDo = [
  "Brand Strategy",
  "Logo & Brand Identity",
  "Flyers & Ads",
  "UI/UX Design in Figma",
  "Website Development (React, Tailwind CSS)",
  "Presentation Design",
];

// Tool tiles on the About page.
// "logo" is optional: drop an official logo file in public/images/tools/
// and put its path here. Without one, the tool's name is shown instead.
// tilt: true turns a flat logo slightly to match the 3D Figma / VS Code icons
// scale: logo size inside its square (1 = full size)
export const tools = [
  { name: "Figma", caption: "UI/UX & prototyping", logo: "/images/figma.webp" },
  { name: "Adobe Photoshop", caption: "Photo editing & mockups", logo: "/images/photoshop.webp", tilt: true, scale: 0.74 },
  { name: "Adobe Illustrator", caption: "Logos & vector art", logo: "/images/illustrator.webp", tilt: true, scale: 0.74 },
  { name: "VS Code", caption: "Writing the code", logo: "/images/vscode.webp", scale: 1.08 },
  { name: "React", caption: "Front-end builds", logo: "/images/react.webp", tilt: true, scale: 0.92 },
  { name: "Tailwind CSS", caption: "Fast, clean styling", logo: "/images/tailwind.webp", tilt: true, scale: 0.95 },
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
  "Brand Strategy",
  "Logo & Brand Identity",
  "Flyers & Ads",
  "UI/UX Design in Figma",
  "Website Development",
  "Presentation Design",
  "Something else",
];
