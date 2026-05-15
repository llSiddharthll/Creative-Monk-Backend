/* ---------------------------------------------------------------
 * Seed / refresh long-form content for every service in the nav.
 *
 * Safe to run multiple times — uses upsertByField('slug', ...) so
 * existing records get UPDATED, never duplicated. Touches Service
 * rows only. ServiceCategory, SiteSettings, etc. are left alone.
 *
 * Run with:   node scripts/seed-services-content.js
 * --------------------------------------------------------------- */

require("dotenv").config();
const { connectToDatabase } = require("../config/db");
const Service = require("../models/Service");

/* A tiny library of dummy hero / detail images. Round-robin so each
   service has at least one placeholder until real photography lands. */
const DUMMY_IMAGES = [
  "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542435503-956c469947f6?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&q=80&auto=format&fit=crop",
];

/* Re-usable process steps. Most engagements share the same five-stage
   shape — overrides only when a service deviates meaningfully. */
const STANDARD_PROCESS = [
  {
    step: "Discovery",
    desc: "A 60-minute founder call, a competitive teardown, and a one-page brief we both sign before any meter starts running.",
  },
  {
    step: "Direction",
    desc: "Two clearly opposing creative or strategic routes — never three. You pick a side instead of compromising to the middle.",
  },
  {
    step: "Craft",
    desc: "The senior team builds the deliverables. Staging links, working files and proof artefacts every week — no black-box phases.",
  },
  {
    step: "Polish",
    desc: "Micro-copy, edge cases, accessibility passes and the boring 50% that separates good work from great work.",
  },
  {
    step: "Ship",
    desc: "Launch in your timezone. First 30 days of bugs and tweaks are on us — no support tickets, just WhatsApp.",
  },
];

/* ----------------- SERVICE CONTENT -----------------
 * 19 services across 3 categories. Each one carries a full brief
 * ready to render on the /services/[slug] page.
 * --------------------------------------------------- */

const SERVICES = [
  /* ====== DIGITAL MARKETING ====== */
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    shortTitle: "Digital Marketing Services",
    category: "digital-marketing",
    icon: "BarChart3",
    tagline:
      "Full-funnel growth engineering for founders who measure the work in pipeline, not impressions.",
    shortDescription:
      "End-to-end digital marketing — SEO, paid media, content and CRO — wired together as one growth system that compounds month over month.",
    longDescription:
      "We treat digital marketing as plumbing, not posters. The studio takes one quarter to ship a measurement layer, organic SEO, paid acquisition and a conversion-tuned site as a single coherent program. By month three you can see exactly which channel earns you a customer and what each one costs. By month six the organic + email base is doing enough heavy lifting that paid budget becomes a lever, not a lifeline.",
    features: [
      "Channel strategy & quarterly roadmap",
      "Full-funnel attribution (GA4 + server-side)",
      "SEO + content production",
      "Paid media (Google, Meta, LinkedIn)",
      "Email & lifecycle automation",
      "Conversion rate optimization (CRO)",
      "Monthly reporting with a real human",
      "Weekly Loom updates, not slide decks",
    ],
    outcomes: [
      "Cleaner attribution across paid + organic",
      "Lower blended CAC quarter over quarter",
      "Compounding organic + email base",
      "Pipeline you can defend to investors",
    ],
    faqs: [
      {
        question: "Do you handle the whole stack or just one channel?",
        answer:
          "We work as your in-house growth team across the whole funnel. If you only want paid or only SEO, we'd rather recommend a specialist — the compound value comes from running all of it as one program.",
      },
      {
        question: "What kind of brands do you take on?",
        answer:
          "Founder-led companies with at least one shipped product or service, real revenue (or pre-revenue with funded runway), and an opinion on what they want to be known for. We turn down most ad-spend-only briefs.",
      },
      {
        question: "How fast can we go live?",
        answer:
          "Measurement layer + analytics audit in week 1. First campaigns and SEO sprints in your account within 10 working days. Real pipeline signal usually visible inside 90 days.",
      },
    ],
    detailContent: {
      heroEyebrow: "Growth System",
      overviewTitle:
        "A growth engine that earns its keep in pipeline, not vanity metrics.",
      partnerDescription:
        "Strategy, channels, content and measurement run as one program with one accountable team.",
      bestFitDescription:
        "Founder-led B2B or D2C brands ready to take growth seriously for at least two quarters.",
      capabilitiesTitle:
        "Everything plumbed together so growth feels like one machine, not five vendors.",
      processTitle:
        "A 90-day onramp that proves the model before we ask for year-two budget.",
      faqTitle: "Questions founders ask us before signing the SOW.",
    },
    isFeatured: true,
    order: 1,
  },
  {
    slug: "seo",
    title: "Search Engine Optimization",
    shortTitle: "SEO",
    category: "digital-marketing",
    icon: "Search",
    tagline:
      "Organic search that compounds — built on technical fundamentals, real content, and topical authority.",
    shortDescription:
      "Technical SEO + content + on-page + authority work that earns rankings competitors can't undercut with budget.",
    longDescription:
      "Most SEO retainers are content factories shipping average articles against keyword sheets. We do the opposite: fewer, denser, deeply-researched assets paired with technical hygiene and a real internal-link architecture. The result is a site that ranks for the terms your buyers actually search — and keeps ranking when the algorithm shifts.",
    features: [
      "Technical SEO audit & fixes",
      "Keyword & intent research",
      "On-page optimization at scale",
      "Topical clusters + content briefs",
      "Long-form editorial production",
      "Internal link architecture",
      "Schema markup & rich snippets",
      "Backlink campaigns (white-hat only)",
    ],
    outcomes: [
      "Rankings on commercial-intent terms",
      "Compounding organic traffic curve",
      "Lower CAC over 12 months",
      "Topical authority in your niche",
    ],
    faqs: [
      {
        question: "How long before we see results?",
        answer:
          "Technical wins land in weeks. Content rankings typically start moving inside 90 days. Compounding traffic shows up in months 6–9. We send a real progress note every Friday so you can see early signal long before the topline moves.",
      },
      {
        question: "Do you guarantee #1 rankings?",
        answer:
          "Nobody honest does. We guarantee the methodology — every deliverable signed off by a senior, every recommendation backed by data. If you'd like a vendor that promises #1, we'll politely pass.",
      },
      {
        question: "Do you write the content too, or just brief writers?",
        answer:
          "We write it. In-house. Every long-form article has a senior strategist as the named author and a real editor before it ships.",
      },
    ],
    detailContent: {
      heroEyebrow: "Organic Search",
      overviewTitle: "Rankings that compound — built for buyers, not the keyword tool.",
      bestFitDescription:
        "Brands competing in search-driven categories that want compounding owned media.",
      processTitle: "Technical hygiene + dense content + authority work — in that order.",
    },
    order: 2,
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    shortTitle: "Social Media",
    category: "digital-marketing",
    icon: "MessageCircle",
    tagline:
      "Audience-first social that builds brand affinity and earns the share — not just the impression.",
    shortDescription:
      "Strategy, content production and community management for brands that want their social to feel curated, not scheduled.",
    longDescription:
      "We don't run social like a content calendar treadmill. The studio sits down each quarter, defines two or three editorial pillars worth showing up for, and produces fewer-but-better posts that fit the audience's feed. We measure success in saves, shares and DMs — the signals that actually predict revenue — not vanity engagement.",
    features: [
      "Editorial strategy & pillars",
      "Monthly content production",
      "Carousels, reels & short-form video",
      "Community management",
      "Influencer & creator collabs",
      "Paid social amplification",
      "Quarterly creative reviews",
      "Platform reporting & insight",
    ],
    outcomes: [
      "Distinct brand voice on social",
      "Higher save + share ratios",
      "Inbound DMs that convert",
      "Owned audience that doesn't churn",
    ],
    faqs: [
      {
        question: "Which platforms do you cover?",
        answer:
          "Instagram, LinkedIn, YouTube Shorts and X are the core. We add TikTok or Pinterest when the audience justifies it — but we'd rather do two platforms exceptionally than five mediocre ones.",
      },
      {
        question: "Do you shoot the content or just edit?",
        answer:
          "Both. We have an in-house production crew for India shoots and a remote workflow for international clients. Every reel ships with cuts, captions and platform-native specs.",
      },
    ],
    detailContent: {
      heroEyebrow: "Social Studio",
      overviewTitle:
        "Social that feels like a magazine — not a calendar scheduled by a bot.",
      bestFitDescription:
        "Brands that want a distinct social voice and have real stories worth telling.",
    },
    order: 3,
  },
  {
    slug: "ppc",
    title: "PPC Advertising",
    shortTitle: "PPC",
    category: "digital-marketing",
    icon: "Target",
    tagline:
      "Paid media that pays back — built on tight measurement, lean creative iteration and ROAS discipline.",
    shortDescription:
      "Google, Meta and LinkedIn paid programs run by senior media buyers with conversion-tracking they can actually defend.",
    longDescription:
      "Most paid ad retainers waste 30% of budget on bad measurement. We start with the tracking layer — server-side events, deduplicated conversions, a real attribution model — then run lean iterative creative tests against it. The campaigns we ship target intent first and audience second, with creative that's been through three rounds of internal critique before it sees a single rupee of ad spend.",
    features: [
      "Account audit & restructure",
      "Server-side conversion tracking",
      "Creative production for paid",
      "Lean A/B testing program",
      "Bid strategy & budget pacing",
      "Landing page conversion optimization",
      "Retargeting & lookalike funnels",
      "Weekly P&L reporting",
    ],
    outcomes: [
      "Lower CAC vs in-house benchmark",
      "Clean tracking you can defend",
      "Creative library that compounds",
      "Paid as a lever, not a lifeline",
    ],
    faqs: [
      {
        question: "What's a typical media budget range?",
        answer:
          "We work best with monthly media budgets above ₹2L and below ₹40L. Lower than that and the math doesn't justify a senior team; higher and you should hire in-house and use us strategically.",
      },
      {
        question: "Who handles the creative for the ads?",
        answer:
          "We do — and it makes a 2–3× difference. The same audience targeting with our creative consistently out-performs the same audience with the client's existing assets.",
      },
    ],
    detailContent: {
      heroEyebrow: "Performance Marketing",
      overviewTitle:
        "Paid media run like a P&L — with the tracking, creative and discipline most agencies skip.",
    },
    order: 4,
  },
  {
    slug: "local-business-marketing",
    title: "Local Business Marketing",
    shortTitle: "Local Marketing",
    category: "digital-marketing",
    icon: "MapPin",
    tagline:
      "Map-pack rankings, walk-ins and call volume for brands whose customers are within a 25-km radius.",
    shortDescription:
      "Google Business Profile, local SEO, hyperlocal ads and reputation management for brick-and-mortar businesses.",
    longDescription:
      "Local marketing is its own discipline — Google Business Profile, citation consistency, geo-targeted paid, and review velocity all matter more than generic SEO. We've shipped local programs for clinics, restaurants, salons and retail across Tricity and beyond. Most clients see map-pack visibility and call volume move within the first 60 days.",
    features: [
      "Google Business Profile optimization",
      "Local schema & citation cleanup",
      "Hyperlocal Google + Meta ads",
      "Review-velocity program",
      "Location landing pages",
      "Service-area SEO",
      "Call tracking & attribution",
      "Reputation management",
    ],
    outcomes: [
      "Top 3 map-pack rankings",
      "Higher call + walk-in volume",
      "5-star review velocity",
      "Defensible local moat",
    ],
    faqs: [
      {
        question: "Do you work with single-location and multi-location brands?",
        answer:
          "Both. Single locations get a tighter Google Business Profile sprint; multi-location brands get a templated locations-page architecture and per-store performance dashboards.",
      },
    ],
    detailContent: {
      heroEyebrow: "Local SEO",
      bestFitDescription:
        "Brick-and-mortar businesses, clinics, restaurants and service-area brands.",
    },
    order: 5,
  },
  {
    slug: "lead-generation",
    title: "Lead Generation",
    shortTitle: "Lead Gen",
    category: "digital-marketing",
    icon: "UserPlus",
    tagline:
      "Predictable inbound for B2B and high-ticket service businesses — without buying junk lists.",
    shortDescription:
      "Multi-channel inbound programs that send your sales team qualified, intent-rich leads they actually want to call.",
    longDescription:
      "Lead generation done right is a system, not a tactic. We combine intent-data targeting, conversion-tuned landing pages, lifecycle email, and a tight handoff to your CRM so every lead is scored, routed and owned. Most clients move from \"random networking inbound\" to a predictable pipeline they can forecast from inside 90 days.",
    features: [
      "Ideal customer profile workshop",
      "Conversion-tuned landing pages",
      "LinkedIn + cold email programs",
      "Intent data targeting",
      "CRM setup & lifecycle automation",
      "Lead scoring & routing",
      "Sales-ready handoff playbook",
      "Pipeline analytics",
    ],
    outcomes: [
      "Qualified inbound flow, weekly",
      "Lower cost-per-meeting",
      "Tighter sales–marketing handoff",
      "Forecastable revenue pipeline",
    ],
    faqs: [
      {
        question: "Do we get a list, or actual conversations?",
        answer:
          "Actual conversations. We measure success in meetings booked and pipeline opened — never in raw form-fills or list size.",
      },
    ],
    detailContent: {
      heroEyebrow: "Inbound Engine",
      bestFitDescription:
        "B2B and high-ticket service brands with a real sales team to receive the leads.",
    },
    order: 6,
  },
  {
    slug: "branding",
    title: "Branding",
    shortTitle: "Branding",
    category: "digital-marketing",
    icon: "Sparkles",
    tagline:
      "Brand strategy + identity systems that help ambitious founders escape the look-alike trap.",
    shortDescription:
      "Positioning, naming, identity systems and brand guidelines for companies that want to stop looking like their category.",
    longDescription:
      "We treat branding as a strategy exercise first and an aesthetic exercise second. Every engagement starts with a positioning workshop — who you serve, who you don't, and what you want to be remembered for — before we touch a pixel. The identity system that follows is built to outlast a TVC cycle: logo, wordmark, type, color, voice, iconography and the rules that keep it coherent two years post-launch.",
    features: [
      "Positioning & brand strategy",
      "Naming & verbal identity",
      "Logo & wordmark design",
      "Visual identity system",
      "Brand book & guidelines",
      "Brand voice & tone of voice",
      "Application across touchpoints",
      "Brand audit & refresh",
    ],
    outcomes: [
      "Category-of-one positioning",
      "Identity system that scales",
      "Confidence to charge more",
      "Investor- and recruit-ready brand",
    ],
    faqs: [
      {
        question: "What's the difference between branding and a logo?",
        answer:
          "A logo is one part of a brand. Branding is the strategy, voice, visual system, and rules that make a logo recognizable — and that keep every future touchpoint feeling consistent.",
      },
      {
        question: "How long does a brand engagement take?",
        answer:
          "Full identity engagements run 6–10 weeks. We split it into Discovery (week 1–2), Direction (week 2–4), Craft (week 4–8) and Rollout (week 8–10). You see signed artefacts at every milestone.",
      },
    ],
    detailContent: {
      heroEyebrow: "Brand Strategy",
      overviewTitle:
        "Identity systems built for the category your brand wants to define.",
    },
    order: 7,
  },

  /* ====== WEB DESIGN / DEVELOPMENT ====== */
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    shortTitle: "WordPress",
    category: "web-design",
    icon: "Code",
    tagline:
      "WordPress builds that perform like custom sites — without locking you into a black-box CMS.",
    shortDescription:
      "Custom WordPress themes and headless setups for content-heavy brands that want speed, SEO and easy editing.",
    longDescription:
      "WordPress still powers a huge slice of the internet because nothing else makes editorial workflows as easy. We build it the way it should be built — fully custom themes, no bloated page-builders, server-side rendering for speed, and editorial blocks that authors actually want to use. Where the project benefits, we ship headless WordPress with a Next.js front-end for top-tier performance.",
    features: [
      "Custom theme development",
      "ACF / Gutenberg blocks",
      "Headless WordPress + Next.js",
      "Page-builder-free architecture",
      "Performance optimization (90+ Lighthouse)",
      "SEO-clean markup",
      "Editor training",
      "Hosting & DevOps setup",
    ],
    outcomes: [
      "Lighthouse 90+ across all pages",
      "Fast editorial publishing",
      "Future-proof, no plugin sprawl",
      "Easy migration off page-builders",
    ],
    faqs: [
      {
        question: "Why not just use Elementor or Divi?",
        answer:
          "Page-builders are great for prototyping, terrible for performance and maintenance. We build with the block editor or Gutenberg-native blocks so your site stays fast and your team can edit confidently without breaking layouts.",
      },
    ],
    detailContent: {
      heroEyebrow: "WordPress Studio",
      bestFitDescription:
        "Content-heavy brands, publishers and businesses that want easy editorial workflows.",
    },
    order: 10,
  },
  {
    slug: "ecommerce-development",
    title: "Ecommerce Web Development",
    shortTitle: "E-commerce",
    category: "web-design",
    icon: "ShoppingCart",
    tagline:
      "D2C storefronts built to convert — Shopify, custom, or headless, depending on what your catalog needs.",
    shortDescription:
      "Conversion-tuned e-commerce builds with a checkout, PDP and merchandising experience designed around your actual customer.",
    longDescription:
      "Most D2C sites underperform because the storefront templates were designed for a different brand and a different buyer. We rebuild the PDP, cart, and checkout around your product — variant logic, sizing flows, bundle UX, post-purchase upsells — and measure every change. Stack-wise we work with Shopify (most clients), WooCommerce, or fully headless when the catalog or merchandising needs it.",
    features: [
      "Shopify storefront builds",
      "Custom PDP & cart UX",
      "Headless commerce (Hydrogen / Next.js)",
      "Subscription & bundle setup",
      "Inventory & ERP integrations",
      "Conversion rate optimization",
      "Payments & tax compliance",
      "Post-purchase & email automation",
    ],
    outcomes: [
      "Higher conversion rate vs theme",
      "Cleaner merchandising flow",
      "Faster page load, less drop-off",
      "Scalable to 6-figure orders/month",
    ],
    faqs: [
      {
        question: "Shopify, WooCommerce or headless?",
        answer:
          "Shopify for ~80% of D2C clients — it ships fast, the ecosystem is mature, and merchants can run it themselves. We move to headless when the catalog gets very large or the brand needs a fully custom front-end experience.",
      },
    ],
    detailContent: {
      heroEyebrow: "Commerce Studio",
      bestFitDescription:
        "D2C brands with real SKUs, real inventory, and a serious conversion mandate.",
    },
    order: 11,
  },
  {
    slug: "dynamic-website",
    title: "Dynamic Website",
    shortTitle: "Dynamic Sites",
    category: "web-design",
    icon: "Layers3",
    tagline:
      "Database-driven sites with admin panels, member areas and content-managed experiences.",
    shortDescription:
      "Custom-coded dynamic sites with authenticated dashboards, gated content, member portals and admin CMS.",
    longDescription:
      "Some brands need more than a marketing site — they need a working application with logins, role-based access, custom dashboards and an admin panel only the team can see. We build these with Next.js, Node.js and your preferred database, designed for security, scale and maintainability long after launch.",
    features: [
      "Custom CMS dashboards",
      "Member portals & gated content",
      "Role-based authentication",
      "Database design & API layer",
      "Admin panel for the team",
      "Search, filters & pagination",
      "Real-time features (chat, notifications)",
      "Third-party integrations",
    ],
    outcomes: [
      "Operations that scale without spreadsheets",
      "Member experience your team can edit",
      "Internal admin without paid SaaS",
      "Custom features off-the-shelf can't ship",
    ],
    faqs: [
      {
        question: "When do we need dynamic vs static?",
        answer:
          "If non-developers need to edit content, gate access by user, or run anything user-specific (orders, bookings, members), you want dynamic. Pure marketing sites with infrequent updates are better served by static or hybrid setups.",
      },
    ],
    detailContent: {
      heroEyebrow: "Web App Studio",
      bestFitDescription:
        "Brands that need member portals, dashboards, or custom admin experiences alongside marketing pages.",
    },
    order: 12,
  },
  {
    slug: "static-website",
    title: "Static Website",
    shortTitle: "Static Sites",
    category: "web-design",
    icon: "FileCode",
    tagline:
      "Lightning-fast static sites for brands whose marketing site is its content strategy.",
    shortDescription:
      "Hand-built static sites with editorial polish, perfect Lighthouse scores and a developer-friendly stack.",
    longDescription:
      "For most agencies, founder-led brands and editorial sites, a static or hybrid site is the right answer — it loads instantly, never goes down, scores 100s on Lighthouse, and costs almost nothing to host. We build them with Next.js static export or Astro depending on the editorial needs, and integrate a headless CMS so non-developers can still publish.",
    features: [
      "Next.js / Astro builds",
      "Headless CMS integration",
      "Perfect Lighthouse scores",
      "Edge-cached, global delivery",
      "Content-driven page templates",
      "Form handling without a backend",
      "Image optimization at build",
      "SEO-clean, semantic markup",
    ],
    outcomes: [
      "Sub-second page load globally",
      "Near-zero hosting costs",
      "100/100 Lighthouse performance",
      "Press-grade reliability",
    ],
    faqs: [
      {
        question: "Can my team still edit a static site?",
        answer:
          "Yes — we wire it to a headless CMS (Sanity, Contentful, Notion, Strapi, etc.) so writers see a clean editor and changes deploy automatically. The static part is invisible to them.",
      },
    ],
    detailContent: {
      heroEyebrow: "Static Studio",
      bestFitDescription:
        "Editorial brands, agencies and content-led businesses that prize speed and reliability.",
    },
    order: 13,
  },
  {
    slug: "landing-page",
    title: "Landing Page Design",
    shortTitle: "Landing Pages",
    category: "web-design",
    icon: "MousePointer2",
    tagline:
      "Single-page conversion machines — for product launches, campaigns and high-intent traffic.",
    shortDescription:
      "Conversion-tuned landing pages with copy, design and analytics built around a single offer and a single audience.",
    longDescription:
      "A landing page is where attention becomes revenue, so we treat it as a single coherent argument — one offer, one audience, one CTA. We pair conversion copywriting, motion-tuned design and proper analytics so you can run the page as a controlled experiment, not a one-time asset. Most clients get a 1.5–3× lift over the page it replaces.",
    features: [
      "Conversion copywriting",
      "Single-page wireframe & design",
      "A/B testing infrastructure",
      "Heatmap & session recording setup",
      "Form & lead capture",
      "Performance optimization",
      "Mobile-first responsive build",
      "Post-launch iteration sprint",
    ],
    outcomes: [
      "Higher conversion vs current page",
      "Cleaner attribution to channel",
      "Faster campaign launches",
      "Repeatable template you own",
    ],
    faqs: [
      {
        question: "How fast can we ship one?",
        answer:
          "10–14 working days from kickoff to live URL for a single landing page — including copy, design, build and tracking setup. Faster if you have brand assets ready and copy approved.",
      },
    ],
    detailContent: {
      heroEyebrow: "Landing Studio",
      bestFitDescription:
        "Product launches, paid campaigns, and any high-intent traffic that deserves a dedicated page.",
    },
    order: 14,
  },
  {
    slug: "shopify",
    title: "Shopify Development",
    shortTitle: "Shopify",
    category: "web-design",
    icon: "ShoppingBag",
    tagline:
      "Custom Shopify storefronts for D2C brands that have outgrown the template look.",
    shortDescription:
      "Theme customization, Liquid development and Hydrogen builds for Shopify stores that want to look bespoke.",
    longDescription:
      "Shopify themes are great until you outgrow them — and most successful D2C brands outgrow them by year two. We build custom themes from scratch in Liquid, or move you to headless Hydrogen + Next.js when you need a fully bespoke front-end. App integrations, subscription setup, payment regions and inventory sync — all handled by a senior Shopify dev.",
    features: [
      "Custom theme from scratch",
      "Theme customization (existing)",
      "Hydrogen / headless builds",
      "Subscription apps (Recharge, etc.)",
      "App integrations & custom Liquid",
      "Shopify Plus features",
      "Checkout customization (Plus)",
      "Migration from other platforms",
    ],
    outcomes: [
      "Theme that looks bespoke",
      "Faster product page loads",
      "Custom features without 12 apps",
      "Smooth migration to Plus",
    ],
    faqs: [
      {
        question: "Do we need Shopify Plus for a custom build?",
        answer:
          "No. Custom themes work on regular Shopify. You only need Plus once you outgrow the API rate limits or need customised checkout — usually past ₹2-3 Cr annual revenue.",
      },
    ],
    detailContent: {
      heroEyebrow: "Shopify Studio",
      bestFitDescription:
        "D2C brands that want a Shopify store with a custom front-end, not a template skin.",
    },
    order: 15,
  },

  /* ====== GRAPHIC DESIGN ====== */
  {
    slug: "logo-designing",
    title: "Logo Designing",
    shortTitle: "Logos",
    category: "graphic-designing",
    icon: "Hexagon",
    tagline:
      "Logos that work at 16px in a favicon and 16ft on a billboard — drawn by humans, not AI.",
    shortDescription:
      "Custom logo and wordmark design with proper exploration, refinement and a usable asset library at delivery.",
    longDescription:
      "We treat logo design as the smallest part of a brand identity exercise — but we still take it seriously. Every engagement starts with strategic positioning, runs through 30+ explored directions, and narrows to two opposing concepts. The final logo lands with vector files, lockup variants, clear-space rules, color codes and a usage guide so your team can apply it without breaking it.",
    features: [
      "30+ initial explorations",
      "Two opposing creative routes",
      "Wordmark + monogram variants",
      "Lockups for vertical + horizontal use",
      "Clear-space + sizing rules",
      "Vector files (AI, SVG, EPS, PDF)",
      "Raster exports (PNG, JPG, favicon)",
      "Logo usage guidelines",
    ],
    outcomes: [
      "Distinctive mark in your category",
      "Works at every size & medium",
      "Asset library your team can use",
      "Foundation for a full identity",
    ],
    faqs: [
      {
        question: "Do we get unlimited revisions?",
        answer:
          "No, and you don't want them. Unlimited revisions usually means weak strategy upfront and a logo that pleases everyone but excites no one. We structure feedback in two rounds — one strategic, one craft — and the result is sharper for it.",
      },
    ],
    detailContent: {
      heroEyebrow: "Logo Studio",
      bestFitDescription:
        "Founders ready to commit to a real identity — not founders shopping for a $50 mark.",
    },
    order: 20,
  },
  {
    slug: "print-design",
    title: "Print Design",
    shortTitle: "Print",
    category: "graphic-designing",
    icon: "Printer",
    tagline:
      "Brochures, annual reports and print collateral with the production craft to feel premium in-hand.",
    shortDescription:
      "Editorial print design — brochures, reports, catalogues, lookbooks — built for premium tactile experience.",
    longDescription:
      "Print still beats digital for high-trust moments — investor decks, premium catalogs, store leave-behinds, conference handouts. We design print pieces with a typographic discipline most agencies have lost, and we manage the print production end-to-end: paper stock, finishes, foil, embossing, and color-matched delivery from the printer.",
    features: [
      "Annual reports & investor decks",
      "Brand brochures & lookbooks",
      "Product catalogues",
      "Editorial layouts",
      "Press-ready file prep (CMYK)",
      "Paper stock & finish consultation",
      "Print production coordination",
      "Bilingual / multi-language layouts",
    ],
    outcomes: [
      "Premium tactile experience",
      "Editorial-grade typography",
      "Print-ready files, zero rework",
      "Coordinated production handover",
    ],
    faqs: [
      {
        question: "Do you handle the printing too?",
        answer:
          "We don't print in-house, but we coordinate with our printer partners across India and abroad. You get a single point of contact from design through delivery.",
      },
    ],
    detailContent: {
      heroEyebrow: "Print Studio",
      bestFitDescription:
        "Brands where in-hand tactile pieces matter — premium catalogs, reports, and store collateral.",
    },
    order: 21,
  },
  {
    slug: "package-designing",
    title: "Package Designing",
    shortTitle: "Packaging",
    category: "graphic-designing",
    icon: "Package",
    tagline:
      "Packaging that earns shelf space and a second look — strategic, manufacturable, and shelf-ready.",
    shortDescription:
      "FMCG and D2C packaging design from concept through dieline, with retail-shelf and unboxing tested.",
    longDescription:
      "Great packaging works on three planes at once — it has to stand out on a shelf at 6 feet, communicate the proposition at 2 feet, and feel premium in hand at 6 inches. We design across all three, with proper dieline construction, manufacturer-ready files, and structural review with your packaging vendor before anything goes to print.",
    features: [
      "Pack strategy & positioning",
      "Hero face + multi-face design",
      "Dieline construction",
      "Mockup + photography for ads",
      "Multi-SKU systems",
      "Regulatory + nutritional layouts",
      "Vendor & printer coordination",
      "Sustainability-led options",
    ],
    outcomes: [
      "Distinctive shelf presence",
      "Repeatable multi-SKU system",
      "Manufacturer-ready files",
      "Higher pickup rate at retail",
    ],
    faqs: [
      {
        question: "Do you work with our packaging vendor?",
        answer:
          "Yes — we coordinate dielines, color systems and proofs with your existing vendor, or recommend partners we trust if you don't have one.",
      },
    ],
    detailContent: {
      heroEyebrow: "Packaging Studio",
      bestFitDescription:
        "FMCG, D2C and gift-box brands that need packaging designed for retail and unboxing.",
    },
    order: 22,
  },
  {
    slug: "corporate-designing",
    title: "Corporate Designing",
    shortTitle: "Corporate Design",
    category: "graphic-designing",
    icon: "Building2",
    tagline:
      "Corporate identity, stationery and internal collateral that make a serious company look serious.",
    shortDescription:
      "Letterheads, business cards, presentations, signage and corporate collateral designed as one coherent system.",
    longDescription:
      "Corporate design is the brand expressed at every touchpoint where the company shows up as a company — letterheads, decks, stationery, signage, RFP responses, ID cards. Done right it builds quiet credibility in every meeting. We treat it as a system, not a series of one-off files, so anything new the team needs can be built on the same grid.",
    features: [
      "Letterhead & envelope design",
      "Business cards & ID cards",
      "Corporate presentation templates",
      "RFP / proposal templates",
      "Internal documentation system",
      "Signage & wayfinding",
      "Email signature design",
      "Brand assets for office",
    ],
    outcomes: [
      "Coherent corporate presence",
      "Faster proposal turnaround",
      "On-brand internal collateral",
      "Templates your team actually use",
    ],
    faqs: [
      {
        question: "Do you do PowerPoint or only Keynote?",
        answer:
          "Both — and Google Slides if your team uses it. The template is delivered in the format your team works in, with real master slides, not pasted images.",
      },
    ],
    detailContent: {
      heroEyebrow: "Corporate Studio",
      bestFitDescription:
        "B2B and professional-services brands that meet clients face-to-face.",
    },
    order: 23,
  },
  {
    slug: "social-media-posters",
    title: "Social Media Posters",
    shortTitle: "Social Posters",
    category: "graphic-designing",
    icon: "Image",
    tagline:
      "Static and motion creative for social feeds — designed for the scroll, not the gallery.",
    shortDescription:
      "Monthly social creative batches — posters, carousels, story templates — built around your editorial pillars.",
    longDescription:
      "Most agencies design social creative like reduced-down print ads. The result is something that looks fine in a portfolio and dies in a feed. We design for the scroll: stronger contrast, bigger type, motion-friendly layouts, and templates a in-house team can extend without ruining the brand. Carousels, posters, story templates and motion-ready assets shipped on a monthly rhythm.",
    features: [
      "Editorial pillars + monthly themes",
      "Carousel templates",
      "Static poster series",
      "Story / Reels templates",
      "Motion-ready exports",
      "Bilingual variants",
      "Asset organization by use",
      "Editor-friendly source files",
    ],
    outcomes: [
      "Distinct feed presence",
      "Faster monthly turnaround",
      "Templates internal teams can extend",
      "Better save + share ratios",
    ],
    faqs: [
      {
        question: "How many posts per month?",
        answer:
          "Typical engagements ship 16–24 pieces per month across formats. We scope it based on your channel mix and posting cadence.",
      },
    ],
    detailContent: {
      heroEyebrow: "Social Creative",
      bestFitDescription:
        "Brands with an active social calendar that need consistent, on-brand creative volume.",
    },
    order: 24,
  },
  {
    slug: "banner-designing",
    title: "Banner Designing",
    shortTitle: "Banners",
    category: "graphic-designing",
    icon: "Layout",
    tagline:
      "Outdoor banners, hoardings and large-format ads designed to stop traffic — literally.",
    shortDescription:
      "Outdoor, indoor, event and digital banner design with the visual hierarchy big-format requires.",
    longDescription:
      "Banner design is its own discipline — at a 16-foot hoarding you have one second of attention and one idea to land. We design for that constraint: one image, one headline, one CTA, with the visual hierarchy and resolution that big-format printing demands. Production files are press-ready, color-matched and prepared for the specific medium.",
    features: [
      "Outdoor hoardings & flex",
      "Event backdrops & standees",
      "Mall and retail banners",
      "Digital banners (display ads)",
      "Vehicle wraps",
      "Trade-show graphics",
      "Production-ready file prep",
      "Color-match supervision",
    ],
    outcomes: [
      "One-idea, high-impact creative",
      "Production-ready specs",
      "Color-accurate output",
      "Multi-format adaptation",
    ],
    faqs: [
      {
        question: "Do you cover both print and digital banners?",
        answer:
          "Yes — same design system adapted across both. Press-ready CMYK for print, optimized RGB for digital display, with the right resolution and aspect ratios for each placement.",
      },
    ],
    detailContent: {
      heroEyebrow: "Banner Studio",
      bestFitDescription:
        "Brands running outdoor campaigns, events, or large-format retail visibility.",
    },
    order: 25,
  },
];

/* Round-robin assign dummy images. */
function withImage(s, idx) {
  return { ...s, image: DUMMY_IMAGES[idx % DUMMY_IMAGES.length] };
}

async function run() {
  await connectToDatabase();
  console.log(`Seeding ${SERVICES.length} services…`);

  let created = 0;
  let updated = 0;

  for (let i = 0; i < SERVICES.length; i++) {
    const payload = {
      ...withImage(SERVICES[i], i),
      process: STANDARD_PROCESS,
      isActive: true,
    };

    const before = await Service.findOne({ slug: payload.slug });
    await Service.upsertByField("slug", payload.slug, payload);
    if (before) {
      updated++;
      console.log(`  · updated: ${payload.slug}`);
    } else {
      created++;
      console.log(`  + created: ${payload.slug}`);
    }
  }

  console.log(
    `\nDone. ${created} created · ${updated} updated · ${SERVICES.length} total.`
  );
  process.exit(0);
}

run().catch((err) => {
  console.error("seed-services-content failed:", err);
  process.exit(1);
});
