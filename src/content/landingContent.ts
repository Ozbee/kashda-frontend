export const navLinks = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Team", href: "#team" },
] as const;

export const heroSlides = [
  {
    image: "/assets/landing/hero-city.jpg",
    headline: "Simplify Revenue Collection in Ghana.",
    subtext:
      "Manage your property rate with ease. Secure, fast, and reliable mobile money payments.",
    cta: { label: "Get Started", href: "/register" },
  },
  {
    image: "/assets/landing/hero-mobile.jpg",
    headline: "Pay Property Rate in Minutes.",
    subtext:
      "Pay via MTN MoMo, Telecel Cash, or AT Mobile Money — anytime, anywhere.",
    cta: { label: "Create Account", href: "/register" },
  },
  {
    image: "/assets/landing/hero-property.jpg",
    headline: "Track Bills. Get SMS Alerts.",
    subtext:
      "View payment history, receive bill reminders, and download receipts instantly.",
    cta: { label: "Sign In", href: "/login" },
  },
] as const;

export const quickLinks = [
  {
    label: "Pay Property Rate",
    description: "Settle your bill via MoMo",
    href: "/register",
    icon: "payment" as const,
  },
  {
    label: "Track Bills",
    description: "View history and status",
    href: "/login",
    icon: "receipt" as const,
  },
  {
    label: "Get Support",
    description: "Help when you need it",
    href: "/login",
    icon: "support" as const,
  },
  {
    label: "Create Account",
    description: "Register in minutes",
    href: "/register",
    icon: "account" as const,
  },
] as const;

export const revenueFeatures = [
  {
    title: "Easy Payment",
    desc: "Pay via MTN, Telecel, or AT Mobile Money",
    image: "/assets/landing/feature-payment.jpg",
    icon: "payment" as const,
  },
  {
    title: "Track Bills",
    desc: "View history and payment status anytime",
    image: "/assets/landing/feature-bills.jpg",
    icon: "receipt" as const,
  },
  {
    title: "SMS Alerts",
    desc: "Bill reminders and payment confirmations",
    image: "/assets/landing/feature-sms.jpg",
    icon: "sms" as const,
  },
] as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Register",
    description:
      "Create your account with your phone number and property details.",
    icon: "register" as const,
  },
  {
    step: 2,
    title: "Verify OTP",
    description: "Confirm your identity with a secure SMS verification code.",
    icon: "verify" as const,
  },
  {
    step: 3,
    title: "View Bill",
    description: "See your property rate breakdown, arrears, and due dates.",
    icon: "bill" as const,
  },
  {
    step: 4,
    title: "Pay via MoMo",
    description:
      "Approve payment on your phone through your mobile money network.",
    icon: "momo" as const,
  },
] as const;

export const whyKashdaItems = [
  {
    title: "Secure Mobile Money",
    description:
      "Payments processed through trusted MoMo networks with encrypted transactions.",
    icon: "security" as const,
  },
  {
    title: "Ghana Post GPS",
    description:
      "Register your property using Ghana Post GPS, pin location, or map links.",
    icon: "location" as const,
  },
  {
    title: "SMS Receipts",
    description: "Instant SMS confirmations and downloadable payment receipts.",
    icon: "sms" as const,
  },
  {
    title: "24/7 Self-Service",
    description:
      "Manage bills, payments, and profile anytime from your dashboard.",
    icon: "clock" as const,
  },
] as const;

export const visionContent = {
  title: "Our Vision",
  paragraphs: [
    "KASHDA is building accessible digital revenue collection for Ghana — starting with property rate. We believe every property owner deserves a simple, transparent way to pay government obligations without queues or paperwork.",
    "By connecting mobile money to municipal billing, we promote financial inclusion and help local authorities collect revenue efficiently while giving citizens full visibility into their payment history.",
  ],
  aboutTitle: "About KASHDA",
  aboutText:
    "KASHDA empowers Ghanaian property owners to manage rate payments through a secure, mobile-first platform. Pay with MoMo, track bills, and receive SMS alerts — all in one place.",
} as const;

export const teamMembers = [
  { name: "David" },
  { name: "Albert" },
  { name: "Samuel" },
  { name: "Kwakye" },
] as const;

export const futureModules = [
  "Savings",
  "Investments",
  "Insurance",
  "Pension",
] as const;

export const authTagline = {
  headline: "Revenue collection made simple.",
  subtext: "Secure property rate payments for every Ghanaian property owner.",
  image: "/assets/landing/auth-panel.jpg",
} as const;

export const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Support", href: "/login" },
] as const;
