import { useEffect } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  BarChart3,
  Copy,
  IndianRupee,
  Layers,
  ScrollText,
  Users,
} from 'lucide-react';

const PAGE_TITLE = 'Khata — Free Profit Tracking App for CSC, VLE & Cyber Café Owners';
const PAGE_DESCRIPTION =
  'Khata is a free profit-tracking app built for Common Service Centre (CSC) operators, Village Level Entrepreneurs (VLE) and cyber café owners in India. Track Aadhaar, PAN, printing and bill-payment sales and see your real daily profit — in English, हिन्दी or বাংলা.';

const AUDIENCE = [
  { icon: ScrollText, label: 'CSC operators' },
  { icon: Users, label: 'VLEs' },
  { icon: Copy, label: 'Cyber café & Xerox shop owners' },
  { icon: IndianRupee, label: 'Aadhaar / PAN service agents' },
];

const STEPS = [
  {
    title: 'Add your services once',
    body: "Set the price you charge and the cost you pay for each service — Aadhaar update, PAN card, printouts, bill payments. E.g. Aadhaar update: charge ₹50, cost ₹30.",
  },
  {
    title: 'Log a sale in two taps',
    body: 'Pick the service, tap done. No maths, no calculator, no separate notebook.',
  },
  {
    title: "See today's real profit",
    body: 'Khata subtracts your portal cost from every sale automatically, instantly.',
  },
];

const FEATURES = [
  {
    icon: Layers,
    title: 'Bulk quantity scaling',
    body: '40 photocopies or prints in one go? Enter the quantity once — Khata multiplies the charge and cost for you.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard at a glance',
    body: "Today's profit, collections and total sales, right at the top every time you open Khata.",
  },
  {
    icon: IndianRupee,
    title: 'Profit trend reports',
    body: 'See which days and which services (Aadhaar, PAN, DBT, recharge) actually make you money.',
  },
  {
    icon: ScrollText,
    title: 'Expense tracking',
    body: 'Rent, electricity, printer ink, internet recharge — track the full picture, not just sales.',
  },
  {
    icon: Users,
    title: 'One login, many staff',
    body: 'Your helper or counter staff can log sales too — everything lands in the same shared khata.',
  },
];

const FAQS = [
  {
    q: 'Is Khata free for CSC and VLE centres?',
    a: 'Yes. Khata is completely free to use for Common Service Centre operators, Village Level Entrepreneurs, cyber cafés and any shop that resells government or digital services.',
  },
  {
    q: 'Does Khata work for Aadhaar, PAN, DBT and bill payment services?',
    a: 'Yes. You add each service you sell with its charge and cost — Aadhaar update, PAN card, voter ID, bill payments, printing, recharge — and Khata tracks the profit on every one automatically.',
  },
  {
    q: 'Can I use Khata in Hindi or Bengali?',
    a: 'Yes. Khata works in English, हिन्दी (Hindi) and বাংলা (Bengali). You can switch languages any time from inside the app.',
  },
  {
    q: 'Do I need a computer expert to set it up?',
    a: 'No. Khata is built to be set up by the shop owner in a few minutes — add your services once, then it is two taps per sale.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="text-[14.5px] font-semibold text-ink-700 hover:text-ink-900">
      {children}
    </a>
  );
}

export function LandingPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = PAGE_TITLE;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    const prevDescription = descriptionMeta?.getAttribute('content') ?? null;
    descriptionMeta?.setAttribute('content', PAGE_DESCRIPTION);

    return () => {
      document.title = prevTitle;
      if (prevDescription !== null) descriptionMeta?.setAttribute('content', prevDescription);
    };
  }, []);

  return (
    <div className="min-h-svh bg-cream text-ink-900">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="sticky top-0 z-10 border-b border-border-soft bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-base font-extrabold text-white">
              ख
            </span>
            <span className="text-lg font-extrabold tracking-tight">Khata</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm font-semibold text-ink-700 hover:text-ink-900 sm:inline">
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-600"
            >
              Try it free
            </Link>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 pt-12 pb-14 sm:px-8 sm:pt-16 lg:pt-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
            <div>
              <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1.5 text-[13px] font-bold text-brand-600">
                Free forever · Built for CSC &amp; VLE centres
              </span>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                You collected ₹4,300 today.
                <br />
                <span className="text-brand-600">How much did you keep?</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-ink-700">
                Khata is a free profit-tracking app built for{' '}
                <strong className="text-ink-900">Common Service Centre (CSC)</strong> operators,{' '}
                <strong className="text-ink-900">Village Level Entrepreneurs (VLE)</strong> and{' '}
                <strong className="text-ink-900">cyber café owners</strong> across India. It subtracts your
                Aadhaar, PAN, printing and bill-payment portal cost from every sale — so you see the real
                profit in your pocket, not just the cash in the drawer.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  to="/signup"
                  className="flex items-center gap-2 rounded-xl bg-brand-500 px-7 py-4 text-base font-bold text-white shadow-sm hover:bg-brand-600"
                >
                  Try it free <ArrowRight size={18} />
                </Link>
                <span className="text-sm text-ink-600">No credit card. Built for a real CSC counter.</span>
              </div>

              <ul className="mt-9 flex flex-wrap gap-2.5" aria-label="Built for">
                {AUDIENCE.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 py-1.5 text-[13px] font-semibold text-ink-700"
                  >
                    <Icon size={14} className="text-brand-600" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border-soft bg-surface p-6 shadow-sm sm:p-7">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-ink-600">Today · आज · আজ</span>
                <span className="rounded-full bg-success-bg px-2.5 py-1 text-xs font-extrabold text-success-600">
                  ● LIVE
                </span>
              </div>
              <div className="mb-0.5 text-sm font-bold text-ink-600">Real profit kept</div>
              <div className="text-5xl font-extrabold tracking-tight tabular-nums sm:text-6xl">₹1,240</div>
              <div className="my-5 h-px bg-border-soft" />
              <dl className="space-y-3 text-base">
                <div className="flex justify-between">
                  <dt className="text-ink-700">Cash collected</dt>
                  <dd className="font-bold tabular-nums">₹4,300</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-700">Portal &amp; supply cost</dt>
                  <dd className="font-bold tabular-nums text-cost-600">− ₹3,060</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-700">Transactions</dt>
                  <dd className="font-bold tabular-nums">37</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="border-y border-border-soft bg-tablehead px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3.5 text-[13px] font-extrabold tracking-[.08em] text-brand-600">
              THE REAL PROBLEM FOR CSC &amp; VLE CENTRES
            </div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Counting cash isn&rsquo;t the same as knowing your profit
            </h2>
            <p className="mt-4 text-lg text-ink-700">
              At night you count the drawer. ₹4,300 — feels like a good day. But you paid the portal ₹35 for
              that PAN card, ₹30 for every Aadhaar update, plus paper and ink for the prints. So what is
              actually <strong className="text-ink-900">yours</strong>? Most khatas (ledgers) track what came
              in. Almost none track what a CSC or VLE operator got to keep.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="mb-11 text-center">
            <div className="mb-2.5 text-[13px] font-extrabold tracking-[.08em] text-brand-600">
              HOW IT WORKS
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Set up once. Two taps a sale.
            </h2>
          </div>
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-2xl border border-border-soft bg-surface p-6"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-extrabold text-white ${
                    i === 2 ? 'bg-brand-500' : 'bg-ink-900'
                  }`}
                >
                  {i + 1}
                </div>
                <div className="mb-1.5 text-lg font-extrabold">{step.title}</div>
                <p className="text-[15px] text-ink-700">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Features */}
        <section id="features" className="border-y border-border-soft bg-tablehead px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-11 text-center">
              <div className="mb-2.5 text-[13px] font-extrabold tracking-[.08em] text-brand-600">
                EVERYTHING IN ONE PLACE
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Made for how your shop runs
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-border-soft bg-surface p-6">
                  <Icon size={20} className="mb-3 text-brand-600" aria-hidden="true" />
                  <div className="mb-1.5 text-base font-extrabold">{title}</div>
                  <p className="text-[14.5px] text-ink-700">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <div className="mb-2.5 text-[13px] font-extrabold tracking-[.08em] text-brand-600">
            YOUR SHOP, YOUR LANGUAGE
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Works in the language you think in
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="rounded-xl bg-brand-500 px-5 py-2.5 text-base font-bold text-white">English</span>
            <span className="rounded-xl border border-border-soft bg-surface px-5 py-2.5 text-base font-bold">
              हिन्दी
            </span>
            <span className="rounded-xl border border-border-soft bg-surface px-5 py-2.5 text-base font-bold">
              বাংলা
            </span>
          </div>
          <p className="mt-4 text-[15px] text-ink-700">
            Switch anytime. Built so a CSC or cyber café owner never has to fight the app.
          </p>
        </section>

        {/* Founder story */}
        <section className="bg-ink-900 px-5 py-16 text-cream sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 text-[13px] font-extrabold tracking-[.08em] text-brand-500">
              WHY I BUILT THIS
            </div>
            <p className="font-serif text-xl leading-relaxed sm:text-2xl">
              My father runs a cyber café. He didn&rsquo;t want another rigid app that assumed how his shop
              should work — he wanted something shaped around <em>his</em> counter, his services, his prices.
              So I built Khata for him first. It worked. Then I made it free, for every CSC and VLE
              shopkeeper like him.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-border-soft bg-surface p-5 open:pb-5"
              >
                <summary className="cursor-pointer text-base font-bold text-ink-900 marker:content-none">
                  {faq.q}
                </summary>
                <p className="mt-2.5 text-[15px] text-ink-700">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 py-20 text-center sm:px-8">
          <h2 className="text-4xl font-extrabold tracking-tight">Know what you actually keep</h2>
          <p className="mt-3 text-lg text-ink-700">Start today. It&rsquo;s free.</p>
          <Link
            to="/signup"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-9 py-4 text-base font-bold text-white shadow-sm hover:bg-brand-600"
          >
            Try it free <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <footer className="border-t border-border-soft px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-sm text-ink-600">
          <div className="text-base font-extrabold text-ink-900">Khata · खाता</div>
          <p>Built for Common Service Centres, VLEs and cyber cafés across India. Feedback from a real shop? We&rsquo;d love to hear it.</p>
        </div>
      </footer>
    </div>
  );
}
