function asString(value, fallback = "") {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value).trim();
}

function asStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => asString(item)).filter(Boolean);
}

function asBoolean(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true" || value === "1" || value === 1) {
    return true;
  }

  if (value === "false" || value === "0" || value === 0) {
    return false;
  }

  return fallback;
}

function asNumber(value, fallback = 0) {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : fallback;
}

function asInteger(value, fallback = 0) {
  const normalized = Number.parseInt(value, 10);
  return Number.isFinite(normalized) ? normalized : fallback;
}

function asObject(value, fallback = {}) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  return fallback;
}

function asDateString(value, fallback = new Date().toISOString()) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toISOString();
}

function pickEnum(value, options, fallback) {
  const normalized = asString(value);
  return options.includes(normalized) ? normalized : fallback;
}

function normalizeSeo(value) {
  const seo = asObject(value);
  return {
    title: asString(seo.title),
    description: asString(seo.description),
    canonical: asString(seo.canonical),
    keywords: asStringArray(seo.keywords),
    ogImage: asString(seo.ogImage),
  };
}

function normalizeFaqItems(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const faq = asObject(item);
      return {
        question: asString(faq.question),
        answer: asString(faq.answer),
      };
    })
    .filter((item) => item.question && item.answer);
}

function normalizeProcessSteps(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const step = asObject(item);
      return {
        step: asString(step.step),
        desc: asString(step.desc),
      };
    })
    .filter((item) => item.step && item.desc);
}

function normalizeMetrics(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const metric = asObject(item);
      return {
        label: asString(metric.label),
        value: asString(metric.value),
      };
    })
    .filter((item) => item.label && item.value);
}

function normalizeTestimonialQuote(value) {
  const quote = asObject(value);
  return {
    text: asString(quote.text),
    author: asString(quote.author),
    role: asString(quote.role),
  };
}

function normalizeSocial(value) {
  const social = asObject(value);
  return {
    facebook: asString(social.facebook),
    instagram: asString(social.instagram),
    youtube: asString(social.youtube),
    linkedin: asString(social.linkedin),
    whatsapp: asString(social.whatsapp),
    twitter: asString(social.twitter),
  };
}

function normalizeLinks(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const link = asObject(item);
      return {
        label: asString(link.label),
        href: asString(link.href),
      };
    })
    .filter((item) => item.label && item.href);
}

function normalizeAddress(value) {
  const address = asObject(value);
  return {
    line1: asString(address.line1),
    line2: asString(address.line2),
    city: asString(address.city),
    state: asString(address.state),
    pincode: asString(address.pincode),
    country: asString(address.country, "India"),
    full: asString(address.full),
    mapsUrl: asString(address.mapsUrl),
  };
}

function normalizeHero(value) {
  const hero = asObject(value);
  return {
    eyebrow: asString(hero.eyebrow),
    title: asString(hero.title),
    highlight: asString(hero.highlight),
    description: asString(hero.description),
    primaryCtaLabel: asString(hero.primaryCtaLabel),
    primaryCtaHref: asString(hero.primaryCtaHref),
    secondaryCtaLabel: asString(hero.secondaryCtaLabel),
    secondaryCtaHref: asString(hero.secondaryCtaHref),
    trustPoints: asStringArray(hero.trustPoints),
  };
}

function normalizeValues(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const entry = asObject(item);
      return {
        title: asString(entry.title),
        description: asString(entry.description),
      };
    })
    .filter((item) => item.title && item.description);
}

function normalizeFooterLinks(value) {
  const links = asObject(value);
  return {
    company: normalizeLinks(links.company),
    services: normalizeLinks(links.services),
    legal: normalizeLinks(links.legal),
  };
}

function normalizeSectionToggles(value) {
  const toggles = asObject(value);
  return {
    showClients: asBoolean(toggles.showClients, true),
    showServices: asBoolean(toggles.showServices, true),
    showCaseStudies: asBoolean(toggles.showCaseStudies, true),
    showTestimonials: asBoolean(toggles.showTestimonials, true),
    showBlogs: asBoolean(toggles.showBlogs, true),
    showFaqs: asBoolean(toggles.showFaqs, true),
  };
}

module.exports = {
  asString,
  asStringArray,
  asBoolean,
  asNumber,
  asInteger,
  asObject,
  asDateString,
  pickEnum,
  normalizeSeo,
  normalizeFaqItems,
  normalizeProcessSteps,
  normalizeMetrics,
  normalizeTestimonialQuote,
  normalizeSocial,
  normalizeLinks,
  normalizeAddress,
  normalizeHero,
  normalizeValues,
  normalizeFooterLinks,
  normalizeSectionToggles,
};
