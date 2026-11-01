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

// "What Clients Say" on the Home page — real words from Upwork.
// (More reviews live in src/data/assistant.js and show on the FAQ page.)
export const testimonials = [
  {
    quote:
      "Working with Ademola was very easy and quick. He had the Figma prototype for the website ready on time, and all the details were tastefully implemented. The website development was also quick, and the website turned out exactly as expected! Highly recommend.",
    name: "Upwork client",
    role: "Travel Agency Website · ★ 5.0",
  },
  {
    quote:
      "Paul was key in designing a user-friendly and beautiful interface, creating an intuitive design that met the needs of our target users. … His attention to detail and ability to turn complex requirements into clear UI designs were impressive.",
    name: "Moses A.",
    role: "Web Developer · SaaS Web Dashboard",
  },
  {
    quote:
      "[Paul] delivered exactly what we needed. He crafted a cohesive brand identity that captured our vision perfectly, from logo to typography and color palette. … Great communicator, will hire again!",
    name: "Upwork client",
    role: "Hypsy Brand Kit · ★ 5.0",
  },
  {
    quote:
      "Paul was efficient, friendly, and highly skilled. He designed our UI in Figma with a clean, user-friendly flow and added thoughtful touches like interaction notes and responsive layouts. … Would definitely hire again.",
    name: "Upwork client",
    role: "Social Media Promotion Landing Page · ★ 5.0",
  },
  {
    quote:
      "Working with Paul was an exceptional experience. His expertise, excellent communication skills, and dedication make him a valuable asset to any Figma UX/UI project.",
    name: "Adebowale A.",
    role: "Frontend Software Developer · Portfolio Website",
  },
  {
    quote:
      "I hired Paul to help with my E-commerce website. He responded quickly and makes sure he communicates with what I want. I recommend his services and skills to anyone who is looking to have a professional e-commerce store design and development.",
    name: "Adejoke A.",
    role: "E-Commerce Website",
  },
];

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
  { name: "Adobe Photoshop", caption: "Photo editing & mockups" },
  { name: "Adobe Illustrator", caption: "Logos & vector art" },
  { name: "VS Code", caption: "Writing the code", logo: "/images/vscode.webp" },
  { name: "React", caption: "Front-end builds" },
  { name: "Tailwind CSS", caption: "Fast, clean styling" },
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
