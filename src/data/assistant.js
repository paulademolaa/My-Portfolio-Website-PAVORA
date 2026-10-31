// ---------------------------------------------------------------
// PAVORA Assistant — what the chatbot knows.
//
// Each topic has:
//   id        a unique name
//   keywords  words that point to this topic, with a weight
//             (higher = stronger signal). Spelling mistakes and
//             plurals are handled automatically.
//   phrases   (optional) short phrases that strongly match
//   answer    what the assistant replies. A list of "blocks":
//               { text: "…" }            normal text (**bold** and [links](/page) work)
//               { list: ["…", "…"] }     bullet list
//               { card: "services" | "tools" | "process" | "projects" | "reviews" | "rating" }
//               { actions: [...] }       buttons (see ACTIONS below)
//   ask       (optional) the question this topic answers — used to
//             suggest related questions when the assistant isn't sure
//   chips     follow-up suggestions shown under the answer
//   faq       (optional) shows the topic on the FAQ page:
//             { group, question, answer }  — answer is plain text
//
// Rules: never quote prices or delivery times — always invite the
// visitor to message Paul. Keep every answer true.
// ---------------------------------------------------------------

import { site } from "./site.js";

// Buttons the assistant can show
export const ACTIONS = {
  startProject: { label: "Start a project", action: "lead" },
  upwork: { label: "Message me on Upwork", href: site.links.upwork },
  contact: { label: "Open the contact page", to: "/contact" },
  work: { label: "See all work", to: "/work" },
  about: { label: "About Paul", to: "/about" },
  reviews: { label: "Read reviews on Upwork", href: site.links.upwork },
  faq: { label: "Browse the FAQ", to: "/faq" },
};

// Words that mean the same thing (left side becomes the right side)
export const SYNONYMS = {
  // pricing
  cost: "price", costs: "price", pricing: "price", rate: "price", rates: "price", charge: "price",
  charges: "price", fee: "price", fees: "price", quote: "price", quotation: "price", budget: "price",
  expensive: "price", cheap: "price", affordable: "price", pay: "payment", paying: "payment",
  invoice: "payment", deposit: "payment", milestone: "payment", milestones: "payment",
  // time
  long: "time", timeline: "time", timeframe: "time", deadline: "time", turnaround: "time",
  delivery: "time", deliver: "time", duration: "time", weeks: "time", week: "time", days: "time",
  fast: "time", quick: "time", quickly: "time", urgent: "time", asap: "time", soon: "time",
  // services
  ui: "product", ux: "product", uiux: "product", interface: "product", dashboard: "product",
  saas: "product", wireframe: "product", wireframes: "product", prototype: "product",
  prototyping: "product", figma: "figma", app: "app", apps: "app", mobile: "app", ios: "app",
  android: "app", branding: "brand", logo: "brand", logos: "brand", identity: "brand",
  rebrand: "brand", rebranding: "brand", strategy: "brand", guidelines: "brand",
  graphic: "graphic", graphics: "graphic", flyer: "graphic", flyers: "graphic", poster: "graphic",
  social: "graphic", banner: "graphic", banners: "graphic", marketing: "graphic", ads: "graphic",
  deck: "deck", decks: "deck", pitch: "deck", presentation: "deck", presentations: "deck",
  slides: "deck", powerpoint: "deck", keynote: "deck",
  website: "web", websites: "web", site: "web", webpage: "web", landing: "web", frontend: "web",
  develop: "web", development: "web", developer: "web", code: "web", coding: "web", build: "web",
  // tools
  tools: "tool", software: "tool", stack: "tool", photoshop: "tool", illustrator: "tool",
  adobe: "tool", vscode: "tool", tailwind: "tool", react: "tool", tech: "tool", technology: "tool",
  // people & work
  paul: "paul", ademola: "paul", yourself: "paul", designer: "paul",
  portfolio: "work", projects: "work", project: "work", examples: "work", samples: "work",
  case: "work", previous: "work", past: "work",
  review: "review", reviews: "review", testimonial: "review", testimonials: "review",
  feedback: "review", rating: "review", ratings: "review", trust: "review",
  recommendations: "review",
  hire: "hire", hiring: "hire", work_with: "hire", start: "hire", begin: "hire", book: "hire",
  available: "available", availability: "available", free: "available", capacity: "available",
  busy: "available", timezone: "location", zone: "location", country: "location", usa: "location",
  uk: "location", europe: "location", america: "location", canada: "location", australia: "location",
  africa: "location", foreign: "location",
  based: "location", nigeria: "location", where: "location", located: "location",
  email: "contact", mail: "contact", reach: "contact", message: "contact", call: "contact",
  whatsapp: "contact", phone: "contact", talk: "contact", chat: "contact",
  revision: "revision", revisions: "revision", changes: "revision", edits: "revision",
  iterations: "revision", tweaks: "revision",
  files: "files", source: "files", ownership: "files", own: "files", handoff: "files",
  handover: "files", rights: "files", copyright: "files",
  process: "process", steps: "process", workflow: "process", approach: "process", method: "process",
  maintenance: "support", support: "support", updates: "support", update: "support",
  host: "hosting", hosting: "hosting", domain: "hosting", deploy: "hosting", vercel: "hosting",
  netlify: "hosting", seo: "seo", google: "seo", speed: "seo", performance: "seo",
  nda: "nda", confidential: "nda", confidentiality: "nda", private: "nda", secret: "nda",
  redesign: "redesign", improve: "redesign", refresh: "redesign", revamp: "redesign",
  existing: "redesign", old: "redesign",
  hello: "hi", hey: "hi", hiya: "hi", morning: "hi", afternoon: "hi", evening: "hi", sup: "hi",
  thanks: "thank", thx: "thank", appreciate: "thank", bye: "bye", goodbye: "bye", later: "bye",
  bot: "bot", robot: "bot", ai: "bot", human: "bot", real: "bot", person: "bot",
};

export const topics = [
  {
    id: "greeting",
    keywords: { hi: 3 },
    phrases: ["good morning", "good afternoon", "good evening", "how are you"],
    answer: [
      {
        text: "Hi! 👋 I'm the **PAVORA assistant**. I can tell you about Paul's services, how he works, the tools he uses, his past projects and what clients say — or help you start a project.",
      },
    ],
    chips: ["What services do you offer?", "Show me your work", "Client reviews", "Start a project"],
  },
  {
    id: "about",
    ask: "Who is Paul?",
    keywords: { paul: 2, who: 2, about: 2, experience: 2, background: 2, team: 1 },
    phrases: ["who are you", "who is paul", "tell me about", "about you", "your background", "how many years"],
    answer: [
      {
        text: "**Paul Ademola** is a product designer, brand strategist and web developer based in Nigeria, working with clients worldwide. He designs in Figma and builds with React and Tailwind CSS — so what you approve is what ships.",
      },
      { card: "rating" },
      { actions: ["about", "work"] },
    ],
    chips: ["What services do you offer?", "Which tools do you use?", "Client reviews"],
    faq: {
      group: "Working together",
      question: "Who is behind PAVORA?",
      answer:
        "PAVORA is the studio of Paul Ademola — a product designer, brand strategist and web developer based in Nigeria who works with clients worldwide. He designs in Figma and builds with React and Tailwind CSS.",
    },
  },
  {
    id: "services",
    ask: "What services do you offer?",
    keywords: { service: 3, services: 3, offer: 2, help: 1, specialise: 2, specialize: 2, skills: 2 },
    phrases: ["what do you do", "what can you do", "what services", "can you help", "what do you offer"],
    answer: [
      { text: "Paul offers five services — tap one to learn more:" },
      { card: "services" },
    ],
    chips: ["Product design", "Brand identity", "Web development", "How do you work?"],
    faq: {
      group: "Services",
      question: "What services do you offer?",
      answer:
        "Product design (UI/UX for websites, apps and dashboards), brand strategy and identity, graphic design, presentation and pitch-deck design, and web development with React and Tailwind CSS.",
    },
  },
  {
    id: "service_product",
    ask: "What does product design include?",
    service: "Product Design",
    keywords: { product: 3, app: 2, figma: 1, user: 1, users: 1 },
    phrases: ["ui ux", "ui/ux", "user experience", "user interface", "mobile app", "web app"],
    answer: [
      {
        text: "**Product Design (UI/UX)** — intuitive websites, apps and dashboards shaped around real users and business goals. Depending on the project, this can include:",
      },
      {
        list: [
          "User flows and wireframes",
          "High-fidelity UI design in Figma",
          "Clickable prototypes to test ideas early",
          "Reusable components and a simple design system",
          "Developer-ready handoff — or Paul builds it himself",
        ],
      },
      { card: "projects", filter: "Product Design" },
      { actions: ["startProject"] },
    ],
    chips: ["Can you build it too?", "Which tools do you use?", "How much does it cost?"],
    faq: {
      group: "Services",
      question: "What does product design (UI/UX) include?",
      answer:
        "It can include user flows, wireframes, high-fidelity UI in Figma, clickable prototypes, reusable components and a developer-ready handoff — or Paul can build the design himself in React and Tailwind CSS.",
    },
  },
  {
    id: "service_brand",
    ask: "What is included in brand identity?",
    service: "Brand Identity",
    keywords: { brand: 3, visual: 1, colour: 1, color: 1, typography: 1 },
    phrases: ["brand identity", "logo design", "brand strategy", "visual identity"],
    answer: [
      {
        text: "**Brand Strategy & Identity** — distinctive identities that give your brand a clear voice and a look people remember. This can include:",
      },
      {
        list: [
          "Brand positioning and personality",
          "Logo design and variations",
          "Colour palette and typography",
          "Brand guidelines so everything stays consistent",
          "Applications — social, stationery, merchandise",
        ],
      },
      { card: "projects", filter: "Brand Identity" },
      { actions: ["startProject"] },
    ],
    chips: ["Graphic design", "How do you work?", "How long does it take?"],
    faq: {
      group: "Services",
      question: "What's included in a brand identity project?",
      answer:
        "It can include brand positioning, logo design and variations, colour palette, typography, brand guidelines and applications like social media, stationery and merchandise. The exact scope is agreed before starting.",
    },
  },
  {
    id: "service_graphic",
    ask: "Do you do graphic design?",
    service: "Graphic Design",
    keywords: { graphic: 3, design: 1, visuals: 2, campaign: 2, campaigns: 2 },
    answer: [
      {
        text: "**Graphic Design** — clear, striking visuals for campaigns, social media and every digital touchpoint: social posts, banners, flyers, ads and marketing graphics that stay on-brand.",
      },
      { actions: ["startProject", "work"] },
    ],
    chips: ["Brand identity", "Presentation design", "Start a project"],
  },
  {
    id: "service_deck",
    ask: "Do you design pitch decks?",
    service: "Presentations",
    keywords: { deck: 3, investor: 2, investors: 2 },
    phrases: ["pitch deck", "slide deck"],
    answer: [
      {
        text: "**Presentation Design** — pitch and business decks that turn complex ideas into clear visual stories. Great for investor pitches, sales decks and company profiles.",
      },
      { card: "projects", filter: "Presentations" },
      { actions: ["startProject"] },
    ],
    chips: ["Brand identity", "How do you work?", "Start a project"],
    faq: {
      group: "Services",
      question: "Do you design pitch decks?",
      answer:
        "Yes — pitch decks, sales decks and company presentations that turn complex ideas into clear visual stories.",
    },
  },
  {
    id: "service_web",
    ask: "Can you build my website?",
    service: "Web Development",
    keywords: { web: 3, responsive: 2, react: 2 },
    phrases: ["build a website", "build my website", "landing page", "design and build", "can you build", "build it too", "figma to code"],
    answer: [
      {
        text: "**Web Development** — responsive, production-ready websites built with **React** and **Tailwind CSS**, designed and developed by one person. That means no hand-off gaps between designer and developer.",
      },
      {
        list: [
          "Landing pages, portfolios and business websites",
          "Turning Figma designs into clean, responsive code",
          "Smooth animations and interactions",
          "Deployment to modern hosting like Vercel or Netlify",
          "WordPress or no-code builds when they suit the project better",
        ],
      },
      { card: "projects", filter: "Web Development" },
      { actions: ["startProject"] },
    ],
    chips: ["Which tools do you use?", "Do you offer maintenance?", "Can you redesign my site?"],
    faq: {
      group: "Tools & tech",
      question: "Can you design and build my website?",
      answer:
        "Yes. Paul designs in Figma and builds with React and Tailwind CSS, so one person takes your site from first idea to launch — responsive, animated and deployed to modern hosting like Vercel or Netlify.",
    },
  },
  {
    id: "tools",
    ask: "Which tools do you use?",
    keywords: { tool: 3, figma: 3, use: 1, program: 1 },
    phrases: ["what tools", "which tools", "what software", "what do you use", "tech stack"],
    answer: [
      { text: "These are the tools Paul works with every day:" },
      { card: "tools" },
    ],
    chips: ["Can you build it too?", "Product design", "Do you send source files?"],
    faq: {
      group: "Tools & tech",
      question: "Which tools do you work with?",
      answer:
        "Figma for UI/UX and prototyping, Adobe Photoshop and Illustrator for imagery and vector work, and VS Code with React and Tailwind CSS for building websites.",
    },
  },
  {
    id: "process",
    ask: "How do you work?",
    keywords: { process: 3, work: 1, how: 1 },
    phrases: ["how do you work", "your process", "what happens after", "what are the steps", "how does it work"],
    answer: [
      { text: "Every project follows four clear steps:" },
      { card: "process" },
      { text: "You'll see progress at each stage and give feedback before anything is final." },
    ],
    chips: ["How many revisions?", "How long does it take?", "Start a project"],
    faq: {
      group: "Working together",
      question: "What is your design process?",
      answer:
        "Four steps: Discover (understand your business, users and goals), Define (turn research into a clear plan), Design (shape the brand and interface, tested early and refined with you) and Deliver (polished files or a live build).",
    },
  },
  {
    id: "price",
    ask: "How much does it cost?",
    keywords: { price: 4, much: 2, payment: 1 },
    phrases: ["how much", "what do you charge", "your rate", "hourly rate", "fixed price"],
    answer: [
      {
        text: "Every project is different, so Paul quotes each one personally — there are no fixed price lists. **Send him a short message about your goals** and he'll reply with a tailored quote.",
      },
      { actions: ["startProject", "upwork"] },
    ],
    chips: ["How long does it take?", "How does payment work?", "Start a project"],
    faq: {
      group: "Pricing & timelines",
      question: "How much does a project cost?",
      answer:
        "Every project is quoted individually based on your goals and scope. Message Paul with a few details and he'll reply with a tailored quote.",
    },
  },
  {
    id: "time",
    ask: "How long does a project take?",
    keywords: { time: 4 },
    phrases: ["how long", "when can you", "how soon", "by when", "how many days", "how many weeks"],
    answer: [
      {
        text: "Timelines depend on the scope of the project, so Paul confirms delivery dates personally. **Message him with what you need and when** — he'll let you know what's realistic.",
      },
      { actions: ["startProject", "upwork"] },
    ],
    chips: ["How much does it cost?", "Are you available now?", "Start a project"],
    faq: {
      group: "Pricing & timelines",
      question: "How long does a project take?",
      answer:
        "It depends on the scope. Share what you need and your ideal deadline, and Paul will confirm a realistic timeline before you start.",
    },
  },
  {
    id: "payment",
    ask: "How does payment work?",
    keywords: { payment: 3, upfront: 2, secure: 1 },
    phrases: ["how do i pay", "how does payment work", "payment method"],
    answer: [
      {
        text: "If you hire through **Upwork**, payments are handled by Upwork's payment protection, so your money is safe until work is approved. For direct projects, payment terms are agreed in your proposal before work begins.",
      },
      { actions: ["upwork", "startProject"] },
    ],
    chips: ["Why hire on Upwork?", "How much does it cost?"],
    faq: {
      group: "Pricing & timelines",
      question: "How does payment work?",
      answer:
        "Through Upwork, payments are protected by Upwork's payment system. For direct projects, payment terms are agreed in the proposal before work starts.",
    },
  },
  {
    id: "upwork",
    ask: "Why hire on Upwork?",
    keywords: { upwork: 4, hire: 1, protection: 2, platform: 1 },
    phrases: ["why upwork", "on upwork", "hire on upwork", "hire you on upwork"],
    answer: [
      {
        text: "Hiring through Upwork gives you **payment protection** and **verified client reviews**. Paul has a strong track record there:",
      },
      { card: "rating" },
      { actions: ["upwork"] },
    ],
    chips: ["Client reviews", "Start a project"],
  },
  {
    id: "reviews",
    ask: "What do clients say?",
    keywords: { review: 4, say: 1, happy: 1, good: 1 },
    phrases: ["what do clients say", "client reviews", "past clients", "can i trust", "is he good"],
    answer: [{ text: "Here's what clients say about working with Paul:" }, { card: "reviews" }, { card: "rating" }],
    chips: ["Show me your work", "Start a project"],
  },
  {
    id: "work",
    ask: "Show me your work",
    keywords: { work: 3, show: 1, see: 1, done: 1 },
    phrases: ["show me your work", "your portfolio", "past projects", "previous work", "case studies"],
    answer: [{ text: "Here are some recent projects:" }, { card: "projects" }, { actions: ["work"] }],
    chips: ["Client reviews", "What services do you offer?", "Start a project"],
  },
  {
    id: "available",
    ask: "Are you available now?",
    keywords: { available: 4, new: 1, now: 1, taking: 1 },
    phrases: ["are you available", "taking new clients", "taking on projects", "can you start"],
    answer: [
      {
        text: "Paul takes on a limited number of projects at a time to keep quality high. The quickest way to check current availability is to **send a short message** — he'll get back to you personally.",
      },
      { actions: ["startProject", "upwork"] },
    ],
    chips: ["How long does it take?", "Start a project"],
  },
  {
    id: "location",
    ask: "Do you work with international clients?",
    keywords: { location: 4, international: 2, worldwide: 2, abroad: 2, overseas: 2 },
    phrases: ["where are you", "what time zone", "do you work with international", "outside nigeria", "clients in", "in the us", "in the uk", "work with clients"],
    answer: [
      {
        text: "Paul is based in **Nigeria (West Africa Time, UTC+1)** and works with clients all over the world, mostly through Upwork. Working across time zones is part of every project.",
      },
    ],
    chips: ["How do we communicate?", "Start a project"],
    faq: {
      group: "Working together",
      question: "Do you work with international clients?",
      answer:
        "Yes. Paul is based in Nigeria (West Africa Time, UTC+1) and works with clients worldwide, mostly through Upwork.",
    },
  },
  {
    id: "communication",
    ask: "How do we communicate?",
    keywords: { communicate: 3, communication: 3, updates: 1, meeting: 2, meetings: 2, zoom: 2 },
    phrases: ["how do we communicate", "keep me updated", "stay in touch"],
    answer: [
      {
        text: "You'll get regular progress updates and can give feedback at every stage. How you'd like to stay in touch — Upwork messages, email or calls — is agreed at the start.",
      },
    ],
    chips: ["How do you work?", "Start a project"],
  },
  {
    id: "revision",
    ask: "How many revisions do I get?",
    keywords: { revision: 4, satisfied: 2, dont: 1, like: 1 },
    phrases: ["what if i don't like", "how many revisions", "can i request changes"],
    answer: [
      {
        text: "Feedback and revisions are built into the process — you review the work at each stage before it's finalised. The number of revision rounds is agreed in your proposal.",
      },
    ],
    chips: ["How do you work?", "Start a project"],
    faq: {
      group: "Working together",
      question: "Can I request revisions?",
      answer:
        "Yes. You review the work at each stage and give feedback before anything is final. The number of revision rounds is agreed in your proposal.",
    },
  },
  {
    id: "files",
    ask: "Will I get the source files?",
    keywords: { files: 4, final: 1, receive: 1, get: 1 },
    phrases: ["do i get the files", "source files", "who owns", "figma file"],
    answer: [
      {
        text: "At the end of the project you receive the final files — typically the **Figma files** for design work and the **code** for web builds. Exact deliverables are confirmed in your proposal.",
      },
    ],
    chips: ["Which tools do you use?", "Start a project"],
    faq: {
      group: "Working together",
      question: "Will I receive the source files?",
      answer:
        "Final files are handed over at the end of the project — typically the Figma files for design work and the code for web builds. Exact deliverables are confirmed in your proposal.",
    },
  },
  {
    id: "redesign",
    ask: "Can you redesign my website?",
    keywords: { redesign: 4 },
    phrases: ["redesign my", "improve my website", "update my brand"],
    answer: [
      {
        text: "Yes — Paul can redesign an existing website, app or brand: keeping what works, fixing what doesn't and giving it a sharper, more modern look. Share a link to what you have now and what you'd like to improve.",
      },
      { actions: ["startProject"] },
    ],
    chips: ["Web development", "Brand identity"],
    faq: {
      group: "Services",
      question: "Can you redesign an existing website or brand?",
      answer:
        "Yes. Share a link to what you have and what you'd like to improve — Paul keeps what works, fixes what doesn't and modernises the rest.",
    },
  },
  {
    id: "support",
    ask: "Do you offer support after launch?",
    keywords: { support: 4, after: 1, launch: 1 },
    phrases: ["after launch", "ongoing support", "after the project"],
    answer: [
      {
        text: "Ongoing updates and support after launch can be arranged. Mention it when you get in touch and Paul will include it in your proposal.",
      },
      { actions: ["startProject"] },
    ],
    chips: ["Hosting & domains", "Start a project"],
  },
  {
    id: "hosting",
    ask: "Where will my site be hosted?",
    keywords: { hosting: 5 },
    answer: [
      {
        text: "Websites are deployed to modern hosting like **Vercel** or **Netlify** — fast, secure and reliable. Paul can help you connect your own domain.",
      },
    ],
    chips: ["Do you offer maintenance?", "Web development"],
  },
  {
    id: "seo",
    ask: "Is the website SEO-friendly?",
    keywords: { seo: 4 },
    answer: [
      {
        text: "Sites are built to be fast, responsive and well-structured — good foundations for search engines. If SEO is a priority for you, mention it so it's planned into the project.",
      },
    ],
    chips: ["Web development", "Start a project"],
  },
  {
    id: "nda",
    ask: "Can you sign an NDA?",
    keywords: { nda: 4 },
    answer: [
      {
        text: "Happy to respect confidentiality. If your project needs an NDA, mention it when you reach out and it can be arranged before you share details.",
      },
    ],
    chips: ["Start a project"],
  },
  {
    id: "consultation",
    ask: "Can we book a call?",
    keywords: { consultation: 4, consult: 4, call: 2, meeting: 2, discuss: 1 },
    phrases: ["book a call", "book a consultation", "video call", "hop on a call", "quick call"],
    answer: [
      {
        text: "Yes — you can **book a 30-minute video consultation** with Paul on Upwork to talk through your project before committing. Or start a project here and he'll reply to your brief personally.",
      },
      { actions: ["upwork", "startProject"] },
    ],
    chips: ["How do you work?", "Start a project"],
    faq: {
      group: "Working together",
      question: "Can we talk before starting?",
      answer:
        "Yes. You can book a 30-minute video consultation with Paul on Upwork to talk through your project before committing.",
    },
  },
  {
    id: "contact",
    ask: "How can I contact Paul?",
    keywords: { contact: 4 },
    phrases: ["get in touch", "contact you", "reach you", "talk to paul", "speak to paul"],
    answer: [
      {
        text: "The fastest way is to **start a project right here** — I'll collect a few details and send them straight to Paul. You can also message him on Upwork or use the contact page.",
      },
      { actions: ["startProject", "upwork", "contact"] },
    ],
    chips: ["Start a project"],
  },
  {
    id: "lead",
    ask: "Start a project",
    keywords: { hire: 4 },
    phrases: ["start a project", "i want to hire", "work with you", "work together", "i have a project", "need a designer", "i need a website", "i need a logo", "get started"],
    answer: [], // starts the project brief flow (see src/assistant/engine.js)
    chips: [],
  },
  {
    id: "bot",
    keywords: { bot: 3 },
    phrases: ["are you a bot", "are you real", "am i talking to"],
    answer: [
      {
        text: "I'm PAVORA's automated assistant 🤖 — I answer common questions instantly. Paul personally reads and replies to every project brief.",
      },
    ],
    chips: ["Start a project", "What services do you offer?"],
  },
  {
    id: "thanks",
    keywords: { thank: 4 },
    answer: [{ text: "You're welcome! Anything else you'd like to know?" }],
    chips: ["Start a project", "Show me your work"],
  },
  {
    id: "bye",
    keywords: { bye: 4 },
    answer: [{ text: "Thanks for stopping by! When you're ready, Paul would love to hear about your project. 👋" }],
    chips: ["Start a project"],
  },
];

// Real ratings from Paul's public Upwork profile (job title + star rating).
// Add written quotes later with  quote: "…", client: "…"
export const upworkRating = { score: 4.9, count: 12 };
export const upworkReviews = [
  { project: "Figma Website Designer for a Nonprofit Animal Shelter", rating: 5.0, date: "Apr 2026" },
  { project: "UI/UX & Figma Designer – Modern Designs", rating: 5.0, date: "Feb 2026" },
  { project: "Figma Design for a New Application", rating: 5.0, date: "Feb 2026" },
  { project: "Magento UI Refresh", rating: 5.0, date: "Nov 2025" },
  { project: "Travel Agency Website Development", rating: 5.0, date: "Oct 2025" },
  { project: "Figma UI Designer – Social Media Promotion Landing Page", rating: 5.0, date: "Aug 2025" },
  { project: "Figma Design Lander (mobile & desktop)", rating: 5.0, date: "Jul 2025" },
];

// Shown when the assistant isn't sure what was asked
export const fallback = {
  answer: [
    {
      text: "I'm not sure I caught that. I can help with Paul's **services**, **process**, **tools**, **past work**, **client reviews**, or **starting a project**. For anything else, Paul will happily answer personally.",
    },
    { actions: ["startProject", "upwork"] },
  ],
  chips: ["What services do you offer?", "How do you work?", "Client reviews", "Start a project"],
};

export const welcome = {
  answer: [
    { text: "Hi 👋 I'm the **PAVORA assistant**." },
    {
      text: "Ask me anything about Paul's services, process, tools or past work — or start a project and I'll pass your brief straight to him.",
    },
  ],
  chips: ["What services do you offer?", "Show me your work", "Client reviews", "Start a project"],
};

// Options used in the "Start a project" flow
export const leadOptions = {
  services: [
    "Product Design (UI/UX)",
    "Brand Identity",
    "Graphic Design",
    "Presentation Design",
    "Web Development",
    "Not sure yet",
  ],
  timelines: ["As soon as possible", "Within a month", "1–3 months", "Flexible"],
  budgets: ["Under $500", "$500 – $1,500", "$1,500 – $5,000", "$5,000+", "Not sure yet"],
};
