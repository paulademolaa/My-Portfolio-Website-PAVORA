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
    type: "Website & Mobile UI/UX",
    tags: ["Responsive Web", "UI/UX Design", "Figma", "React", "Tailwind CSS"],
    category: "Web Development",
    cover: "/images/projects/freshfind.webp",
    summary: "A local market companion that helps Lagos shoppers find farmers markets, see what's open and in season, and plan their next fresh-food stop.",
    client: "Aptech TechWiz · Agodi Challengers",
    role: "Product Designer, Team Lead",
    services: "UI/UX Design · Web Development",
    year: "2026",
    tools: "Figma, React, Tailwind CSS",
    link: "https://fresh-find-one.vercel.app/",
    challenge:
      "Market days in Lagos live on flyers, church notice boards and WhatsApp forwards. So it's hard to know which farmers markets are near you, when they open and what's in season. For the Aptech TechWiz brief, our team set out to put all of that in one place.",
    solution:
      "As team lead, I co-designed FreshFind end to end in Figma for desktop and mobile with Omisakin Olawole, from the moodboard and a fresh green design system to every card state. The answer came down to three tools: a Market Directory you can filter by neighbourhood, day or produce; a Produce Guide that shows what's in season and which markets stock it; and Bookmarks with notes to share with family. We then built it with React and Tailwind CSS.",
    outcome:
      "FreshFind is live and works on desktop, tablet and mobile. Shoppers see what's open the moment they land, plan the whole trip from their desk, get one page per market with its schedule and directions, and can ask the FreshFind Assistant for help.",
    coverRatio: 1.346,
    // After 01 Challenge / 02 Approach / 03 Outcome (shown uncropped)
    gallery: [
      { src: "/images/projects/freshfind-desktop.webp", ratio: 1.372 },
      [
        { src: "/images/projects/freshfind-colour.webp", ratio: 1.346 },
        { src: "/images/projects/freshfind-typography.webp", ratio: 1.555 },
        { src: "/images/projects/freshfind-mobile.webp", ratio: 0.787 },
      ],
    ],
    finalImage: { src: "/images/projects/freshfind-market-page.webp", ratio: 1.346 },
  },
  {
    slug: "bizopconnect",
    title: "UI UX Designer for BizOpConnect",
    type: "SaaS Web App · UI/UX",
    tags: ["SaaS", "Dashboard", "UI/UX Design", "Figma"],
    category: "Product Design",
    cover: "/images/projects/bizopconnect.webp",
    coverRatio: 1.179,
    summary: "Run your business. Not your operations. An operations hub where local service businesses manage customers, leads, marketing and their public profile from one dashboard.",
    client: "BizOpConnect",
    role: "Product Designer (UI/UX)",
    services: "UI/UX Design",
    year: "2026",
    tools: "Figma",
    challenge:
      "Small service businesses run on notebooks, spreadsheets and missed calls. Clients sit in one app, leads in an inbox, marketing somewhere else, and the online listing rarely gets updated. Jobs slip, leads go cold, and customers can't find, or trust, the business online.",
    solution:
      "I designed BizOpConnect as one operations hub for local service businesses like pool care, cleaning and landscaping. One dashboard shows jobs, revenue, invoices and new leads at a glance, with a Launch Center that walks new owners through setup. Customers and leads live in one list, with stat cards for the funnel, status tabs and colour-coded tags that show what each job needs next. A business profile and marketplace listing, with live preview, trust badges and a \"Request a Quote\" button, help owners get found online. The visual language is a trustworthy blue on a calm navy frame, set in Poppins.",
    outcome:
      "The result is a complete desktop web app design: onboarding, dashboard, CRM, lead generation, marketing and profiles. A new owner can set up in minutes, not meetings: create an account, describe the business, add services and go live, with storefront, CRM and job scheduling connected and ready.",
    // After 01 Challenge / 02 Approach / 03 Outcome (shown uncropped)
    gallery: [
      [
        { src: "/images/projects/bizopconnect-overview.webp", ratio: 1.218 },
        { src: "/images/projects/bizopconnect-problem.webp", ratio: 1.179 },
      ],
      [
        { src: "/images/projects/bizopconnect-onboarding.webp", ratio: 1.103 },
        { src: "/images/projects/bizopconnect-visual-language.webp", ratio: 1.155 },
      ],
    ],
    finalImage: { src: "/images/projects/bizopconnect-customers.webp", ratio: 1.063 },
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
