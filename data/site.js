// SERVICES — lives here in site.js: the single source of truth.
// To add a service, append ONE object to this array. Home, services page,
// detail pages, work grid and footer all render from it, so nothing else changes.
export const services = [
  {
    slug: "backdrop-decoration",
    title: "Backdrop Decoration",
    blurb: "Elegant backdrops for ceremonies and receptions.",
    icon: "backdrop",
    image: "/flower.png",
    gallery: [{ featured: true, src: "/flower.png", caption: "Backdrop decoration" }],
    details: [
      "Backdrops draped with fresh flowers and fabric that photograph beautifully for your ceremony.",
      "Tell us your venue dimensions — we design a backdrop that fits your space perfectly."
    ],
    whyUs: [
      "Fresh flowers and fabric chosen on the day",
      "Designed to fit your venue dimensions",
      "Photographs beautifully from every angle"
    ]
  },
  {
    slug: "garlands",
    title: "Garlands",
    blurb: "Fresh garlands, veni and hair flowers for the day.",
    icon: "garland",
    image: "/flower.png",
    gallery: [{ featured: true, src: "/flower.png", caption: "Fresh jasmine strands" }],
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
    slug: "corporate-events",
    title: "Corporate Events",
    blurb: "Professional event decoration for corporate functions and galas.",
    icon: "stage",
    image: "/flower.png",
    gallery: [{ featured: true, src: "/flower.png", caption: "Corporate stage" }],
    details: [
      "Professional styling for corporate galas, product launches and conferences.",
      "Brand-aligned decor that makes your event memorable."
    ],
    whyUs: [
      "Brand-aligned decor that makes your event memorable",
      "Setup and teardown handled professionally",
      "Fresh flowers chosen to match your branding"
    ]
  }
];


// ── PUBLIC CONFIG — edit values here ──────────────────────────────
// WhatsApp number in international format (no +, no spaces).
export const WA_NUMBER = "919342780445";

export function getWaNumber() {
  return site.whatsappNumber || WA_NUMBER;
}

// Route paths live here too — no href literals in components.
export function serviceHref(slug) {
  return `${site.servicesPage.href}/${slug}`;
}

export function clientHref(slug) {
  return `${site.clients.href}/${slug}`;
}

export const site = {
  name: "3Knotts",
  tagline: "We turn your dreams into reality",
  taglinePrefix: "We turn your",
  taglineSuffix: "into reality",
  taglineRotations: ["dreams", "ideas", "visions"],
  url: "https://allinonedreamplace.in",
  homeHref: "/",
  locale: "en_IN",
  lang: "en",

  address: "No. 10/14, Near BCS Jain School, Washermanpet, Chennai - 600021, Tamil Nadu",
  whatsappNumber: "9342780445",
  addressParts: {
    street: "No. 10/14, Near BCS Jain School, Washermanpet",
    locality: "Chennai",
    postal: "600021",
    region: "Tamil Nadu",
    country: "IN"
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=No.+10%2F14+Near+BCS+Jain+School+Washermanpet+Chennai+600021",
  mapsLabel: "Open in Google Maps",

  instagram: "https://www.instagram.com/3knotts/",
  // Base used to build per-reviewer profile links from saved handles.
  instaUrl: "https://www.instagram.com/",
  instagramLabel: "Instagram",
  instagramHandle: "@3knotts",

  logo: "/logo-redesign.png",
  logoSm: "/logo-sm.png",
  logoAlt: "3Knotts logo",
  divider: "/partition.svg",
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
    tabs: { enquiries: "Enquiries", email: "Email", settings: "Settings", chatbot: "Chatbot", hero: "Hero Slides", services: "Services", clients: "Clients", account: "Account", about: "About Us" },
    tabOrder: ["enquiries", "email", "settings", "chatbot", "home", "services", "clients", "about", "account"],
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
      taglinePrefix: "Tagline prefix (before rotating word)",
      taglineSuffix: "Tagline suffix (after rotating word)",
      taglineRotations: "Rotating words (comma-separated)",
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
      instaLabel: "Reviewer's Instagram (optional)",
      instaPlaceholder: "e.g. @priya_creates — leave empty to skip",
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
      webpNote: "Any photo works — new uploads are converted to WebP.",      headingLabel: "Heading",
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
    viewLive: "View live site",
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
      webpNote: "Any photo works — new uploads are converted to WebP.",
      replace: "Replace",
      uploading: "Uploading…",
      uploaded: "Photo uploaded.",
      add: "Add slide",
      save: "Save slides",
      saved: "Hero slides saved.",
      remove: "Remove slide",
      taglineTitle: "Hero Tagline",
      taglineHint: "The animated text shown over the videos. The rotating word cycles through the list below.",
      taglinePrefix: "Text before rotating word",
      taglineSuffix: "Text after rotating word",
      taglineRotations: "Rotating words (comma-separated)"
    },
    emailMgr: {
      title: "Enquiry Email",
      intro: "Send every website enquiry straight to your email inbox through Web3Forms. Create the free access key at web3forms.com with your email, then paste it here. While a key is on file, every enquiry is emailed automatically — remove the key to stop. Below it, set the business Gmail address shown in the Enquiry page's contact panel.",
      keyLabel: "Web3Forms access key",
      keyPlaceholder: "e.g. 9b06c1af-2c31-42a7-9e12-1c8d5e7f9a02",
      keyKeep: "Leave empty to keep the key on file — paste to replace",
      onFile: "Key on file",
      save: "Save changes",
      saved: "Email settings saved.",
      test: "Send test email",
      testing: "Sending test email…",
      testSent: "Test email sent — check the inbox.",
      noKey: "Paste an access key first.",
      remove: "Remove key",
      removeConfirm: "Remove the access key and the Gmail address? Enquiry emails stop until a new key is saved.",
      removed: "Email settings cleared.",
      gmailLabel: "Business Gmail address",
      gmailNote: "Shown as a Gmail row in the Enquiry page contact panel. Empty hides the row.",
      gmailPlaceholder: "e.g. dreamplacechennai@gmail.com",
      errors: {
        badRequest: "Bad request.",
        noKey: "Add an access key first.",
        wrongFormat: "That does not look like a Web3Forms access key.",
        badGmail: "That does not look like a valid email address.",
        failed: "Could not save email settings.",
        testFailed: "Test email failed — Web3Forms said:",
        deleteFailed: "Could not remove the key."
      }
    },
    settingsMgr: {
      title: "Site Settings",
      intro: "WhatsApp number, business address and hours shown across the public site. Leave a field empty to fall back to the default.",
      whatsappLabel: "WhatsApp number",
      whatsappPlaceholder: "e.g. 9342780445",
      whatsappNote: "International format, no + or spaces. Used for the WhatsApp chat link.",
      addressLabel: "Business address",
      addressPlaceholder: "Full address shown in the footer and enquiry page",
      hoursDaysLabel: "Business days",
      hoursDaysPlaceholder: "e.g. Monday – Sunday",
      hoursTimeLabel: "Business hours",
      hoursTimePlaceholder: "e.g. 7:00 AM – 8:30 PM",
      save: "Save settings",
      saved: "Settings saved."
    },
    chatbotMgr: {
      title: "Chatbot",
      intro: "A floating assistant on every page. Visitors can request a service through your guided questions or ask free questions answered from the paragraph below. The Groq API key is stored in the database and never shown to visitors.",
      enabledLabel: "Show the chatbot on the site",
      apiKeyLabel: "Groq API key",
      apiKeyPlaceholder: "gsk_...",
      apiKeyNote: "Sent to Groq only from the server. Never exposed to visitors.",
      modelLabel: "Model",
      modelPlaceholder: "e.g. openai/gpt-oss-120b",
      modelNote: "Any Groq model id. Lower-tier models cost less per message.",
      paragraphLabel: "Assistant knowledge paragraph",
      paragraphPlaceholder: "What the assistant knows: services, style, pricing policy, booking flow...",
      paragraphNote: "Fed to the assistant as its instructions for free questions. Keep it current.",
      welcomeLabel: "Welcome message",
      welcomePlaceholder: "Hi! Welcome to 3Knotts. How can we help?",
      questionsLabel: "Guided questions",
      questionsNote: "Asked one by one after a visitor taps I need a service. When the last one is answered, the chat locks and the visitor sends the answers to your WhatsApp number.",
      questionPlaceholder: "e.g. What is your name?",
      typeLabel: "Input type",
      questionOf: "Question {n} of {total}",
      typeOptions: { text: "Text answer", services: "Service list", date: "Date picker" },
      addQuestion: "Add question",
      remove: "Remove",
      save: "Save chatbot",
      saved: "Chatbot saved."
    },
    clientsMgr: {
      title: "Clients",
      intro: "A Clients section is being built for the site. Switch it on to show the Clients link in the menu and open the page. Switch it off while the content comes together — both the link and the page stay hidden.",
      visibleLabel: "Show Clients to visitors",
      note: "Off hides both the menu link and the /clients page.",
      save: "Save changes",
      saved: "Clients settings saved."
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
      shotsMax: "Maximum 15 photos per list.",
      webpNote: "Any photo works — new uploads are converted to WebP.",
      galleryRule: "Each service holds up to 15 photo shots (star the ones to feature in Our Work) plus up to 15 Client photos for the Clients page — 30 photos in total.",
      featuredShot: "Featured in Our Work",
      featuredService: "Featured on home",
      addLine: "Add line",
      addShot: "Add shot",
      clientLabel: "Client photos (Clients page)",
      clientNote: "A separate photo set shown on the service's own page in the Clients section. Caption = slide title (max 4 words); the sentence becomes the slide description, and slides without one fall back to the service blurb. The shots above stay on the service page and in Our Work.",
      clientDescLabel: "Slide sentence (optional)",
      remove: "Remove",
      replaceImage: "Replace photo",
      uploading: "Uploading…",
      uploaded: "Photo uploaded.",
      back: "Back to services",
      delTitle: "Delete this service?",
      delBody: "This permanently removes the service, its page, and its photos from ImageKit. This cannot be undone.",
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
      noFile: "No file received.",
      tooLarge: "That photo is too large. Please use one under 12 MB.",
      notImage: "That file is not a readable image.",
      uploadFailed: "Upload failed.",
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
    sliderNext: "Next slide",
    instaProfile: "Open Instagram profile in a new tab"
  },
  whatsappGreeting: "Hello 3Knotts! I'd like to plan a celebration.",

  // Seed values for the chatbot content key. Admin edits all of it in
  // the dashboard Chatbot tab; apiKey is fetched only by the server.
  chatbotDefaults: {
    enabled: false,
    apiKey: "",
    model: "openai/gpt-oss-120b",
    chatParagraph: "",
    welcomeMessage: "Hi! Welcome to 3Knotts. How can we help you today?",
    questions: [
      { text: "What is your name?", type: "text" },
      { text: "Which service do you need?", type: "services" },
      { text: "What is the date of the function?", type: "date" },
      { text: "Anything else we should know?", type: "text" }
    ]
  },

  // Public floating chat widget copy (wine-scoped chrome).
  chatWidget: {
    openLabel: "Chat with us",
    closeLabel: "Close chat",
    clearLabel: "Clear chat",
    title: "3Knotts Assistant",
    menuNote: "Choose how we can help you.",
    needService: "I need a service",
    askQuestion: "Ask a question",
    askIntro: "Go ahead, ask me anything about our services.",
    askUnavailable: "Ask-a-question is unavailable right now.",
    questionOf: "Question {n} of {total}",
    typing: "Typing...",
    dateOk: "OK",
    placeholder: "Type your message...",
    send: "Send",
    error: "Could not reach the assistant. Please try again or use WhatsApp.",
    doneNote: "Your answers are ready. Send them to us on WhatsApp.",
    enquire: "Enquire on WhatsApp",
    handoffIntro: "New website chat enquiry - 3Knotts",
    handoffAnswers: "Service request",
    handoffChat: "Questions asked",
    youLabel: "Visitor",
    botLabel: "Assistant"
  },


  // WhatsApp enquiry message template (field labels + empty marker).
  waMsg: {
    intro: "Hello 3Knotts!",
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
    title: "3Knotts — Event Decoration & Gifting in Chennai",
    description: "Your Celebration, Our Creation. Plates, hampers, stalls, garlands, ring platters, stage and home decoration in Chennai.",
    ogTitle: "3Knotts — Your Celebration, Our Creation",
    ogDescription: "Event decoration and gifting in Chennai — plates, hampers, stalls, garlands, stages and home styling."
  },

  nav: [
    { label: "Services", href: "/services" },
    { label: "Clients", href: "/clients" },
    { label: "About Us", href: "/about" }
  ],
  navCta: { label: "Enquire", href: "/enquire" },
  menuOpenLabel: "Close",
  menuClosedLabel: "Menu",

  hero: {
    // Local placeholders for now — replace from the dashboard later.
    // Each slide: { src, alt }. src may be a /public path or a
    // ImageKit path (resolved by lib/media.js).
    slides: [
      { src: "/flower.png", alt: "Celebration table styling" },
      { src: "/flower.png", alt: "Floral decoration detail" },
      { src: "/flower.png", alt: "Event stage flowers" },
      { src: "/flower.png", alt: "Festive home entrance" }
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
    emailInstead: "Email instead",
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
      { quote: "The aarathi plates looked straight out of a film set. Our guests kept asking where we got them.", name: "Priya & Karthik", detail: "Wedding · Chennai", insta: "" },
      { quote: "They packed forty hampers and every single one looked identical. Impeccable finishing.", name: "Deepa S.", detail: "Diwali Gifting", insta: "" },
      { quote: "The mehendi and bangle stalls kept our guests busy for hours. Best decision of the wedding.", name: "Anitha R.", detail: "Wedding · Washermanpet", insta: "" },
      { quote: "Our home looked magical for the festival, and they cleared everything the same night.", name: "Revathi M.", detail: "Housewarming · Chennai", insta: "" }
    ]
  },

  clients: {
    // Visibility toggle for the Clients section: the dashboard Clients
    // tab switches it; the nav link and the page follow. Hide state is
    // enforced server-side — the page itself becomes unreachable too.
    heading: "Our Clients",
    href: "/clients",
    intro: "The families and companies who celebrate with us.",
    label: "Clients",
    backLabel: "All clients",
    // Individual /clients/[slug] pages follow the /services/[slug]
    // detail-page format, with the client gallery in the showcase.
    showcaseHeading: "Client moments",
    showcaseIntro: "Real captures from the celebrations we styled for our clients.",
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
      "3Knotts is an event decoration and gifting studio in Washermanpet, Chennai. Your Celebration, Our Creation — we dress aarathi plates and stages, pack hampers and trousseaus, run festive stalls, and style homes for weddings, festivals and family functions.",
      "This is personal work. When you hand us your function, you hand us your family's happiest day — and we carry it like our own. Most of our planning happens on WhatsApp: share your date, venue and function, and we call back with ideas and a clear quotation."
    ]
  },

  brand: {
    heading: "Made for your moments",
    text: "3Knotts is a decoration and gifting studio in Washermanpet, Chennai — plates, hampers, stalls, garlands, stages and warm home styling, all made by hand for your function.",
    cta: { label: "More about us", href: "/about" }
  },

  serviceIcons: ["plate", "hamper", "stall", "kitchen", "gift", "garland", "ring", "stage", "home"],

  featuredServices: [
    "backdrop-decoration",
    "garlands",
    "corporate-events"
  ],

  cta: {
    heading: "Let's plan your celebration",
    text: "Share your date and function — we reply with ideas and a clear quotation."
  },

  servicesPage: {
    breadcrumbHome: "Home",
    href: "/services",
    abstract: "{count} {craft}, one studio — every plate dressed, every hamper packed, every stage raised by hand in Chennai. Open any service to see what it holds.",
    viewAll: "View all services",
    exploreLabel: "Explore",
    whyHeading: "Why book this with us",
    showcaseHeading: "Keep exploring",
    showcaseIntro: "More crafts from the studio — open any one to see it up close."
  }
};

export const floatingAriaLabel = `Chat with ${site.name} on WhatsApp`;

// The count is always fetched live from the backend (getServices) and
// passed in, so this stays correct as services are added or removed.
export function servicesAbstract(count) {
  const n = Math.max(0, Number(count) || 0);
  return site.servicesPage.abstract
    .replace("{count}", String(n))
    .replace("{craft}", n === 1 ? "craft" : "crafts");
}
