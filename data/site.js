// SERVICES — lives here in site.js: the single source of truth.
// To add a service, append ONE object to this array. Home, services page,
// detail pages, work grid and footer all render from it, so nothing else changes.
export const services = [
  {
    slug: "plate-decoration-aarathi-plates",
    title: "Plate Decoration & Aarathi Plates",
    blurb: "Hand-dressed aarathi plates for welcome rituals and poojas.",
    icon: "plate",
    image: "/random.jpg",
    gallery: [{ featured: true, src: "/random.jpg", caption: "Welcome aarathi plate" }, { featured: false, src: "/random.jpg", caption: "Pooja plate detailing" }, { featured: false, src: "/random.jpg", caption: "Seer tray arrangement" }, { featured: false, src: "/random.jpg", caption: "Festival pooja arrangement" }],
    details: [
      "Welcome aarathis, pooja plates and seer trays dressed with fresh flowers, diyas and ribbon work.",
      "Share your function and guest count — we match every plate to your ceremony."
    ],
    whyUs: [
      "Fresh flowers strung on the day, never a day earlier",
      "Kumkum, turmeric and diya accents matched to your ceremony",
      "Plates sized for family poojas and grand welcomes alike"
    ]
  },
  {
    slug: "luxury-hampers-trousseau-packing",
    title: "Luxury Hampers & Trousseau Packing",
    blurb: "Curated hampers and trousseau trays, packed to gift.",
    icon: "hamper",
    image: "/random.jpg",
    gallery: [{ featured: true, src: "/random.jpg", caption: "Dry-fruit hamper tray" }, { featured: false, src: "/random.jpg", caption: "Trousseau gift box" }, { featured: false, src: "/random.jpg", caption: "Basket arrangement" }, { featured: false, src: "/random.jpg", caption: "Wedding trousseau set" }],
    details: [
      "Dry-fruit, chocolate and keepsake hampers arranged in trays, boxes and baskets.",
      "Trousseau packing for sarees, lehengas and gifts — layered, labelled and photo-ready."
    ],
    whyUs: [
      "Dry-fruit, chocolate and keepsake mixes you choose",
      "Trays, boxes and baskets dressed in your colours",
      "Bulk orders packed uniform — every box identical"
    ]
  },
  {
    slug: "stalls",
    title: "Stalls: Bangle, Flower, Photobooth, Mehendi, Bindi, Earrings, Games",
    blurb: "Festive experience stalls for weddings and family functions.",
    icon: "stall",
    image: "/random.jpg",
    gallery: [{ featured: true, src: "/random.jpg", caption: "Bangle stall setup" }, { featured: false, src: "/random.jpg", caption: "Photobooth corner" }, { featured: false, src: "/random.jpg", caption: "Mehendi stall" }, { featured: false, src: "/random.jpg", caption: "Bindi and earrings stall" }],
    details: [
      "Bangle, flower, photobooth, mehendi, bindi, earrings and games stalls that keep guests delighted between ceremonies.",
      "Pick any combination — we set up, manage and wind down each stall."
    ],
    whyUs: [
      "Seven stall types, mix and match any combination",
      "Artists and hosts managed by us, not you",
      "Setup to teardown in a single visit"
    ]
  },
  {
    slug: "kitchen-decoration",
    title: "Kitchen Decoration",
    blurb: "Calm, welcoming kitchen styling for seer and ceremonies.",
    icon: "kitchen",
    image: "/random.jpg",
    gallery: [{ featured: true, src: "/random.jpg", caption: "Seer kitchen styling" }, { featured: false, src: "/random.jpg", caption: "Festive kitchen corner" }, { featured: false, src: "/random.jpg", caption: "Traditional accents" }, { featured: false, src: "/random.jpg", caption: "Morning-of-function finish" }],
    details: [
      "Kitchen and seer-area styling with flowers, fabric and traditional accents.",
      "Made to photograph beautifully and welcome guests the moment they arrive."
    ],
    whyUs: [
      "Styling that photographs beautifully at seer functions",
      "Traditional accents with a calm, modern hand",
      "Done in hours, without moving your kitchen around"
    ]
  },
  {
    slug: "return-gifts",
    title: "Return Gifts: Traditional & Corporate",
    blurb: "Thoughtful return gifts for guests, teams and clients.",
    icon: "gift",
    image: "/random.jpg",
    gallery: [{ featured: true, src: "/random.jpg", caption: "Traditional return gifts" }, { featured: false, src: "/random.jpg", caption: "Corporate gift boxes" }, { featured: false, src: "/random.jpg", caption: "Packed and tagged" }, { featured: false, src: "/random.jpg", caption: "Wedding favour table" }],
    details: [
      "Traditional return gifts for weddings and family functions, plus clean corporate gifting for teams and clients.",
      "Tell us your count and occasion — we suggest, pack and finish every piece."
    ],
    whyUs: [
      "Traditional and corporate ranges side by side",
      "Small family counts to full wedding guest lists",
      "Each piece finished, tagged and ready to hand over"
    ]
  },
  {
    slug: "garlands-hair-flowers",
    title: "Garlands & Hair Flowers",
    blurb: "Fresh garlands, veni and hair flowers for the day.",
    icon: "garland",
    image: "/random.jpg",
    gallery: [{ featured: true, src: "/random.jpg", caption: "Fresh jasmine strands" }, { featured: false, src: "/random.jpg", caption: "Bridal veni" }, { featured: false, src: "/random.jpg", caption: "Rose garland" }, { featured: false, src: "/random.jpg", caption: "Mixed bridal strands" }],
    details: [
      "Fresh jasmine, rose and mixed garlands, veni and hair flowers strung on the day.",
      "Made to stay fresh through long ceremonies and endless photographs."
    ],
    whyUs: [
      "Jasmine, rose and mixed strands strung fresh",
      "Veni and hair flowers that hold through long ceremonies",
      "Matched sets for the couple and family"
    ]
  },
  {
    slug: "ring-platters",
    title: "Ring Platters",
    blurb: "Keepsake ring platters for engagements.",
    icon: "ring",
    image: "/random.jpg",
    gallery: [{ featured: true, src: "/random.jpg", caption: "Engagement platter" }, { featured: false, src: "/random.jpg", caption: "Floral ring setting" }, { featured: false, src: "/random.jpg", caption: "Keepsake details" }, { featured: false, src: "/random.jpg", caption: "Close-up ring frame" }],
    details: [
      "Engagement ring platters dressed with flowers, fabric and keepsake details.",
      "Designed around your rings — and your photographer."
    ],
    whyUs: [
      "Designed around your exact rings",
      "Keepsake details you keep long after the day",
      "Finished in time for your photographer"
    ]
  },
  {
    slug: "stage-decoration",
    title: "Stage Decoration",
    blurb: "Quiet, elegant stages for weddings and receptions.",
    icon: "stage",
    image: "/random.jpg",
    gallery: [{ featured: true, src: "/random.jpg", caption: "Wedding stage drapes" }, { featured: false, src: "/random.jpg", caption: "Reception backdrop" }, { featured: false, src: "/random.jpg", caption: "Flower stagework" }, { featured: false, src: "/random.jpg", caption: "Evening reception glow" }],
    details: [
      "Wedding and reception stages in soft drapes, fresh flowers and warm light.",
      "Calm backdrops that flatter the couple, not the decor."
    ],
    whyUs: [
      "Soft drapes, fresh flowers and warm light",
      "Backdrops that flatter the couple, not the decor",
      "Scaled to halls big and small"
    ]
  },
  {
    slug: "home-decoration",
    title: "Home Decoration",
    blurb: "Warm home styling for festivals and celebrations.",
    icon: "home",
    image: "/random.jpg",
    gallery: [{ featured: true, src: "/random.jpg", caption: "Festive entrance" }, { featured: false, src: "/random.jpg", caption: "Pooja corner styling" }, { featured: false, src: "/random.jpg", caption: "Living room warmth" }, { featured: false, src: "/random.jpg", caption: "Doorway torans and lamps" }],
    details: [
      "Entrances, living rooms and pooja corners styled for festivals and family functions.",
      "Festive warmth without turning your home upside down."
    ],
    whyUs: [
      "Entrances, living rooms and pooja corners",
      "Festival warmth without turning the house upside down",
      "Finished before guests arrive, cleared after"
    ]
  }
];


// ── PUBLIC CONFIG — edit values here ──────────────────────────────
// WhatsApp number in international format (no +, no spaces).
export const WA_NUMBER = "919342780445";

export function getWaNumber() {
  return WA_NUMBER;
}

// Route paths live here too — no href literals in components.
export function serviceHref(slug) {
  return `${site.servicesPage.href}/${slug}`;
}

export const site = {
  name: "All in One Dream Place",
  tagline: "Your Celebration, Our Creation.",
  url: "https://allinonedreamplace.in",
  homeHref: "/",
  locale: "en_IN",
  lang: "en",

  address: "No. 10/14, Near BCS Jain School, Washermanpet, Chennai - 600021, Tamil Nadu",
  addressParts: {
    street: "No. 10/14, Near BCS Jain School, Washermanpet",
    locality: "Chennai",
    postal: "600021",
    region: "Tamil Nadu",
    country: "IN"
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=No.+10%2F14+Near+BCS+Jain+School+Washermanpet+Chennai+600021",
  mapsLabel: "Open in Google Maps",

  instagram: "https://www.instagram.com/all_in_one_dream_place/",
  instagramLabel: "Instagram",
  instagramHandle: "@all_in_one_dream_place",

  logo: "/logo.jpg",
  logoSm: "/logo-sm.jpg",
  logoAlt: "All in One Dream Place logo",
  divider: "/partition.png",
  flower: "/flower.png",

  loader: {
    note: "Preparing something beautiful…"
  },

  // In-page anchors. Ids without "#".
  anchors: { top: "top", main: "main" },

  dashboard: {
    title: "Dashboard",
    uploading: "Uploading…",
    working: "Working…",
    tabs: { enquiries: "Enquiries", hero: "Hero Slides", services: "Services", account: "Account", about: "About Us" },
    tabOrder: ["enquiries", "home", "services", "about", "account"],
    homeLabel: "Home",
    homeTabs: {
      hero: "Hero Slides",
      brand: "Brand Intro",
      featured: "Featured",
      steps: "How It Works",
      work: "Our Work",
      testimonials: "Testimonials",
      faq: "FAQs"
    },
    homeOrder: ["hero", "brand", "featured", "steps", "work", "testimonials", "faq"],
    homeMgr: {
      save: "Save changes",
      saved: "Saved.",
      add: "Add",
      remove: "Remove",
      brandTitle: "Brand Intro",
      brandHeading: "Heading",
      brandText: "Text",
      ctaLabel: "Button text",
      ctaHref: "Button link",
      featTitle: "Featured Services",
      featHint: "Ticked services show in the home grid.",
      stepsTitle: "How It Works",
      stepTitle: "Step title",
      stepText: "Text",
      stepPoints: "Checklist",
      richLabel: "Styled intro lines",
      richText: "Text",
      richStyle: "Style",
      richStyles: { plain: "Plain", bold: "Bold", plum: "Plum", teal: "Teal", gold: "Gold" },
      addSegment: "Add line",
      stepArt: "Illustration path",
      addStep: "Add step",
      testiTitle: "Testimonials",
      quoteLabel: "Quote",
      nameLabel: "Name",
      detailLabel: "Detail",
      addQuote: "Add testimonial",
      faqTitle: "FAQs",
      qLabel: "Question",
      aLabel: "Answer",
      addQa: "Add question",
      workTitle: "Our Work",
      workEmpty: "No shots featured yet — star shots inside Services.",
      workNote: "Tiles come from photo shots flagged Featured. Manage them inside any service below.",
      workCta: "Open Services"
    },
    aboutMgr: {
      title: "About Us",
      headingLabel: "Heading",
      introLabel: "Intro line",
      ledeLabel: "Opening quote",
      textLabel: "Story paragraphs — one per box",
      addPara: "Add paragraph",
      ownerImageLabel: "Founder photo",
      ownerRoleLabel: "Role line",
      replaceImage: "Replace photo",
      uploading: "Uploading…",
      uploaded: "Photo uploaded.",
      save: "Save changes",
      saved: "Saved.",
      remove: "Remove"
    },
    logout: "Log out",
    sessionExpired: "Session expired. Please log in again.",
    empty: "No enquiries yet.",
    showing: "enquiries",
    status: { new: "New", contacted: "Contacted", done: "Done" },
    next: "Mark as",
    received: "Received",
    remove: "Delete",
    removeConfirm: "Delete this enquiry? This cannot be undone.",
    heroTitle: "Hero Slides",
    heroHint: "Four slides fill the home hero. Replace a photo, edit its description, then save.",
    altLabel: "Photo description",
    heroMgr: {
      alt: "Photo description",
      replace: "Replace",
      uploading: "Uploading…",
      uploaded: "Photo uploaded.",
      add: "Add slide",
      save: "Save slides",
      saved: "Hero slides saved.",
      remove: "Remove slide"
    },
    addSlide: "Add slide",
    saveSlides: "Save slides",
    slidesSaved: "Hero slides saved.",
    servicesMgr: {
      title: "Services",
      add: "Add service",
      save: "Save services",
      saved: "Services saved.",
      titleLabel: "Title",
      slugLabel: "Slug",
      blurbLabel: "Short line",
      iconLabel: "Icon",
      imageLabel: "Main image",
      detailsLabel: "Feature lines",
      whyUsLabel: "Why-book points",
      galleryLabel: "Photo shots",
      captionLabel: "Caption",
      captionWords: "words",
      shotsMax: "Maximum 4 shots per service.",
      galleryRule: "Each service holds up to 4 photo shots. Star the ones to feature in Our Work.",
      featuredShot: "Featured in Our Work",
      featuredService: "Featured on home",
      addLine: "Add line",
      addShot: "Add shot",
      remove: "Remove",
      replaceImage: "Replace photo",
      uploading: "Uploading…",
      uploaded: "Photo uploaded.",
      back: "Back to services",
      delTitle: "Delete this service?",
      delBody: "This permanently removes the service, its page, and its photos from Cloudinary. This cannot be undone.",
      delConfirm: "Yes, delete everything",
      delCancel: "Keep it",
      deleting: "Deleting…",
      serviceDeleted: "Service deleted.",
      untitled: "Untitled service",
      homeBadge: "Home",
      workBadge: "Work",
      shotOne: "shot",
      shotMany: "shots",
      photoOne: "photo",
      photoMany: "photos"
    },
    accountTitle: "Login credentials",
    accountIntro: "Change the email or password used to log in here.",
    currentPasswordLabel: "Current password",
    newEmailLabel: "New email",
    newPasswordLabel: "New password",
    save: "Save changes",
    saved: "Credentials updated. Please log in again.",
    updated: "Enquiry updated.",
    deleted: "Enquiry deleted.",
    loading: "Loading…",
    errors: {
      badRequest: "Bad request.",
      wrongCurrent: "Current password is wrong.",
      emailRequired: "Email is required.",
      emailTaken: "That email is already in use.",
      shortPassword: "New password needs at least 8 characters."
    }
  },

  adminLogin: {
    title: "Admin Login",
    emailLabel: "Email",
    emailPlaceholder: "admin@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter the admin password",
    button: "Unlock",
    unlocked: "Welcome back!",
    signingIn: "Signing in…",
    showPassword: "Show password",
    hidePassword: "Hide password",
    error: "Wrong email or password. Try again."
  },

  // Accessibility labels. Content copy for assistive tech — still data.
  a11y: {
    skip: "Skip to content",
    hero: "Welcome",
    primaryNav: "Primary",
    mobileNav: "Mobile",
    footerNav: "Footer",
    breadcrumb: "Breadcrumb",
    moreServices: "More services",
    sliderPrev: "Previous slide",
    sliderNext: "Next slide"
  },
  whatsappGreeting: "Hello All in One Dream Place! I'd like to plan a celebration.",

  // WhatsApp enquiry message template (field labels + empty marker).
  waMsg: {
    intro: "Hello All in One Dream Place!",
    name: "Name",
    phone: "Phone",
    date: "Date",
    location: "Location",
    function: "Function",
    requirement: "Requirement",
    budget: "Budget",
    empty: "-"
  },

  meta: {
    title: "All in One Dream Place — Event Decoration & Gifting in Chennai",
    description: "Your Celebration, Our Creation. Plates, hampers, stalls, garlands, ring platters, stage and home decoration in Chennai.",
    ogTitle: "All in One Dream Place — Your Celebration, Our Creation",
    ogDescription: "Event decoration and gifting in Chennai — plates, hampers, stalls, garlands, stages and home styling."
  },

  nav: [
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about" }
  ],
  navCta: { label: "Enquire", href: "/enquire" },
  menuOpenLabel: "Close",
  menuClosedLabel: "Menu",

  hero: {
    // Local placeholders for now — replace from the dashboard later.
    // Each slide: { src, alt }. src may be a /public path or a
    // Cloudinary path (resolved by lib/media.js either way).
    slides: [
      { src: "/random.jpg", alt: "Celebration table styling" },
      { src: "/random.jpg", alt: "Floral decoration detail" },
      { src: "/random.jpg", alt: "Event stage flowers" },
      { src: "/random.jpg", alt: "Festive home entrance" }
    ],
    subtitle: "Event decoration and gifting in Chennai — plates, hampers, stalls, garlands, stages and warm home styling.",
    primaryCta: { label: "Plan your celebration", href: "#enquire" },
    secondaryCta: { label: "See our services", href: "/services" }
  },

  sections: {
    services: {
      heading: "Services",
      intro: "Nine things we make with care. Tell us your function — we handle the details."
    },
    featured: {
      heading: "Featured Services",
      intro: "A few favourites to start with — the full list lives on the services page."
    },
    how: {
      heading: "How it works",
      intro: "Simple, by message or phone. Most of our planning happens on WhatsApp.",
      stepWord: "Step",
      nextWord: "Next"
    },
    work: {
      heading: "Our work",
      intro: "Short clips and photos from recent celebrations. New work appears on Instagram first."
    },
    enquire: {
      heading: "Enquire",
      intro: "Share your date and requirement. We save it and open WhatsApp with your details prefilled."
    }
  },

  steps: [
    {
      n: "01",
      title: "Share details",
      text: "Tell us your date, venue and what you are celebrating.",
      art: "/Photo Sharing-bro.svg",
      rich: [
        { t: "Tell us your " },
        { t: "date, venue and function", b: true },
        { t: " — on WhatsApp or the enquiry form. " },
        { t: "Photos and references", c: "teal" },
        { t: " help us see exactly what you love. We usually reply within a day." }
      ],
      points: ["Your date, or a date range", "Venue or area in Chennai", "Photos you love", "Any Instagram or Pinterest saves"]
    },
    {
      n: "02",
      title: "Get a quotation",
      text: "We call back with ideas and a clear quotation.",
      art: "/get-quotation.svg",
      rich: [
        { t: "We call back with " },
        { t: "ideas and a clear quotation", b: true },
        { t: " — " },
        { t: "no hidden extras, no pressure", c: "plum" },
        { t: ". Every line is itemised so you know exactly what each piece costs." }
      ],
      points: ["Ideas matched to your function", "One clear quotation", "Tweaked together till it fits", "Delivery, setup and teardown included"]
    },
    {
      n: "03",
      title: "We create it",
      text: "We decorate, pack and set up — you enjoy the day.",
      art: "/create.svg",
      rich: [
        { t: "We " },
        { t: "decorate, pack and set up", b: true },
        { t: " while " },
        { t: "you enjoy the day", c: "teal" },
        { t: ". You simply walk in — to flowers, colour and compliments." }
      ],
      points: ["Setup handled end to end", "Fresh flowers on the day", "Final checks before guests arrive", "Cleared up afterwards"]
    }
  ],

  functions: ["Birthday", "Wedding", "Engagement", "Baby Shower", "Housewarming", "Corporate event", "Festival", "Other"],

  form: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    phoneLabel: "Phone",
    phonePlaceholder: "Mobile number",
    dateLabel: "Date",
    locationLabel: "Location",
    locationPlaceholder: "Venue / area in Chennai",
    functionLabel: "Function",
    functionPlaceholder: "Select a function",
    budgetLabel: "Budget",
    budgetOptional: "(optional)",
    budgetPlaceholder: "e.g. under Rs. 20,000",
    requirementLabel: "Requirement",
    requirementPlaceholder: "Tell us what you need — plates, hampers, stage, stalls…",
    submit: "Send enquiry",
    sending: "Sending…",
    success: "Thank you! We have your enquiry. We will call you back shortly.",
    sendViaWhatsApp: "Couldn't save — tap to send it on WhatsApp instead.",
    errorFallback: "Something went wrong. Please try again or message us on WhatsApp.",
    errorGeneric: "Something went wrong. Please try again.",
    sideHeading: "Prefer to talk?",
    chatInstead: "Chat instead",
    errors: {
      resend: "Please send the form again.",
      name: "Please enter your name.",
      phone: "Please enter a valid phone number.",
      date: "Please choose a date.",
      location: "Please enter the location.",
      functionType: "Please choose a function.",
      requirement: "Please describe your requirement briefly.",
      saveFail: "We could not save your enquiry. Please message us on WhatsApp."
    }
  },

  testimonials: {
    heading: "Love notes",
    intro: "Real words from real celebrations.",
    emptyHeading: "Your story could be first",
    emptyText: "Celebration stories from our families are on their way — check back soon, or start yours today.",
    // PLACEHOLDER QUOTES — replace with real client words before launch.
    items: [
      { quote: "The aarathi plates looked straight out of a film set. Our guests kept asking where we got them.", name: "Priya & Karthik", detail: "Wedding · Chennai" },
      { quote: "They packed forty hampers and every single one looked identical. Impeccable finishing.", name: "Deepa S.", detail: "Diwali Gifting" },
      { quote: "The mehendi and bangle stalls kept our guests busy for hours. Best decision of the wedding.", name: "Anitha R.", detail: "Wedding · Washermanpet" },
      { quote: "Our home looked magical for the festival, and they cleared everything the same night.", name: "Revathi M.", detail: "Housewarming · Chennai" }
    ]
  },

  faq: {    heading: "Questions, answered",
    intro: "The short version of everything people ask us on WhatsApp.",
    items: [
      {
        q: "How do we book?",
        a: "Send an enquiry with your date, venue and function — here or on WhatsApp. We call back with ideas and a clear quotation."
      },
      {
        q: "What details do you need from us?",
        a: "Your date, venue or area, the function, and what you need — plates, hampers, stalls, stage and so on. Photos or references help."
      },
      {
        q: "Do you work outside Chennai?",
        a: "We are based in Washermanpet, Chennai. For venues outside the city, message us on WhatsApp with your location and we will tell you honestly if we can take it up."
      },
      {
        q: "When should we reach out?",
        a: "As early as you can, so there is time to plan, source fresh flowers and prepare everything calmly."
      },
      {
        q: "Can the decoration match our theme?",
        a: "Yes — colours, flowers and themes are planned around your function. Share references on WhatsApp and we will work them in."
      }
    ]
  },

  footer: {
    about: "event decoration and gifting in Chennai.",
    visitTitle: "Visit us",
    contactTitle: "Contact",
    whatsappLabel: "WhatsApp",
    hoursTitle: "Business hours",
    hoursDays: "Monday – Sunday",
    hoursTime: "7:00 AM – 8:30 PM",
    exploreTitle: "Explore",
    servicesTitle: "Services",
    backToTop: "Back to top"
  },

  about: {
    heading: "About Us",
    intro: "The hands behind the celebrations.",
    ownerImage: "/owner.png",
    ownerRole: "Founder",
    lede: "Every celebration begins long before the guests arrive — in quiet mornings stringing jasmine, in the patience of a perfectly folded tray, in the belief that no family function is ever small.",
    paragraphs: [
      "All in One Dream Place is an event decoration and gifting studio in Washermanpet, Chennai. Your Celebration, Our Creation — we dress aarathi plates and stages, pack hampers and trousseaus, run festive stalls, and style homes for weddings, festivals and family functions.",
      "This is personal work. When you hand us your function, you hand us your family's happiest day — and we carry it like our own. Most of our planning happens on WhatsApp: share your date, venue and function, and we call back with ideas and a clear quotation."
    ]
  },

  brand: {
    heading: "Made for your moments",
    text: "All in One Dream Place is a decoration and gifting studio in Washermanpet, Chennai — plates, hampers, stalls, garlands, stages and warm home styling, all made by hand for your function.",
    cta: { label: "More about us", href: "/about" }
  },

  serviceIcons: ["plate", "hamper", "stall", "kitchen", "gift", "garland", "ring", "stage", "home"],

  featuredServices: [
    "plate-decoration-aarathi-plates",
    "luxury-hampers-trousseau-packing",
    "stalls",
    "stage-decoration",
    "garlands-hair-flowers",
    "return-gifts"
  ],

  cta: {
    heading: "Let's plan your celebration",
    text: "Share your date and function — we reply with ideas and a clear quotation."
  },

  servicesPage: {
    breadcrumbHome: "Home",
    href: "/services",
    abstract: "Nine crafts, one studio — every plate dressed, every hamper packed, every stage raised by hand in Chennai. Open any service to see what it holds.",
    viewAll: "View all services",
    exploreLabel: "Explore",
    whyHeading: "Why book this with us",
    showcaseHeading: "Keep exploring",
    showcaseIntro: "More crafts from the studio — open any one to see it up close.",
    showcaseIntro: "More crafts from the studio — open any one to see it up close."
  }
};

export const floatingAriaLabel = `Chat with ${site.name} on WhatsApp`;
