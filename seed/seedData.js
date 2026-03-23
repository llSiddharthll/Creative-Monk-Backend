const legacyDb = require("../data/db.json");

function cleanText(value = "") {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function makeSeo({ title, description, canonical, keywords = [], ogImage = "" }) {
  return {
    title,
    description,
    canonical,
    keywords,
    ogImage,
  };
}

const companyPhone = "+91 94634 45566";
const companyPhoneRaw = "+919463445566";
const companyEmail = "info@thecreativemonk.in";
const companyAddress =
  "Office No.11-12, 9th floor, Sushma Infinium, Zirakpur, Punjab, 140603";

const siteSettings = {
  singletonKey: "main-site-settings",
  companyName: "Creative Monk",
  legalName: "The Creative Monk",
  tagline: "Helping Businesses Grow Digitally",
  description:
    "Creative Monk is a digital marketing agency in Zirakpur helping growing brands win through websites, SEO, paid media, design systems, and content that converts.",
  website: "https://thecreativemonk.in",
  phone: companyPhone,
  phoneRaw: companyPhoneRaw,
  email: companyEmail,
  workingHours: "Mon - Sat: 9AM - 6PM",
  yearFounded: 2019,
  address: {
    line1: "Office No.11-12, 9th floor",
    line2: "Sushma Infinium",
    city: "Zirakpur",
    state: "Punjab",
    pincode: "140603",
    country: "India",
    full: companyAddress,
    mapsUrl: "https://g.page/creativemonk?we",
  },
  social: {
    facebook: "https://www.facebook.com/creativemonkindia",
    instagram: "https://www.instagram.com/creativemonkindia",
    youtube: "https://www.youtube.com/@creativemonkindia",
    linkedin: "https://www.linkedin.com/company/creativemonkindia",
    whatsapp: "https://wa.me/919463445566",
  },
  hero: {
    eyebrow: "Digital Growth Partner for Ambitious Brands",
    title: "Launch Better Campaigns. Build Better Websites.",
    highlight: "Grow Smarter",
    description:
      "We help service businesses, local brands, ecommerce teams, and founders turn scattered digital efforts into a consistent growth engine across web, search, paid media, and creative.",
    primaryCtaLabel: "Get a Proposal",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "View Case Studies",
    secondaryCtaHref: "/case-studies",
    trustPoints: [
      "Web Design & Development",
      "SEO and Performance Marketing",
      "Branding and Visual Creative",
    ],
  },
  stats: [
    { label: "Projects Delivered", value: "180+" },
    { label: "Clients Supported", value: "250+" },
    { label: "Years of Experience", value: "5+" },
    { label: "Industries Served", value: "15+" },
  ],
  aboutHeadline: "A practical, creative agency built for real business growth.",
  aboutDescription:
    "Creative Monk blends strategy, design, and execution so brands can grow with clarity instead of guesswork.",
  aboutStory: [
    "We started with a simple belief: digital marketing should feel accountable, well-designed, and commercially useful.",
    "Today we work across websites, SEO, paid campaigns, social media, branding, and content systems that help businesses build momentum instead of chasing random tactics.",
  ],
  whyChooseUs: [
    "Business-first strategy with measurable goals",
    "Conversion-focused design and development",
    "Transparent reporting and hands-on communication",
    "In-house capability across web, media, SEO, and design",
    "Fast response times and long-term support",
    "Clear processes that reduce delays and rework",
  ],
  values: [
    {
      title: "Clarity",
      description: "We make strategy understandable and execution visible.",
    },
    {
      title: "Craft",
      description: "We sweat the details because trust is built in the small things.",
    },
    {
      title: "Performance",
      description: "Creative work only matters when it moves the business forward.",
    },
  ],
  footerLinks: {
    company: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/career" },
      { label: "Contact", href: "/contact" },
    ],
    services: [
      { label: "WordPress Development", href: "/services/wordpress-development" },
      { label: "Ecommerce Development", href: "/services/ecommerce-development" },
      { label: "SEO", href: "/services/seo" },
      { label: "Social Media Marketing", href: "/services/social-media-marketing" },
      { label: "PPC", href: "/services/ppc" },
      { label: "Logo Designing", href: "/services/logo-designing" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
  seoDefaults: makeSeo({
    title: "Top Digital Marketing Agency in Chandigarh | Creative Monk",
    description:
      "Creative Monk helps brands grow with websites, SEO, performance marketing, graphic design, and content systems tailored for measurable ROI.",
    canonical: "https://thecreativemonk.in",
    keywords: [
      "digital marketing agency in Chandigarh",
      "web development company in Zirakpur",
      "SEO company in Chandigarh",
      "social media marketing agency in Punjab",
      "Creative Monk",
    ],
    ogImage: "https://thecreativemonk.in/logo.webp",
  }),
  sectionToggles: {
    showClients: true,
    showServices: true,
    showCaseStudies: true,
    showTestimonials: true,
    showBlogs: true,
    showFaqs: true,
  },
};

const serviceCategories = [
  {
    title: "Website Designing & Development",
    slug: "web-design",
    description:
      "Responsive websites, landing pages, ecommerce builds, and CMS experiences designed to convert and scale.",
    icon: "Globe",
    order: 1,
    isActive: true,
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "SEO, paid media, social media, local visibility, and CRO designed to turn traffic into pipeline.",
    icon: "BarChart3",
    order: 2,
    isActive: true,
  },
  {
    title: "Graphic Designing",
    slug: "graphic-designing",
    description:
      "Brand systems, packaging, campaign creatives, and visual assets that make your brand feel sharper and more credible.",
    icon: "Palette",
    order: 3,
    isActive: true,
  },
];

const categoryLookup = {
  "wordpress-development": "web-design",
  "ecommerce-development": "web-design",
  "static-website": "web-design",
  "dynamic-website": "web-design",
  "landing-page": "web-design",
  shopify: "web-design",
  seo: "digital-marketing",
  "social-media-marketing": "digital-marketing",
  sem: "digital-marketing",
  ppc: "digital-marketing",
  "local-business-marketing": "digital-marketing",
  "lead-generation": "digital-marketing",
  cro: "digital-marketing",
  "social-media-management": "digital-marketing",
  "logo-designing": "graphic-designing",
  "package-designing": "graphic-designing",
  "corporate-designing": "graphic-designing",
  "social-media-posters": "graphic-designing",
  "banner-designing": "graphic-designing",
};

const services = legacyDb.services.map((service, index) => ({
  slug: service.slug,
  title: service.title,
  shortTitle: service.shortTitle || service.title,
  tagline: cleanText(service.tagline || service.title),
  shortDescription: cleanText(service.description || service.longDescription).slice(0, 220),
  longDescription: cleanText(service.longDescription || service.description),
  category: categoryLookup[service.slug] || "web-design",
  icon: service.icon || "Sparkles",
  image: service.image || "",
  features: service.features || [],
  process: service.process || [],
  outcomes: service.outcomes || [],
  faqs: service.faqs || [],
  seo: makeSeo({
    title: `${service.title} | Creative Monk`,
    description: cleanText(service.description || service.longDescription).slice(0, 160),
    canonical: `https://thecreativemonk.in/services/${service.slug}`,
    keywords: [service.title, "Creative Monk", "digital marketing agency"],
    ogImage: service.image || "https://thecreativemonk.in/logo.webp",
  }),
  order: index + 1,
  isFeatured: index < 6,
  isActive: true,
}));

const caseStudies = legacyDb.portfolio.map((item, index) => ({
  id: item.id,
  title: item.title,
  client: item.client || item.title,
  category: item.category,
  description: item.description,
  content: `We partnered with ${item.client || item.title} to refresh its digital presence and create a stronger foundation for lead generation, credibility, and long-term brand growth. The brief required a clearer narrative, better visual hierarchy, and a more conversion-focused experience across desktop and mobile touchpoints.`,
  services: item.tags || [],
  challenges: [
    "The brand needed a clearer market position and a more cohesive digital presentation.",
    "Existing customer journeys were not translating attention into enquiries efficiently.",
    "The visual system needed to feel more premium, current, and trustworthy.",
  ],
  solutions: [
    "Created a cleaner information architecture and focused messaging hierarchy.",
    "Reworked layout, visual assets, and interaction patterns to improve clarity on mobile and desktop.",
    "Added stronger proof points, clearer service framing, and sharper conversion pathways.",
  ],
  results: [
    "Improved brand perception with a more cohesive and modern customer-facing experience.",
    "Made the offer easier to understand for first-time visitors and referral traffic.",
    "Delivered a reusable foundation for future marketing campaigns and content updates.",
  ],
  metrics: [
    { label: "Project Type", value: item.category },
    { label: "Primary Focus", value: (item.tags || [])[0] || "Growth" },
    { label: "Delivery Model", value: "Strategy + Creative + Execution" },
  ],
  gallery: [item.image],
  testimonial: {
    text: `Creative Monk helped us sharpen both the story and the execution. The final output felt more strategic, more polished, and much easier for our audience to understand.`,
    author: item.client || item.title,
    role: "Client Team",
  },
  link: item.url || "",
  duration: index % 2 === 0 ? "4 weeks" : "6 weeks",
  image: item.image,
  seo: makeSeo({
    title: `${item.title} Case Study | Creative Monk`,
    description: item.description,
    canonical: `https://thecreativemonk.in/case-studies/${item.id}`,
    keywords: [item.title, item.category, "case study"],
    ogImage: item.image,
  }),
  order: index + 1,
  isFeatured: index < 4,
  isActive: item.active !== false,
}));

const clients = legacyDb.clients.map((client, index) => ({
  name: client.name,
  website: client.site || "",
  logo: client.logoUrl || "",
  status: client.status || "active",
  order: index + 1,
  isFeatured: index < 12,
}));

const testimonials = legacyDb.testimonials.map((testimonial, index) => ({
  name: testimonial.name,
  role: testimonial.role,
  company: testimonial.company,
  text: cleanText(testimonial.text),
  rating: testimonial.rating || 5,
  avatar: testimonial.avatar || testimonial.name,
  order: index + 1,
  isFeatured: index < 3,
  isActive: testimonial.active !== false,
}));

const blogs = [
  {
    slug: "seo-and-ai-how-ai-can-improve-your-ranking",
    title: "SEO and AI: How AI Can Improve Your Rankings",
    excerpt:
      "AI is changing SEO workflows, but the real advantage still comes from strong strategy, cleaner content systems, and better user intent coverage.",
    content:
      "AI can help teams move faster across research, clustering, drafting, and content optimization. The brands seeing the best results are not handing the full process to automation. They use AI to speed up repetitive work, then layer in editorial judgment, subject-matter expertise, and stronger internal linking. That combination produces content that is easier to publish, easier to update, and more likely to rank over time.\n\nAt Creative Monk, we treat AI as an accelerator rather than a replacement for strategy. Keyword research becomes sharper when supported by search intent mapping. Content briefs become stronger when they include topical depth, conversion opportunities, and realistic business goals. When AI is used this way, it can support faster output without turning the site into generic noise.",
    coverImage:
      "https://thecreativemonk.in/wp-content/uploads/2022/05/WhatsApp-Image-2022-05-19-at-8.07.07-PM-1.jpeg",
    category: "SEO",
    tags: ["SEO", "AI", "Content Strategy"],
    author: "Creative Monk Team",
    publishedAt: "2022-06-17T06:32:11.000Z",
    readTime: "6 min read",
    featured: true,
    isPublished: true,
    seo: makeSeo({
      title: "SEO and AI: How AI Can Improve Your Rankings | Creative Monk",
      description:
        "A practical look at where AI supports SEO performance and where human strategy still matters most.",
      canonical:
        "https://thecreativemonk.in/blog/seo-and-ai-how-ai-can-improve-your-ranking",
      keywords: ["SEO and AI", "AI SEO", "ranking strategy"],
      ogImage:
        "https://thecreativemonk.in/wp-content/uploads/2022/05/WhatsApp-Image-2022-05-19-at-8.07.07-PM-1.jpeg",
    }),
  },
  {
    slug: "digital-marketing-strategies-for-real-estates-2022",
    title: "Digital Marketing Strategies for Real Estate Brands",
    excerpt:
      "Real estate buyers need trust, clarity, and repeated touchpoints. Your marketing system should support all three.",
    content:
      "Real estate marketing works best when performance campaigns, local SEO, landing pages, and remarketing are treated as one connected funnel. Buyers rarely convert on the first interaction. They compare projects, search locations repeatedly, and need reassurance at every step. That makes message consistency and follow-up speed just as important as reach.\n\nFor real estate clients, we focus on high-intent landing pages, strong geography-led keyword targeting, and campaign creative built around proof, urgency, and lead quality. The goal is not just volume. It is a steady flow of the right conversations.",
    coverImage: "https://thecreativemonk.in/wp-content/uploads/2022/02/ad.png",
    category: "Digital Marketing",
    tags: ["Real Estate", "Lead Generation", "Performance Marketing"],
    author: "Creative Monk Team",
    publishedAt: "2023-03-23T07:36:52.000Z",
    readTime: "7 min read",
    featured: false,
    isPublished: true,
    seo: makeSeo({
      title: "Digital Marketing Strategies for Real Estate Brands | Creative Monk",
      description:
        "How real estate brands can combine landing pages, paid media, SEO, and follow-up systems to improve lead quality.",
      canonical:
        "https://thecreativemonk.in/blog/digital-marketing-strategies-for-real-estates-2022",
      keywords: ["real estate digital marketing", "property lead generation"],
      ogImage: "https://thecreativemonk.in/wp-content/uploads/2022/02/ad.png",
    }),
  },
  {
    slug: "what-is-e-commerce-and-how-can-it-help-grow-your-business",
    title: "How Ecommerce Can Help Grow Your Business",
    excerpt:
      "Ecommerce is no longer just an expansion channel. For many brands, it is the center of the revenue engine.",
    content:
      "A strong ecommerce setup creates leverage across sales, marketing, operations, and customer retention. It lets brands package offers clearly, reduce friction in the buying journey, and measure exactly where demand is coming from. But an online store only performs when the product structure, messaging, checkout flow, and traffic strategy are aligned.\n\nWe approach ecommerce as both a storefront and a growth system. That means clearer product presentation, better mobile experience, trust-building assets, and acquisition channels that support repeatable growth instead of one-off spikes.",
    coverImage:
      "https://thecreativemonk.in/wp-content/uploads/2022/03/WhatsApp-Image-2022-03-10-at-11.09.38-AM-1.jpeg",
    category: "Web Development",
    tags: ["Ecommerce", "Shopify", "Conversion"],
    author: "Creative Monk Team",
    publishedAt: "2023-03-23T08:19:33.000Z",
    readTime: "6 min read",
    featured: false,
    isPublished: true,
    seo: makeSeo({
      title: "How Ecommerce Can Help Grow Your Business | Creative Monk",
      description:
        "Why ecommerce growth depends on more than launching a store, and what makes the channel actually perform.",
      canonical:
        "https://thecreativemonk.in/blog/what-is-e-commerce-and-how-can-it-help-grow-your-business",
      keywords: ["ecommerce growth", "online store strategy"],
      ogImage:
        "https://thecreativemonk.in/wp-content/uploads/2022/03/WhatsApp-Image-2022-03-10-at-11.09.38-AM-1.jpeg",
    }),
  },
  {
    slug: "content-marketing-strategy-defining-the-future-of-your-business",
    title: "Content Marketing Strategy and the Future of Your Business",
    excerpt:
      "Content works best when it is tied to business intent, not just publishing frequency.",
    content:
      "Content marketing is often misunderstood as a volume game. In reality, the most effective programs are built around clear commercial goals, category education, and distribution. A useful article is only valuable if it reaches the right audience and supports the next step in the customer journey.\n\nFor service brands, content should make the offer easier to trust. For ecommerce brands, it should answer objections and improve discoverability. For local businesses, it should create relevance and authority in the markets they want to own. Strategy matters because content without direction is expensive noise.",
    coverImage:
      "https://thecreativemonk.in/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-14-at-4.15.33-PM-1.jpeg",
    category: "Content Marketing",
    tags: ["Content Marketing", "SEO", "Brand Strategy"],
    author: "Creative Monk Team",
    publishedAt: "2023-03-23T09:49:01.000Z",
    readTime: "5 min read",
    featured: false,
    isPublished: true,
    seo: makeSeo({
      title: "Content Marketing Strategy for Business Growth | Creative Monk",
      description:
        "A sharper look at how content strategy supports SEO, authority, and conversion across business stages.",
      canonical:
        "https://thecreativemonk.in/blog/content-marketing-strategy-defining-the-future-of-your-business",
      keywords: ["content marketing strategy", "business growth content"],
      ogImage:
        "https://thecreativemonk.in/wp-content/uploads/2022/04/WhatsApp-Image-2022-04-14-at-4.15.33-PM-1.jpeg",
    }),
  },
  {
    slug: "the-importance-of-web-design-in-your-digital-marketing-plan",
    title: "The Importance of Web Design in Your Digital Marketing Plan",
    excerpt:
      "Design is not a finishing touch. It shapes how clearly your offer is understood and how confidently users act.",
    content:
      "Your website is often the place where paid traffic, SEO traffic, referrals, and social traffic finally decide whether your business feels credible. That means web design is part of marketing performance, not separate from it. If the page hierarchy is confusing, the mobile experience feels clumsy, or the proof points are weak, campaign spend gets wasted.\n\nStrong web design improves message clarity, makes the next action obvious, and helps every acquisition channel perform better. A better layout can lower bounce, improve trust, and make every enquiry path easier to use.",
    coverImage:
      "https://thecreativemonk.in/wp-content/uploads/2022/05/WhatsApp-Image-2022-05-23-at-9.35.53-PM-2.jpg",
    category: "Web Design",
    tags: ["Web Design", "UX", "Conversion Rate"],
    author: "Creative Monk Team",
    publishedAt: "2023-03-24T05:25:56.000Z",
    readTime: "6 min read",
    featured: false,
    isPublished: true,
    seo: makeSeo({
      title: "Why Web Design Matters in Digital Marketing | Creative Monk",
      description:
        "How better UX and visual hierarchy improve campaign efficiency, trust, and lead conversion.",
      canonical:
        "https://thecreativemonk.in/blog/the-importance-of-web-design-in-your-digital-marketing-plan",
      keywords: ["web design and marketing", "conversion design"],
      ogImage:
        "https://thecreativemonk.in/wp-content/uploads/2022/05/WhatsApp-Image-2022-05-23-at-9.35.53-PM-2.jpg",
    }),
  },
  {
    slug: "top-6-ppc-strategies-your-business-needs-to-try-in-2022",
    title: "PPC Strategies Your Business Still Needs to Get Right",
    excerpt:
      "Paid media performs when intent, landing page quality, and offer clarity are aligned from click to conversion.",
    content:
      "The strongest PPC accounts are rarely the ones with the biggest budgets. They are the ones with clear audience segmentation, sharp creative, relevant landing pages, and disciplined optimisation. Businesses often overspend because they send every click to a generic page or chase traffic that is not ready to buy.\n\nWe focus on tighter keyword targeting, stronger offer framing, better landing page alignment, and cleaner conversion tracking. That creates more efficient spend and gives the business a clearer picture of where growth is actually coming from.",
    coverImage:
      "https://thecreativemonk.in/wp-content/uploads/2022/01/WhatsApp-Image-2022-01-28-at-2.14.40-PM.jpeg",
    category: "PPC",
    tags: ["PPC", "Google Ads", "Lead Generation"],
    author: "Creative Monk Team",
    publishedAt: "2023-03-24T12:22:07.000Z",
    readTime: "5 min read",
    featured: false,
    isPublished: true,
    seo: makeSeo({
      title: "PPC Strategies for Better Campaign Performance | Creative Monk",
      description:
        "A practical guide to stronger targeting, landing page alignment, and more efficient paid media performance.",
      canonical:
        "https://thecreativemonk.in/blog/top-6-ppc-strategies-your-business-needs-to-try-in-2022",
      keywords: ["PPC strategies", "Google Ads performance"],
      ogImage:
        "https://thecreativemonk.in/wp-content/uploads/2022/01/WhatsApp-Image-2022-01-28-at-2.14.40-PM.jpeg",
    }),
  },
];

const faqs = [
  {
    question: "What services does Creative Monk offer?",
    answer:
      "We offer web design and development, SEO, paid media, social media marketing, branding, packaging, campaign creative, and content systems for growth-focused businesses.",
    page: "home",
    order: 1,
    isActive: true,
  },
  {
    question: "Where is Creative Monk located?",
    answer:
      "Our office is in Zirakpur, Punjab, near Chandigarh. We work with clients across India and support remote collaborations for national and international brands.",
    page: "home",
    order: 2,
    isActive: true,
  },
  {
    question: "Do you work only on websites, or do you handle marketing too?",
    answer:
      "We do both. Many clients work with us across web design, SEO, paid media, social campaigns, landing pages, and ongoing creative support.",
    page: "home",
    order: 3,
    isActive: true,
  },
  {
    question: "How long does a typical website project take?",
    answer:
      "Most marketing websites take between 3 and 6 weeks depending on content readiness, review cycles, and integrations. Ecommerce and larger dynamic builds can take longer.",
    page: "services",
    order: 1,
    isActive: true,
  },
  {
    question: "Can you manage our website and digital marketing together?",
    answer:
      "Yes. We often manage the website foundation and the acquisition channels around it so messaging, landing pages, SEO, and paid campaigns work as one system.",
    page: "services",
    order: 2,
    isActive: true,
  },
  {
    question: "How quickly do you respond to new enquiries?",
    answer:
      "We usually respond within the same business day. If the brief is clear, we can often move directly into a discovery call and proposal discussion.",
    page: "contact",
    order: 1,
    isActive: true,
  },
];

const team = [
  {
    name: "Sahil Sehgal",
    role: "Founder & CEO",
    bio: "Leads strategy, growth conversations, and long-term client partnerships across the agency.",
    image: "",
    social: {
      linkedin: "https://www.linkedin.com/in/sahil-sehgal-4a6573134/",
      instagram: "https://www.instagram.com/creativemonkindia",
    },
    order: 1,
    isActive: true,
  },
  {
    name: "Siddharth Tiwari",
    role: "Lead Developer",
    bio: "Builds modern websites, scalable frontend systems, and technical experiences that balance speed with maintainability.",
    image: "",
    social: {
      linkedin: "https://www.linkedin.com/in/siddharth-tiwari-5011b6393/",
    },
    order: 2,
    isActive: true,
  },
  {
    name: "Rajwant Maurya",
    role: "Digital Marketing Expert",
    bio: "Focuses on organic growth, technical SEO, and campaign structures that improve visibility and lead quality.",
    image: "",
    social: {
      linkedin: "https://www.linkedin.com/in/moryarajwant/",
    },
    order: 3,
    isActive: true,
  },
  {
    name: "Karandeep Singh",
    role: "Creative Professional",
    bio: "Shapes brand direction, campaign assets, and visual storytelling across digital touchpoints.",
    image: "",
    social: {
      linkedin: "https://www.linkedin.com/in/karandeep-singh-263765372/",
    },
    order: 4,
    isActive: true,
  },
];

const careers = [
  {
    title: "SEO Executive",
    department: "Digital Marketing",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-3 years",
    description:
      "Own keyword research, on-page optimisation, link building coordination, and monthly reporting across client projects.",
    skills: ["SEO audits", "On-page SEO", "Google Search Console", "Reporting"],
    applyEmail: companyEmail,
    isActive: true,
    order: 1,
  },
  {
    title: "Social Media Manager",
    department: "Digital Marketing",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-2 years",
    description:
      "Plan content calendars, manage publishing workflows, and improve engagement across client social channels.",
    skills: ["Content planning", "Community management", "Analytics"],
    applyEmail: companyEmail,
    isActive: true,
    order: 2,
  },
  {
    title: "WordPress Developer",
    department: "Web Development",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "1-3 years",
    description:
      "Build and maintain custom WordPress sites with an emphasis on performance, UX, and CMS usability.",
    skills: ["WordPress", "PHP", "HTML/CSS", "Responsive development"],
    applyEmail: companyEmail,
    isActive: true,
    order: 3,
  },
  {
    title: "Graphic Designer",
    department: "Design",
    type: "Full-Time",
    location: "Zirakpur, Punjab",
    experience: "0-2 years",
    description:
      "Create brand assets, packaging, campaign creatives, and social-first visuals for agency clients.",
    skills: ["Brand design", "Adobe Creative Suite", "Social creatives"],
    applyEmail: companyEmail,
    isActive: true,
    order: 4,
  },
];

const financeRecords = [
  {
    label: "Jan 2026",
    periodKey: "2026-01",
    currency: "INR",
    revenue: 960000,
    expenses: 685000,
    adSpend: 240000,
    payroll: 255000,
    toolsCost: 42000,
    outstandingInvoices: 95000,
    cashInHand: 310000,
    status: "closed",
    isActive: true,
  },
  {
    label: "Feb 2026",
    periodKey: "2026-02",
    currency: "INR",
    revenue: 1085000,
    expenses: 742000,
    adSpend: 268000,
    payroll: 261000,
    toolsCost: 45000,
    outstandingInvoices: 104000,
    cashInHand: 342000,
    status: "closed",
    isActive: true,
  },
  {
    label: "Mar 2026",
    periodKey: "2026-03",
    currency: "INR",
    revenue: 1210000,
    expenses: 801000,
    adSpend: 295000,
    payroll: 270000,
    toolsCost: 47000,
    outstandingInvoices: 128000,
    cashInHand: 396000,
    status: "actual",
    isActive: true,
  },
  {
    label: "Apr 2026",
    periodKey: "2026-04",
    currency: "INR",
    revenue: 1320000,
    expenses: 872000,
    adSpend: 318000,
    payroll: 284000,
    toolsCost: 48000,
    outstandingInvoices: 116000,
    cashInHand: 428000,
    status: "forecast",
    isActive: true,
  },
];

const employees = [
  {
    name: "Rajwant Maurya",
    role: "SEO Strategist",
    department: "SEO",
    email: "rajwant@thecreativemonk.in",
    status: "active",
    employmentType: "full-time",
    monthlySalary: 52000,
    utilizationPct: 84,
    ownerLevel: "lead",
    joinedAt: "2023-04-12T00:00:00.000Z",
    assignedClients: ["GreenLeaf Organics", "Luxe Cosmetics", "Monk Cafe"],
    primarySkills: ["Technical SEO", "Content briefs", "Search Console"],
    goals: ["Grow non-brand traffic", "Improve local visibility"],
    order: 1,
    isActive: true,
  },
  {
    name: "Siddharth Tiwari",
    role: "Lead Developer",
    department: "Web",
    email: "siddharth@thecreativemonk.in",
    status: "active",
    employmentType: "full-time",
    monthlySalary: 68000,
    utilizationPct: 78,
    ownerLevel: "lead",
    joinedAt: "2022-08-04T00:00:00.000Z",
    assignedClients: ["TechStart Solutions", "BuildRight Construction"],
    primarySkills: ["Next.js", "CMS systems", "Performance"],
    goals: ["Speed up launches", "Reduce bug backlog"],
    order: 2,
    isActive: true,
  },
  {
    name: "Karandeep Singh",
    role: "Creative Designer",
    department: "Design",
    email: "karandeep@thecreativemonk.in",
    status: "active",
    employmentType: "full-time",
    monthlySalary: 47000,
    utilizationPct: 88,
    ownerLevel: "member",
    joinedAt: "2024-01-18T00:00:00.000Z",
    assignedClients: ["FashionForward", "Luxe Cosmetics", "Monk Cafe"],
    primarySkills: ["Brand design", "Campaign creative", "Social assets"],
    goals: ["Raise creative output consistency"],
    order: 3,
    isActive: true,
  },
  {
    name: "Niharika Bansal",
    role: "Account Manager",
    department: "Client Success",
    email: "niharika@thecreativemonk.in",
    status: "active",
    employmentType: "full-time",
    monthlySalary: 54000,
    utilizationPct: 72,
    ownerLevel: "executive",
    joinedAt: "2023-11-10T00:00:00.000Z",
    assignedClients: ["Velocity Interiors", "GreenLeaf Organics", "NorthStar Dental"],
    primarySkills: ["Client communication", "Review planning", "Retention"],
    goals: ["Reduce review delays", "Increase upsell visibility"],
    order: 4,
    isActive: true,
  },
  {
    name: "Arjun Mehta",
    role: "Performance Marketer",
    department: "Paid Media",
    email: "arjun@thecreativemonk.in",
    status: "active",
    employmentType: "full-time",
    monthlySalary: 61000,
    utilizationPct: 91,
    ownerLevel: "member",
    joinedAt: "2022-12-07T00:00:00.000Z",
    assignedClients: ["TechStart Solutions", "Velocity Interiors", "NorthStar Dental"],
    primarySkills: ["Meta Ads", "Google Ads", "CPL optimization"],
    goals: ["Improve lead quality", "Lower blended CPL"],
    order: 5,
    isActive: true,
  },
];

const agencyClients = [
  {
    name: "TechStart Solutions",
    website: "https://techstart.example.com",
    primaryContact: "Aman Khurana",
    contactEmail: "aman@techstart.example.com",
    contactPhone: "+91 98100 11223",
    owner: "Sahil Sehgal",
    status: "retainer",
    monthlyRetainer: 145000,
    projectHealth: "green",
    seoScore: 82,
    socialScore: 74,
    websiteScore: 86,
    nextReviewDate: "2026-03-30T00:00:00.000Z",
    services: ["SEO", "Website CRO", "Performance Marketing"],
    websitesManaged: ["https://techstart.example.com"],
    priorityGoals: ["Demo bookings", "Organic growth", "Landing page refresh"],
    hasCmsAccess: true,
    order: 1,
    isActive: true,
  },
  {
    name: "GreenLeaf Organics",
    website: "https://greenleaf.example.com",
    primaryContact: "Neha Arora",
    contactEmail: "neha@greenleaf.example.com",
    contactPhone: "+91 98760 33221",
    owner: "Rajwant Maurya",
    status: "active",
    monthlyRetainer: 92000,
    projectHealth: "amber",
    seoScore: 77,
    socialScore: 71,
    websiteScore: 80,
    nextReviewDate: "2026-04-04T00:00:00.000Z",
    services: ["SEO", "Content Marketing", "Meta Ads"],
    websitesManaged: ["https://greenleaf.example.com", "https://shop.greenleaf.example.com"],
    priorityGoals: ["Category page growth", "Retention campaigns"],
    hasCmsAccess: true,
    order: 2,
    isActive: true,
  },
  {
    name: "Monk Cafe",
    website: "https://monkcafe.example.com",
    primaryContact: "Ritik Sharma",
    contactEmail: "ritik@monkcafe.example.com",
    contactPhone: "+91 99881 77665",
    owner: "Karandeep Singh",
    status: "onboarding",
    monthlyRetainer: 58000,
    projectHealth: "green",
    seoScore: 63,
    socialScore: 79,
    websiteScore: 68,
    nextReviewDate: "2026-03-28T00:00:00.000Z",
    services: ["Social Media", "Photography", "Local SEO"],
    websitesManaged: ["https://monkcafe.example.com"],
    priorityGoals: ["Footfall", "Local discovery", "Reels consistency"],
    hasCmsAccess: false,
    order: 3,
    isActive: true,
  },
  {
    name: "Velocity Interiors",
    website: "https://velocityinteriors.example.com",
    primaryContact: "Tanya Bedi",
    contactEmail: "tanya@velocityinteriors.example.com",
    contactPhone: "+91 99881 11335",
    owner: "Niharika Bansal",
    status: "retainer",
    monthlyRetainer: 118000,
    projectHealth: "red",
    seoScore: 58,
    socialScore: 67,
    websiteScore: 61,
    nextReviewDate: "2026-03-26T00:00:00.000Z",
    services: ["Performance Marketing", "Website SEO", "Creative"],
    websitesManaged: ["https://velocityinteriors.example.com"],
    priorityGoals: ["Qualified leads", "Landing page conversion", "Faster callbacks"],
    hasCmsAccess: true,
    order: 4,
    isActive: true,
  },
  {
    name: "NorthStar Dental",
    website: "https://northstardental.example.com",
    primaryContact: "Dr. Rhea Saini",
    contactEmail: "rhea@northstardental.example.com",
    contactPhone: "+91 99141 55221",
    owner: "Niharika Bansal",
    status: "active",
    monthlyRetainer: 76000,
    projectHealth: "amber",
    seoScore: 72,
    socialScore: 62,
    websiteScore: 74,
    nextReviewDate: "2026-04-01T00:00:00.000Z",
    services: ["Local SEO", "Google Business", "Lead Tracking"],
    websitesManaged: ["https://northstardental.example.com"],
    priorityGoals: ["Appointment calls", "Map pack visibility"],
    hasCmsAccess: false,
    order: 5,
    isActive: true,
  },
];

const enquiries = [
  {
    name: "Aman Dhingra",
    email: "aman@velocityinteriors.example.com",
    phone: "+91 98761 22110",
    service: "Performance Marketing",
    message: "Need stronger lead flow for premium home interior packages in Chandigarh and Mohali.",
    sourcePage: "google-ads",
    status: "in-progress",
    notes: "Qualified lead. Requested proposal and estimated monthly ad budget.",
  },
  {
    name: "Ritu Malhotra",
    email: "ritu@northstardental.example.com",
    phone: "+91 98142 55120",
    service: "Local SEO",
    message: "Want more calls and map visibility for a dental clinic with 2 branches.",
    sourcePage: "organic-search",
    status: "responded",
    notes: "Audit shared. Waiting on branch profile access.",
  },
  {
    name: "Sahil Arora",
    email: "sahil@shopbrisk.example.com",
    phone: "+91 99883 21881",
    service: "Ecommerce Development",
    message: "Looking for a Shopify redesign and conversion-focused campaign pages.",
    sourcePage: "website-form",
    status: "new",
    notes: "High-ticket ecommerce prospect from homepage form.",
  },
  {
    name: "Nupur Jain",
    email: "nupur@monkretreats.example.com",
    phone: "+91 98729 11872",
    service: "Social Media Marketing",
    message: "Need content strategy and reels management for a hospitality brand.",
    sourcePage: "instagram",
    status: "new",
    notes: "Requested sample content plan and monthly calendar.",
  },
  {
    name: "Harsh Vohra",
    email: "harsh@buildgrid.example.com",
    phone: "+91 98155 66771",
    service: "Website Design",
    message: "Corporate website needed for a B2B engineering company. Tight launch timeline.",
    sourcePage: "referral",
    status: "in-progress",
    notes: "Discovery call done. Proposal revision pending founder approval.",
  },
  {
    name: "Jasleen Kaur",
    email: "jasleen@greenleaf.example.com",
    phone: "+91 98728 99831",
    service: "SEO",
    message: "Need category page SEO support and content velocity for ecommerce growth.",
    sourcePage: "organic-search",
    status: "archived",
    notes: "Merged into existing GreenLeaf account discussion.",
  },
  {
    name: "Rohit Kanda",
    email: "rohit@urbanarc.example.com",
    phone: "+91 95014 33882",
    service: "Lead Generation",
    message: "Need paid campaigns for a real estate launch campaign next month.",
    sourcePage: "landing-page",
    status: "responded",
    notes: "Media plan sent. Follow-up scheduled for tomorrow.",
  },
];

module.exports = {
  siteSettings,
  serviceCategories,
  services,
  caseStudies,
  clients,
  testimonials,
  blogs,
  faqs,
  team,
  careers,
  financeRecords,
  employees,
  agencyClients,
  enquiries,
};
