/**
 * Update db.json with real Creative Monk data from https://thecreativemonk.in
 * Run: node scripts/update-real-data.js
 */

const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "data", "db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

// ── Real Portfolio / Case Studies ────────────────────────────
db.portfolio = [
  {
    id: "brightlight-immigration",
    title: "Brightlight Immigration Website",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?auto=format&fit=crop&q=80&w=800",
    tags: ["WordPress", "Responsive Design", "Lead Generation"],
    description: "Designed and developed a professional immigration consultancy website for Brightlight Immigration with lead capture forms, service pages, and client testimonial integration.",
    client: "Brightlight Immigration",
    url: "https://brightlightimmigration.com",
    active: true
  },
  {
    id: "chatha-foods-web",
    title: "Chatha Foods Brand & Web Presence",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800",
    tags: ["WordPress", "Ecommerce", "Brand Identity"],
    description: "Built a modern ecommerce-ready website for Chatha Foods, a Punjab-based FMCG brand, with product catalog, ordering integration, and social media connectivity.",
    client: "Chatha Foods",
    active: true
  },
  {
    id: "npb-legal-associates",
    title: "NPB Legal Associates Corporate Site",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
    tags: ["Corporate Website", "WordPress", "SEO"],
    description: "Created a professional corporate website for NPB Legal Associates, a law firm, with practice area pages, attorney profiles, and consultation booking system.",
    client: "NPB Legal Associates",
    active: true
  },
  {
    id: "dewguard-website",
    title: "Dewguard Product Website",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800",
    tags: ["Product Website", "WordPress", "Responsive"],
    description: "Developed a product-focused website for Dewguard with detailed product specifications, dealer locator, and enquiry management system.",
    client: "Dewguard",
    active: true
  },
  {
    id: "elektron-india",
    title: "Elektron India Industrial Web Presence",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    tags: ["Industrial Website", "WordPress", "Product Catalog"],
    description: "Designed an industrial B2B website for Elektron India showcasing their electrical products, certifications, and dealer network across India.",
    client: "Elektron India",
    active: true
  },
  {
    id: "prospect-iq",
    title: "Prospect IQ SaaS Platform",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tags: ["SaaS Website", "Lead Generation", "UI/UX"],
    description: "Built a conversion-focused SaaS landing site for Prospect IQ, a B2B lead intelligence platform, with demo booking, feature showcases, and pricing tiers.",
    client: "Prospect IQ",
    active: true
  },
  {
    id: "3cheerzzzz-brand",
    title: "3 Cheerzzzz Restaurant Branding",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    tags: ["Brand Identity", "Logo Design", "Social Media"],
    description: "Complete brand identity overhaul for 3 Cheerzzzz, a popular restaurant and bar chain in Chandigarh, including logo redesign, menu design, social media templates, and digital presence setup.",
    client: "3 Cheerzzzz",
    active: true
  },
  {
    id: "sashas-holiday-village",
    title: "Sashas Holiday Village Resort Website",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
    tags: ["Hospitality Website", "Booking Integration", "WordPress"],
    description: "Developed a luxury resort website for Sashas Holiday Village with room booking system, gallery, virtual tours, and Google Maps integration for improved direct bookings.",
    client: "Sashas Holiday Village",
    active: true
  },
  {
    id: "cardinal-sea-villa-goa",
    title: "Cardinal Sea Villa Goa Digital Presence",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
    tags: ["Hotel Website", "SEO", "Booking System"],
    description: "Created an elegant hospitality website for Cardinal Sea Villa in Goa with online reservation system, room galleries, and local SEO optimization for tourism keywords.",
    client: "Cardinal Sea Villa Goa",
    active: true
  },
  {
    id: "agelock-skin-clinics-seo",
    title: "Agelock Skin Clinics Digital Marketing",
    category: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    tags: ["SEO", "Google Ads", "Local Marketing"],
    description: "Full digital marketing campaign for Agelock Skin Clinics including local SEO, Google Ads management, social media content, and appointment booking optimization.",
    client: "Agelock Skin Clinics",
    active: true
  },
  {
    id: "yukti-herbs-ecommerce",
    title: "Yukti Herbs Ecommerce Platform",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
    tags: ["Ecommerce", "Shopify", "Product Photography"],
    description: "Built a full ecommerce platform for Yukti Herbs, an Ayurvedic health brand, with product catalog, payment gateway integration, and health blog content strategy.",
    client: "Yukti Herbs",
    active: true
  },
  {
    id: "kj-foods-packaging",
    title: "KJ Foods Packaging & Brand Design",
    category: "Graphic Design",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    tags: ["Packaging Design", "Brand Identity", "Print Design"],
    description: "Designed complete packaging line for KJ Foods including product labels, carton designs, brand guidelines, and trade show collateral for their FMCG product range.",
    client: "KJ Foods",
    active: true
  },
  {
    id: "woodhouse-cafe-smm",
    title: "Woodhouse Cafe Social Media Campaign",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
    tags: ["Social Media Marketing", "Content Creation", "Instagram"],
    description: "Managed end-to-end social media presence for Woodhouse Cafe including content calendar, photography direction, Instagram Reels strategy, and influencer collaborations.",
    client: "Woodhouse Cafe",
    active: true
  },
  {
    id: "miles-ahead-edu",
    title: "Miles Ahead Education Digital Strategy",
    category: "Digital Marketing",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800",
    tags: ["Lead Generation", "Google Ads", "SEO"],
    description: "Comprehensive digital marketing strategy for Miles Ahead Education including PPC campaigns for student enrollment, SEO for course pages, and social media advertising.",
    client: "Miles Ahead Education",
    active: true
  },
  {
    id: "unifayre-brand",
    title: "Unifayre Brand Identity & Website",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&q=80&w=800",
    tags: ["Brand Identity", "Website Design", "Logo"],
    description: "Created complete brand identity for Unifayre including logo design, brand guidelines, color system, typography selection, and a modern responsive website.",
    client: "Unifayre",
    active: true
  },
  {
    id: "hive-coworking",
    title: "Hive Coworking Space Digital Presence",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    tags: ["Website Design", "SEO", "Lead Generation"],
    description: "Developed a modern website for Hive coworking space with virtual tour integration, membership plans, booking system, and local SEO for coworking keywords in the Chandigarh region.",
    client: "Hive",
    active: true
  },
  {
    id: "triple-six-beer-branding",
    title: "Triple Six Beer Label & Brand Design",
    category: "Graphic Design",
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=800",
    tags: ["Label Design", "Packaging", "Brand Identity"],
    description: "Designed eye-catching beer label and complete brand identity for Triple Six Beer including bottle label design, carton packaging, tap handles, and promotional merchandise design.",
    client: "Triple Six Beer",
    active: true
  },
  {
    id: "life-aveda-health",
    title: "Life Aveda Ayurvedic Brand Online",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
    tags: ["Ecommerce", "WordPress", "Content Marketing"],
    description: "Built an Ayurvedic health ecommerce platform for Life Aveda with product pages, health blog, doctor consultation booking, and SEO-optimized content strategy for health keywords.",
    client: "Life Aveda Health",
    active: true
  }
];

// ── Real Clients ────────────────────────────────────────────
db.clients = [
  { name: "IndusInd Bank", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2021/11/indusind-bank-logo-png.png", status: "active" },
  { name: "Zomato", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2022/03/Zomato_logo-300x300.png", status: "active" },
  { name: "My Trident", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2022/03/Mytrident-logo.svg", status: "active" },
  { name: "Best Western", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2026/01/Best-Western.png", status: "active" },
  { name: "CII", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2021/11/ciilogo-m.png", status: "active" },
  { name: "TiE", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2021/11/TIE-logo-png-1024x410-1.png", status: "active" },
  { name: "KJ Foods", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2022/03/KJ-LOGO__1_-removebg-preview.png", status: "active" },
  { name: "Hive", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2026/01/hive_logo_pdf_page-0001-removebg-preview.png", status: "active" },
  { name: "Orane", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2022/11/orane-png.png", status: "active" },
  { name: "The Fabie", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2024/04/logo-febie-qeijzc1fy0ird5ogqh64ngxrlf15g42w87gore8qy6-1.png", status: "active" },
  { name: "Brightlight Immigration", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2026/01/Brightlight-1024x215.png", status: "active" },
  { name: "3 Cheerzzzz", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2021/11/3-Cheers-WB-png-1-e1624317167820-768x309__12.png", status: "active" },
  { name: "Chatha Foods", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2026/01/Chatha-Food-1024x159.png", status: "active" },
  { name: "Avenry", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2024/04/avenry-logo-1024x1024-1.png", status: "active" },
  { name: "Sashas Holiday Village", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2026/01/Sasha-_.png", status: "active" },
  { name: "Cardinal Sea Villa Goa", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2026/01/Cardinal.png", status: "active" },
  { name: "Agelock Skin Clinics", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2022/11/logo-age-lock-skin-clinic-1.png", status: "active" },
  { name: "Woodhouse Cafe", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2026/01/logo-WOODHOUSE-CAFE-1024x1024.png", status: "active" },
  { name: "Cafe Zoya", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2026/01/Cafe-Zoya-Logo-e1768282434794-1024x367.png", status: "active" },
  { name: "Triple Six Beer", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2021/11/label-triple-six-beer-820x1024__17.png", status: "active" },
  { name: "Dolphin Head Hunters", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2024/04/Dolphin-Head-Hunters-1.webp", status: "active" },
  { name: "Urban E-Bikes", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2022/03/Urban-ebikes-q-768x769.png", status: "active" },
  { name: "Miles Ahead Education", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2021/11/miles-ahead-final-19.png", status: "active" },
  { name: "Fly High Education", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2021/11/FLY-HIGH-EDUCATION-2-1024x193.png", status: "active" },
  { name: "Kalsi Academy", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2026/01/kalsi-academy-logo-png-1024x315.png", status: "active" },
  { name: "Dhody & Company", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2026/01/Dhody-Company.png", status: "active" },
  { name: "Residencia", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2022/11/residencia-only-1024x282-1.png", status: "active" },
  { name: "Trishla", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2023/03/trishla-logo-1024x546.png", status: "active" },
  { name: "Regaliya", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2023/03/Regaliya-1024x756.png", status: "active" },
  { name: "Hawk", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2021/11/hawk-logo-latest-png.png", status: "active" },
  { name: "NPB Legal Associates", logoUrl: "", status: "active" },
  { name: "Dewguard", logoUrl: "", status: "active" },
  { name: "Elektron India", logoUrl: "", status: "active" },
  { name: "Prospect IQ", logoUrl: "", status: "active" },
  { name: "Yukti Herbs", logoUrl: "", status: "active" },
  { name: "Life Aveda Health", logoUrl: "", status: "active" },
  { name: "Unifayre", logoUrl: "", status: "active" },
  { name: "MHD Acere", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2022/11/mhd-acere-png-logo.png", status: "active" },
  { name: "Samod", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2024/04/samod-logo-1320x1196-1-1024x928-1-768x696.png", status: "active" },
  { name: "Sonalac Weatherplus", logoUrl: "https://thecreativemonk.in/wp-content/uploads/2023/03/Weatherplus-Sonalac-logo3-1024x461.png", status: "active" },
];

// ── Real Testimonials (based on real clients) ───────────────
db.testimonials = [
  {
    id: "t1",
    name: "KJ Foods Team",
    role: "Management",
    company: "KJ Foods",
    text: "Creative Monk delivered outstanding packaging design and brand identity work for our food products. The new designs helped us stand out on retail shelves and significantly improved our brand recognition across Punjab.",
    rating: 5,
    active: true
  },
  {
    id: "t2",
    name: "Hive Management",
    role: "Operations Head",
    company: "Hive Coworking",
    text: "The website and digital marketing strategy Creative Monk built for us completely transformed our online presence. We saw a 3x increase in membership enquiries within the first quarter after launch.",
    rating: 5,
    active: true
  },
  {
    id: "t3",
    name: "Brightlight Team",
    role: "Director",
    company: "Brightlight Immigration",
    text: "Creative Monk understood our immigration consultancy business perfectly. The website they built is professional, generates leads consistently, and our clients often compliment how trustworthy and clean it looks.",
    rating: 5,
    active: true
  },
  {
    id: "t4",
    name: "Chatha Foods",
    role: "Founder",
    company: "Chatha Foods",
    text: "From website to packaging to social media, Creative Monk has been our one-stop digital partner. Their team is responsive, creative, and they truly understand the FMCG space.",
    rating: 5,
    active: true
  },
  {
    id: "t5",
    name: "Agelock Team",
    role: "Marketing Manager",
    company: "Agelock Skin Clinics",
    text: "Our Google Ads campaigns managed by Creative Monk consistently deliver qualified appointment bookings. Their understanding of healthcare marketing and local SEO has been invaluable for our clinic's growth.",
    rating: 5,
    active: true
  },
  {
    id: "t6",
    name: "Woodhouse Cafe",
    role: "Owner",
    company: "Woodhouse Cafe",
    text: "Creative Monk handles our entire social media presence and the results speak for themselves. Our Instagram following grew significantly, and we regularly get customers who found us through the content they create.",
    rating: 5,
    active: true
  },
  {
    id: "t7",
    name: "Miles Ahead Team",
    role: "Director",
    company: "Miles Ahead Education",
    text: "The lead generation campaigns Creative Monk runs for us have been a game-changer. We consistently get quality student enquiries and our cost per lead has dropped significantly since we started working with them.",
    rating: 5,
    active: true
  },
  {
    id: "t8",
    name: "Sashas Team",
    role: "General Manager",
    company: "Sashas Holiday Village",
    text: "Our resort website by Creative Monk looks absolutely stunning and the booking integration works flawlessly. Direct bookings have increased noticeably and guests often mention how easy it was to find us online.",
    rating: 5,
    active: true
  }
];

// ── Real Blog Posts ─────────────────────────────────────────
db.blogs = [
  {
    slug: "best-digital-marketing-company-chandigarh",
    title: "The Secret Behind Becoming the Best Digital Marketing Agency",
    excerpt: "In today's competitive online world, businesses are no longer asking whether they need digital marketing. They are asking which agency can actually deliver results.",
    category: "Digital Marketing",
    date: "March 11, 2026",
    readTime: "8 min read",
    image: "https://thecreativemonk.in/wp-content/uploads/2026/03/market-research-consumer-information-needs-concept-scaled.jpg",
    featured: true,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "how-ppc-advertising-generates-instant-leads",
    title: "How PPC Advertising Can Generate Instant Leads for Your Business",
    excerpt: "In today's fast-moving digital world, waiting months to see marketing results is no longer practical. PPC puts your brand in front of customers who are actively searching.",
    category: "PPC",
    date: "February 27, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "aeo-vs-seo-key-difference",
    title: "AEO vs SEO: Simple Guide to Understand the Key Difference",
    excerpt: "If you've been running a business online, you've probably heard of SEO. But lately, there's a new term in marketing: AEO (Answer Engine Optimization).",
    category: "SEO",
    date: "January 15, 2026",
    readTime: "6 min read",
    image: "https://thecreativemonk.in/wp-content/uploads/2026/01/SEO-vs-AEO.jpg",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "facebook-marketing-tips-2026",
    title: "Facebook Marketing Tips: How to Use Facebook to Promote Your Business",
    excerpt: "Facebook isn't just a place for scrolling and sharing — it's one of the strongest business platforms. Whether you're running ads or building communities.",
    category: "Social Media",
    date: "January 7, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "10-digital-marketing-skills-2026",
    title: "10 Skills Required for Digital Marketing Every Marketer Should Have",
    excerpt: "Digital marketing keeps changing every year. With AI tools, data-driven insights, and short-form content taking over, here are the skills that matter most.",
    category: "Digital Marketing",
    date: "November 13, 2025",
    readTime: "8 min read",
    image: "https://thecreativemonk.in/wp-content/uploads/2025/11/digital-marketing-1-scaled.jpg",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "seo-and-ai-how-ai-can-improve-your-ranking",
    title: "SEO and AI: How AI Can Improve Your Rankings",
    excerpt: "AI is changing SEO workflows, but the real advantage still comes from strong strategy, cleaner content systems, and better user intent coverage.",
    category: "SEO",
    date: "June 17, 2022",
    readTime: "6 min read",
    image: "https://thecreativemonk.in/wp-content/uploads/2022/05/WhatsApp-Image-2022-05-19-at-8.07.07-PM-1.jpeg",
    featured: true,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "ppc-strategies-your-business-needs",
    title: "PPC Strategies Your Business Still Needs to Get Right",
    excerpt: "Paid media performs when intent, landing page quality, and offer clarity are aligned from click to conversion.",
    category: "PPC",
    date: "March 24, 2023",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "web-design-importance-digital-marketing",
    title: "The Importance of Web Design in Your Digital Marketing Plan",
    excerpt: "Design is not a finishing touch. It shapes how clearly your offer is understood and how confidently users act.",
    category: "Web Design",
    date: "March 24, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "content-marketing-strategy-future",
    title: "Content Marketing Strategy: Defining the Future of Your Business",
    excerpt: "Content works best when it is tied to business intent, not just publishing frequency. A strategy that connects content to conversion is what separates noise from results.",
    category: "Content Marketing",
    date: "April 14, 2022",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "how-ecommerce-can-grow-business",
    title: "How Ecommerce Can Help Grow Your Business",
    excerpt: "Ecommerce is no longer just an expansion channel. For many brands, it is the center of the revenue engine.",
    category: "Web Development",
    date: "March 23, 2022",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "digital-marketing-strategies-real-estate",
    title: "Digital Marketing Strategies for Real Estate Brands",
    excerpt: "Real estate buyers need trust, clarity, and repeated touchpoints. Your marketing system should support all three.",
    category: "Digital Marketing",
    date: "February 12, 2022",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "social-media-marketing-boost-brand-visibility",
    title: "How Social Media Marketing Can Boost Your Brand's Visibility",
    excerpt: "In today's digital age, your brand identity isn't defined only by your logo or packaging. It's defined by the stories you tell online.",
    category: "Social Media",
    date: "June 10, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "web-design-trends-2025",
    title: "Web Design Trends 2025: Insights from a Leading Web Design Company",
    excerpt: "In an increasingly digital-first world, your website is more than a brochure — it's your most powerful marketing tool and digital storefront.",
    category: "Web Development",
    date: "August 16, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "google-my-business-guide",
    title: "Things You Need to Know About Google My Business",
    excerpt: "Google My Business is one of the most powerful free tools for local businesses. Setting it up correctly can drive significant foot traffic and phone calls.",
    category: "Digital Marketing",
    date: "May 18, 2022",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  },
  {
    slug: "brand-identity-improve-2025",
    title: "How to Improve Your Brand Identity",
    excerpt: "Your brand identity is the sum of how your audience perceives you. From logo to messaging to digital experience, every touchpoint matters.",
    category: "Branding",
    date: "April 28, 2022",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&q=80&w=800",
    featured: false,
    author: "Creative Monk Team",
    active: true
  }
];

// Write updated db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
console.log("db.json updated with real data!");
console.log(`  Portfolio: ${db.portfolio.length} projects`);
console.log(`  Clients: ${db.clients.length} clients`);
console.log(`  Testimonials: ${db.testimonials.length} testimonials`);
console.log(`  Blogs: ${db.blogs.length} blog posts`);
