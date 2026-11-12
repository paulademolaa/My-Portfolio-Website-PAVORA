// ---------------------------------------------------------------
// Your projects. Each one shows as a card on Home and Work, and gets
// its own page at /work/<slug>.
//
// To add a project: copy one block, give it a new "slug", and put its
// pictures in public/images/projects/. To swap a placeholder picture,
// just replace the file (keep the same name) or change the path here.
//
// category must match one of the filter names in src/pages/Work.jsx.
// tags are the small chips shown on the Home page cards.
// On the project page, the story reads: 01 Challenge (challenge),
// 02 Approach (solution), 03 Outcome (outcome); each is followed by one
// picture from gallery, then finalImage. Leave outcome out to hide it.
// ---------------------------------------------------------------

export const projects = [
  {
    slug: "freshfind-farmers-market",
    title: "FreshFind Farmers Market",
    type: "E-commerce Website",
    tags: ["E-commerce", "UI/UX Design", "Figma", "React", "Tailwind CSS"],
    category: "Web Development",
    cover: "/images/projects/freshfind.webp",
    summary: "A marketplace that helps shoppers find fresh-produce markets near them.",
    client: "Aptech TechWiz · Agodi Challengers",
    role: "Team lead · Product design & development",
    services: "UI/UX Design · Web Development",
    year: "2026",
    tools: "Figma, React, Tailwind CSS",
    link: "https://fresh-find-one.vercel.app/",
    challenge:
      "Describe the client’s problem in two or three sentences — only verified project details.",
    solution:
      "Designed in Figma first, then built by the team into a live, responsive website with React and Tailwind CSS. Add more detail on the key design decisions here.",
    outcome: "What happened after launch, in one or two sentences. Only verified results.",
    gallery: ["/images/projects/gallery-1.jpg", "/images/projects/gallery-2.jpg"],
    finalImage: "/images/projects/final-wide.jpg",
  },
  {
    slug: "bizopconnect",
    title: "UI UX Designer for BizOpConnect",
    type: "Dashboard Design",
    tags: ["Dashboard", "UI/UX Design", "SaaS", "Figma"],
    category: "Product Design",
    cover: "/images/projects/bizopconnect.webp",
    summary: "A lead-generation dashboard for small businesses.",
    client: "BizOpConnect",
    services: "UI/UX Design",
    year: "2026",
    tools: "Figma",
    challenge:
      "Describe the client’s problem in two or three sentences — only verified project details.",
    solution:
      "Explain the approach and the final design in plain words. Add results only if they are verified.",
    outcome: "What happened after launch, in one or two sentences. Only verified results.",
    gallery: ["/images/projects/gallery-1.jpg", "/images/projects/gallery-2.jpg"],
    finalImage: "/images/projects/final-wide.jpg",
  },
  {
    slug: "mobile-app",
    title: "[Project name]",
    type: "Mobile App Design",
    tags: ["Mobile App", "UI/UX Design", "Prototyping"],
    category: "Product Design",
    cover: "/images/projects/mobile-app.jpg",
    summary: "One line on what was designed and for whom.",
    client: "Client name",
    services: "UI/UX Design",
    year: "Year",
    tools: "Figma",
    challenge:
      "Describe the client’s problem in two or three sentences — only verified project details.",
    solution:
      "Explain the approach and the final design in plain words. Add results only if they are verified.",
    outcome: "What happened after launch, in one or two sentences. Only verified results.",
    gallery: ["/images/projects/gallery-1.jpg", "/images/projects/gallery-2.jpg"],
    finalImage: "/images/projects/final-wide.jpg",
  },
  {
    slug: "saas-landing-page",
    title: "SaaS Landing Page",
    type: "Landing Page Design",
    tags: ["Landing Page", "Web Design", "React", "Tailwind CSS"],
    category: "Web Development",
    cover: "/images/projects/saas-landing.jpg",
    summary: "One line on what was designed and for whom.",
    client: "Client name",
    services: "UI/UX Design · Web Development",
    year: "Year",
    tools: "Figma · React · Tailwind CSS",
    challenge:
      "Describe the client’s problem in two or three sentences — only verified project details.",
    solution:
      "Explain the approach and the final design in plain words. Add results only if they are verified.",
    outcome: "What happened after launch, in one or two sentences. Only verified results.",
    gallery: ["/images/projects/gallery-1.jpg", "/images/projects/gallery-2.jpg"],
    finalImage: "/images/projects/final-wide.jpg",
  },
  {
    slug: "brand-identity",
    title: "[Project name]",
    type: "Brand Identity",
    tags: ["Branding", "Logo Design", "Brand Strategy", "Visual Identity"],
    category: "Brand Identity",
    cover: "/images/projects/brand-identity.jpg",
    summary: "One line on what was designed and for whom.",
    client: "Client name",
    services: "Brand Strategy · Identity",
    year: "Year",
    tools: "Figma · Adobe Illustrator",
    challenge:
      "Describe the client’s problem in two or three sentences — only verified project details.",
    solution:
      "Explain the approach and the final design in plain words. Add results only if they are verified.",
    outcome: "What happened after launch, in one or two sentences. Only verified results.",
    gallery: ["/images/projects/gallery-1.jpg", "/images/projects/gallery-2.jpg"],
    finalImage: "/images/projects/final-wide.jpg",
  },
  {
    slug: "pitch-deck",
    title: "[Project name]",
    type: "Pitch Deck Design",
    tags: ["Pitch Deck", "Presentation Design", "Storytelling"],
    category: "Presentations",
    cover: "/images/projects/pitch-deck.jpg",
    summary: "One line on what was designed and for whom.",
    client: "Client name",
    services: "Presentation Design",
    year: "Year",
    tools: "Figma · PowerPoint",
    challenge:
      "Describe the client’s problem in two or three sentences — only verified project details.",
    solution:
      "Explain the approach and the final design in plain words. Add results only if they are verified.",
    outcome: "What happened after launch, in one or two sentences. Only verified results.",
    gallery: ["/images/projects/gallery-1.jpg", "/images/projects/gallery-2.jpg"],
    finalImage: "/images/projects/final-wide.jpg",
  },
];
