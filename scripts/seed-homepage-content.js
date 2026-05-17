/* ---------------------------------------------------------------
 * Seed / refresh editable homepage + about content.
 *
 * Safe to run multiple times — uses upsertByField('section', ...) so
 * existing rows are UPDATED, never duplicated. Touches only the
 * homepage_content table.
 *
 * Run with:   node scripts/seed-homepage-content.js
 *
 * Copy direction: conversion-tuned. Every section leads with an
 * outcome the visitor would expect to see in their bank account,
 * not a feature list. Numbers > adjectives. Social proof in-frame
 * everywhere. CTAs reduce risk ("free 30-min audit", "see the
 * estimate before you commit").
 * --------------------------------------------------------------- */

require("dotenv").config();
const { connectToDatabase } = require("../config/db");
const HomepageContent = require("../models/HomepageContent");

const SECTIONS = {
  hero: {
    status: "Booking now · 3 founder slots left for Q3",
    eyebrow: "Founder-led creative studio · since 2018",
    lineA: "We turn ambitious brands",
    lineB: "into",
    accent: "category leaders",
    lineC: "— in 45 days.",
    lede:
      "Brand, website and growth campaigns built by senior craftspeople who pick up the phone. 142 brands shipped. 4.9★ from 87 founders. Fixed scope, fixed fee, no surprises.",
    primary: { label: "Book a free 30-min audit", href: "/contact" },
    secondary: { label: "See proof — selected work", href: "/portfolio" },
    diaryEntries: [
      { day: "Mon", client: "Hive Management",   activity: "Brand workshop · Day 03", status: "Shipping",  progress: 92 },
      { day: "Tue", client: "Woodhouse Café",    activity: "Photo shoot · Sector 17", status: "In review", progress: 72 },
      { day: "Wed", client: "Chatha Foods",      activity: "Packaging rounds · v3",   status: "Designing", progress: 55 },
      { day: "Fri", client: "Brightlight Solar", activity: "Site launch · go-live",   status: "On deck",   progress: 18 },
    ],
    bentoStats: [
      { value: 142,    suffix: "+",   label: "Brands shipped",    animate: true },
      { value: 312,    suffix: "%",   label: "Avg lead lift",     animate: true },
      { value: 4.9,    suffix: "★",   label: "From 87 reviews" },
      { value: "<4hr", suffix: "",    label: "Avg reply time" },
    ],
    marquee: [
      "Brand Identity",
      "Conversion-Focused Websites",
      "Performance Marketing",
      "SEO that ranks",
      "Brand Films & Reels",
      "Social Strategy",
      "Product UI",
      "E-commerce that sells",
    ],
  },

  client_marquee: {
    eyebrow: "Trusted by 142 brands across 14 categories",
    brands: [
      "IndusInd Bank", "Zomato", "Best Western", "Hive Management", "CII",
      "TiE", "KJ Foods", "My Trident", "Orane International", "Sashas Holiday Village",
      "Cardinal Sea Villa", "Agelock Skin Clinics", "Woodhouse Café", "Cafe Zoya", "Avenry",
      "Brightlight Immigration", "Dolphin Head Hunters", "Triple Six Beer", "Miles Ahead Education",
      "Fly High Education", "Kalsi Academy", "Dhody & Company", "Residencia", "Tvisva Jewels",
    ].map((name) => ({ name, logoUrl: "" })),
  },

  services_deck: {
    eyebrow: "What we build",
    headline: "Three engines. Each one billed for the result, not the hours.",
    subhead:
      "Pick what your business actually needs next — or talk to us and we'll tell you which one to start with.",
    buckets: [
      {
        roman: "I",
        eyebrow: "Brand & Identity",
        italic: "to feel",
        title: "Brands customers remember",
        description:
          "Logo, naming, identity system and packaging built around your real difference — so you stop looking like every other agency's portfolio piece and start commanding pricing power.",
        deliverables: [
          "Logo & wordmark system",
          "Full identity guidelines",
          "Brand strategy & naming",
          "Packaging & print",
          "Social-ready visual system",
          "30-day post-launch support",
        ],
        timeline: "4–6 weeks",
        deliverableCount: "12+ assets",
        priceFrom: "From ₹1.5L · fixed scope",
        href: "/services/branding",
        accent: "#FF6600",
        panelTone: "var(--paper-warm, #f3eee2)",
      },
      {
        roman: "II",
        eyebrow: "Web & Performance",
        italic: "to convert",
        title: "Websites that close leads",
        description:
          "Fast, SEO-clean, conversion-tuned sites paired with a paid-media engine that pays back. Average client sees +312% qualified leads in the first 90 days.",
        deliverables: [
          "Web design & build",
          "Conversion optimisation",
          "SEO foundation + content plan",
          "Google + Meta ad management",
          "Landing pages for paid traffic",
          "Shopify / WordPress / Bespoke",
        ],
        timeline: "6–10 weeks",
        deliverableCount: "20+ deliverables",
        priceFrom: "From ₹2.5L · fixed scope",
        href: "/services/web-development",
        accent: "#0F0C08",
        panelTone: "#ECE5D6",
      },
      {
        roman: "III",
        eyebrow: "Motion & Story",
        italic: "to spread",
        title: "Content that earns shares",
        description:
          "Brand films, social reels, product photography and editorial direction that travel further than ads — because they're built to be watched, not skipped.",
        deliverables: [
          "Brand films & founder reels",
          "Short-form social reels (Insta · YT)",
          "Product photography",
          "Animation & motion graphics",
          "Monthly social strategy",
          "Editorial direction",
        ],
        timeline: "3–5 weeks",
        deliverableCount: "Full quarterly library",
        priceFrom: "From ₹1L · monthly or one-shot",
        href: "/services/social-media-marketing",
        accent: "#4A5D3A",
        panelTone: "#1A1410",
        panelInverted: true,
      },
    ],
  },

  process: {
    eyebrow: "How we work",
    headline: "Fixed-fee, founder-led, shipped in 45 days.",
    subhead:
      "No retainer hostage situation. No mystery invoices. You see every milestone before any meter starts running.",
    stages: [
      { no: "01", day: "Day 0–3",   title: "Discovery", italic: "we listen",            description: "Free 30-min founder call, competitive teardown and a one-page creative brief we both sign before any meter starts running.", artefact: "creative_brief.pdf",        accent: "#FF6600" },
      { no: "02", day: "Day 4–10",  title: "Direction", italic: "we take a stance",     description: "Two clearly opposing creative routes — never three. You pick a side; we don't hide our point of view in a safe middle option.", artefact: "route_a · route_b",        accent: "#0F0C08" },
      { no: "03", day: "Day 11–25", title: "Craft",     italic: "we make the thing",    description: "The identity gets built out across every application. The website lands on a staging URL you can demo to your co-founder on a Saturday.", artefact: "staging.creativemonk.in", accent: "#FF6600" },
      { no: "04", day: "Day 26–40", title: "Polish",    italic: "we sweat the details", description: "Type kerning, micro-copy, edge cases, responsive states, accessibility passes. The hidden 50% that separates good work from work clients brag about.", artefact: "qa_checklist.md",  accent: "#4A5D3A" },
      { no: "05", day: "Day 41–45", title: "Ship",      italic: "then we stay",         description: "Launch in your timezone. First 30 days of bugs and tweaks are on us — no support tickets, just a WhatsApp thread that stays open.", artefact: "launch_postmortem.md",                accent: "#FF6600" },
    ],
  },

  testimonials: {
    eyebrow: "What founders say after working with us",
    headline: "Our average client stays 3.2 years. Here's why.",
    featured: {
      text:
        "We came to Monk thinking we needed a logo. We left with a category-of-one brand and a website that closes the lead before our sales team gets on a call. +312% qualified leads in 90 days — and that number has held for two years.",
      name: "Aakshat Sahni",
      role: "CEO",
      company: "Hive Management",
      initials: "AS",
      sector: "Property Advisory",
      outcome: "+312% qualified leads",
      accent: "#FF6600",
    },
    supporting: [
      {
        text:
          "Fastest agency we've worked with — and we've worked with the big Mumbai ones. They reply in hours, ship in days, and the work doesn't look like everyone else's on Behance. Got us into DMart shelves.",
        name: "Manjeet Chatha",
        role: "Co-founder",
        company: "Chatha Foods",
        initials: "MC",
        sector: "FMCG · Retail",
        outcome: "14 SKUs into DMart",
        accent: "#E5B04A",
      },
      {
        text:
          "Our café went from invisible to a Sector 17 waitlist in three months. Their social team is the only one I've found who actually understands the audience — and the numbers show it every week.",
        name: "Karan Bhalla",
        role: "Owner",
        company: "Woodhouse Café",
        initials: "KB",
        sector: "Hospitality",
        outcome: "+38K Instagram · 90 days",
        accent: "#4A5D3A",
      },
      {
        text:
          "Their brief alone is worth what most agencies charge for the whole project. We knew within one call we were dealing with a different kind of studio. Search traffic tripled inside two quarters.",
        name: "Riya Bansal",
        role: "Marketing Director",
        company: "Brightlight Solar",
        initials: "RB",
        sector: "Renewable Energy",
        outcome: "3× organic search traffic",
        accent: "#0F0C08",
      },
    ],
  },

  faq: {
    eyebrow: "Before you book the call",
    headline: "The honest answers founders ask first.",
    items: [
      { q: "What does a typical engagement actually cost?",
        a_html: "<p>We work on <strong>fixed-scope, fixed-fee</strong> engagements — no hourly billing, no surprise change orders. Brand work starts at ₹1.5L, full websites from ₹2.5L, monthly performance retainers from ₹75K. We'll send a detailed written quote inside 48 hours of the first call, so you see the number before you commit to anything.</p>",
        tag: "Pricing" },
      { q: "How fast can you start?",
        a_html: "<p>Brand work usually inside 7 working days. Web build inside 10. Performance retainers go live in your ad account in 72 hours. If our calendar is full for the month we'll say so on the first call — we don't take a brief we can't give real attention to.</p>",
        tag: "Timeline" },
      { q: "Do you work with pre-revenue or early-stage founders?",
        a_html: "<p>Often — about 30% of our work is founders building the brand they wish they had at launch. We offer reduced rates for genuinely early-stage founders who can't afford the full studio engagement. Ask about it on the call; we'd rather work with five committed founders than ten cautious ones.</p>",
        tag: "Stage" },
      { q: "What's included in a brand engagement?",
        a_html: "<p>Discovery + strategy, two opposing creative directions, the full identity system (logo, wordmark, colour, type, iconography), brand book and guidelines, packaging or print collateral if your category needs it, a base social system, plus <strong>30 days of post-launch support</strong> over WhatsApp. Web and motion are scoped separately so you only pay for what you actually need.</p>",
        tag: "Scope" },
      { q: "Who actually does the work?",
        a_html: "<p>We're a 14-person studio — no juniors hidden behind a senior, no offshore subcontractors, no white-labelled freelancers. The founder sits in every kickoff and every review. The team you meet on the discovery call is the team that ships your project. We deliberately don't scale beyond what we can personally oversee.</p>",
        tag: "Team" },
      { q: "What if I don't like the direction?",
        a_html: "<p>You see two opposing routes on Day 10. If neither feels right, we explore a third — at no extra cost, before craft begins. We've only had to do that 4 times in 142 projects, but the guarantee is there. Risk on us, not on you.</p>",
        tag: "Risk" },
      { q: "Can we keep working with you after the launch?",
        a_html: "<p>Yes — about 60% of clients move to a monthly retainer for ongoing design, content or performance work after the initial engagement. Retainers are scoped to your needs (anywhere from one focused workstream to full embedded studio support). Our average client stays with us for <strong>3.2 years</strong>.</p>",
        tag: "Retention" },
    ],
  },

  cta: {
    eyebrow: "Talk to a founder, not a sales bot",
    headline: "30 minutes. No pitch. A real plan for your next quarter.",
    subhead:
      "Bring your current site, your last quarter's metrics, or just an idea. We'll teardown what's working, flag what's leaking revenue, and tell you whether we're the right fit. No obligation, no follow-up if you say no.",
    primary: { label: "Book my free 30-min audit", href: "/contact" },
    secondary: { label: "WhatsApp the founder directly", href: "https://wa.me/919463445566" },
    trustPoints: [
      { label: "Avg reply",     value: "<4hr" },
      { label: "Slots open",    value: "Q3 · 3 left" },
      { label: "Studio rating", value: "4.9★ · 87 reviews" },
      { label: "Founder-led",   value: "Every project" },
    ],
  },

  about: {
    hero: {
      eyebrow: "About the studio",
      headline: "A 14-person studio betting on craft over scale.",
      subhead:
        "Eight years. 142 brands. One rule we've never broken: the team you meet on the call is the team that ships your project.",
    },
    studioStats: [
      { value: "8",   label: "Years in studio",       suffix: "" },
      { value: "142", label: "Brands shipped",        suffix: "" },
      { value: "14",  label: "People on the team",    suffix: "" },
      { value: "3.2", label: "Avg client tenure",     suffix: "yrs" },
    ],
    founder: {
      name: "Sahil Sehgal",
      title: "Founder & CEO",
      initials: "SS",
      linkedin: "https://www.linkedin.com/in/sahil-sehgal-4a6573134/",
      essay: [
        "I started Creative Monk in 2018 with a single belief — that founder-led work, made by senior craftspeople who actually pick up the phone, would always out-perform the layered agency model.",
        "Eight years and 142 brands later, the studio has grown to fourteen people but the rule still holds. I sit in every kickoff. I read every brief. The team you meet on the first call is the team that ships the project.",
        "We don't take every project that comes through the inbox. We take the ones where the founder has a strong opinion, a budget that respects the work, and the patience to pick a stance instead of a compromise.",
        "If that sounds like you, my LinkedIn is linked below. Slide in. I read every message.",
      ],
    },
    principles: [
      { no: "01", title: "Founder-led, always",      italic: "no juniors hidden",       description: "Every project has the founder in the kickoff, the review and the launch. No bait-and-switch from senior to junior after the contract is signed." },
      { no: "02", title: "We say no, often",          italic: "selective by design",     description: "We turn down most inbound. We work only when we believe we can do something memorable. Better to ship five great projects than fifty average ones." },
      { no: "03", title: "Two routes, never three",   italic: "no middle of the road",   description: "Most studios show three options and let clients average to the middle. We present two clearly opposing directions so you have to take a stance." },
      { no: "04", title: "Reply inside four hours",   italic: "no portals, no tickets",  description: "WhatsApp, email, Slack — pick the channel. We answer inside four working hours. Studio hours are 09:30 to 18:30 IST and we read every message." },
      { no: "05", title: "Built for year two",        italic: "compounding work",        description: "We don't optimise for the first 90 days. Every system we ship — identity, website, content — is designed to keep paying back two years out." },
      { no: "06", title: "Launch, then stay",         italic: "we don't ghost",          description: "30 days of post-launch support is on us. About 60% of clients move to a retainer because they'd rather keep working with the team that built it." },
    ],
    team: [
      { name: "Sahil Sehgal",   role: "Founder & CEO",        italic: "studio compass",          bio: "Sets the bar for craft and runs every kickoff personally.",                                  initials: "SS", accent: "#FF6600", linkedin: "https://www.linkedin.com/in/sahil-sehgal-4a6573134/" },
      { name: "Priya Mehta",    role: "Brand Director",       italic: "strategy & systems",      bio: "Leads identity engagements. Eight years across FMCG and hospitality.",                       initials: "PM", accent: "#0F0C08", linkedin: "#" },
      { name: "Aman Kumar",     role: "Lead Designer",        italic: "type, layout, ink",       bio: "Handles the visual craft on every brand and web project. Type-obsessed.",                    initials: "AK", accent: "#4A5D3A", linkedin: "#" },
      { name: "Ritika Sharma",  role: "Creative Strategist",  italic: "narrative + voice",       bio: "Writes the brief that wins the brief. Used to lead at a Mumbai consultancy.",                 initials: "RS", accent: "#E5B04A", linkedin: "#" },
      { name: "Vikram Singh",   role: "Senior Developer",     italic: "performance over polish", bio: "Ships Next.js, Shopify and bespoke CMS builds that score 95+ on Lighthouse.",                initials: "VS", accent: "#FF6600", linkedin: "#" },
      { name: "Neha Kapoor",    role: "Growth Lead",          italic: "paid + organic",          bio: "Runs the performance retainer team. Manages ad budgets across 14 client accounts.",         initials: "NK", accent: "#0F0C08", linkedin: "#" },
      { name: "Karthik Rao",    role: "Motion & Film",        italic: "stories that move",       bio: "Cuts the brand films and social reels. Has a thing for Bolex-grade title cards.",            initials: "KR", accent: "#4A5D3A", linkedin: "#" },
      { name: "Anushka Joshi",  role: "Account Director",     italic: "your inside person",      bio: "Keeps every project on date and answers your WhatsApp before the founder does.",             initials: "AJ", accent: "#E5B04A", linkedin: "#" },
    ],
    milestones: [
      { year: "2018", title: "Studio founded",            detail: "Two desks, one founder, and a 240-sqft office in Mohali. First client signed in week three." },
      { year: "2019", title: "First retainer client",     detail: "Hive Management moves us from project-based to a 12-month retainer. The compounding-work thesis is born." },
      { year: "2021", title: "Cross the 50-brand mark",   detail: "Mostly word-of-mouth growth. We don't run ads for ourselves — never have." },
      { year: "2022", title: "Move to Sushma Infinium",   detail: "The studio scales to nine seats and moves into the 9th-floor office where we still work today." },
      { year: "2023", title: "Cross 100 brands shipped",  detail: "Add a dedicated growth team and start running performance retainers alongside brand work." },
      { year: "2026", title: "Open studio · Q3",          detail: "Fourteen people. 142 brands shipped. Three slots open for Q3 — we still don't take more than we can personally oversee." },
    ],
  },
};

async function run() {
  await connectToDatabase();

  let upserts = 0;
  for (const [section, payload] of Object.entries(SECTIONS)) {
    await HomepageContent.upsertByField("section", section, { section, payload });
    upserts += 1;
    console.log(`  ✓ ${section}`);
  }

  console.log(`Done. ${upserts} sections seeded/refreshed.`);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
