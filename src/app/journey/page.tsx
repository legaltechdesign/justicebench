// src/app/journey/page.tsx
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Access to Justice Journey — JusticeBench',
  description:
    'Learn the basics of how legal problems play out in people\'s lives, the common stages of a justice journey, and the workflows of service providers who help resolve legal problems.',
}

export default function JourneyPage() {
  return (
    <main className="font-sans">
      {/* Hero */}
      <section className="bg-navy py-14 px-6 sm:px-10 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-medium text-peach mb-3">
            <Link href="/" className="hover:underline">JusticeBench</Link> / Learn
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            The Access to Justice Domain
          </h1>
          <p className="text-white/80 mb-8 max-w-3xl mx-auto text-lg">
            Are you a technologist, researcher, data scientist, or professional who is new to the world
            of legal aid, courts, and civil legal problems? Learn the basics of what a person&rsquo;s
            journey looks like — and how service providers work to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#person-journey" className="inline-block bg-peach text-navy font-semibold px-6 py-3 rounded-lg hover:bg-white transition">
              Person&rsquo;s Journey ↓
            </a>
            <a href="#provider-workflow" className="inline-block border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:border-peach hover:text-peach transition">
              Provider Workflows ↓
            </a>
            <Link href="/task" className="inline-block border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:border-peach hover:text-peach transition">
              Task Taxonomy →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Person's Justice Journey ═══ */}
      <section id="person-journey" className="bg-white py-16 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-navy mb-10 text-center">
            Common Stages of a Person&rsquo;s Justice Journey
          </h2>

          <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            <strong>How does a legal problem play out in a person&rsquo;s life?</strong> Different
            legal problems — eviction, debt collection, divorce, driver&rsquo;s license suspension, or
            other disputes — often follow the same 7 stages.
          </p>
          <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Use this overview to understand where AI might help a person. Then{' '}
            <Link href="/task" className="text-navy underline">
              explore the Task Taxonomy
            </Link>{' '}
            to see the specific AI opportunities at each stage.
          </p>

          <figure className="my-8">
            <Image
              src="/images/user-workflow.png"
              alt="User justice journey overview"
              width={2400}
              height={1400}
              className="w-full h-auto rounded-xl shadow"
              sizes="(min-width: 1280px) 72rem, 100vw"
              priority
            />
            <figcaption className="text-center text-xs text-gray-500 mt-2">
              Overview of the person&rsquo;s justice journey stages.
            </figcaption>
          </figure>

          <div className="grid justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                title: 'Awareness Stage',
                description:
                  'As a conflict brews, the person begins to recognize that they might need legal help to deal with it. They begin to seek out help online, through friends, or by contacting a service provider.',
                icon: '/icons/awareness.png',
              },
              {
                title: 'Orientation Stage',
                description:
                  'The person gets a diagnosis of the exact legal scenario they are in, what the law says about their rights, what options they have, and what services can help.',
                icon: '/icons/orientation.png',
              },
              {
                title: 'Strategy Stage',
                description:
                  'The person decides how they want to handle the problem. They weigh their goals, rights, and risks. They choose what path to take and get a plan of action — including paperwork, research, hearings, meetings, and more.',
                icon: '/icons/strategy.png',
              },
              {
                title: 'Work Product Stage',
                description:
                  'The person drafts documents and forms to file, researches the law, gathers and organizes evidence, responds to requests, makes requests of the other side, and crafts talking points.',
                icon: '/icons/work-product.png',
              },
              {
                title: 'Engagement Stage',
                description:
                  'The person completes all of the steps, deadlines, and procedural requirements. They file things on time, make payments or get fee waivers, attend required meetings and hearings, and stay updated on their case progress and obligations.',
                icon: '/icons/engagement.png',
              },
              {
                title: 'Present and Negotiate Stage',
                description:
                  'The person presents their case to the judge or decisionmaker, answers questions, and interacts with the other party. They may also negotiate with the other side, and respond to settlement offers.',
                icon: '/icons/presentation.png',
              },
              {
                title: 'Follow-Through Stage',
                description:
                  'After a decision or settlement, the person must ensure they understand what the final arrangement is and how to live up to it (or enforce it). They may need to comply with orders, secure what they won, or clear their record to prevent collateral consequences.',
                icon: '/icons/follow.png',
              },
            ].map((step) => (
              <div
                key={step.title}
                className="bg-peach-extra-light rounded-xl shadow hover:shadow-lg transition overflow-hidden max-w-[300px] mx-auto"
              >
                <div className="relative w-full h-40">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-navy bg-opacity-80 text-white text-center px-2 py-2 text-xl font-semibold">
                    {step.title}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-xs leading-snug">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Provider Workflows ═══ */}
      <section id="provider-workflow" className="bg-peach-extra-light py-16 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-navy mb-4 text-center">
            Service Providers&rsquo; Workflows
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Legal aid groups, court help centers, pro bono clinics, and other justice workers have
            common clusters of tasks. These tasks relate to the front-facing services or back-end
            operations of providing legal help to the public.
          </p>

          <figure className="my-8">
            <Image
              src="/images/provider-workflow.png"
              alt="Provider journey overview"
              width={2400}
              height={1400}
              className="w-full h-auto rounded-xl shadow"
              sizes="(min-width: 1280px) 72rem, 100vw"
            />
            <figcaption className="text-center text-xs text-gray-500 mt-2">
              Overview of the service provider&rsquo;s workflow, tasks along the justice journey.
            </figcaption>
          </figure>

          <div className="grid justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                title: 'Outreach & Education',
                description:
                  'The provider tries to connect with the right audience — raising awareness, providing legal information, building trust, and helping people recognize legal issues and seek help.',
                icon: '/icons/outreach-icon.png',
              },
              {
                title: 'Screening & Triage',
                description:
                  "The provider attempts to understand each person's background and legal issue to determine if and how the organization can help. This includes routing people to services, guides, or referrals.",
                icon: '/icons/screen-icon.png',
              },
              {
                title: 'Tailored Advice',
                description:
                  "The provider provides the user with detailed, custom advice on their legal options, risks, and next steps. Advice is specific to the user's goals, context, and documents — and designed to support informed decisions.",
                icon: '/icons/advice-icon.png',
              },
              {
                title: 'Work Product & Legal Research',
                description:
                  'The provider researches the law, drafts and files documents, analyzes legal options, collects evidence, and keeps them on track with deadlines and next steps.',
                icon: '/icons/work-icon.png',
              },
              {
                title: 'Coaching & Support',
                description:
                  'The provider gives ongoing encouragement, legal education, and guidance throughout the justice journey, so users stay involved and making informed decisions.',
                icon: '/icons/coach-icon.png',
              },
              {
                title: 'Present & Negotiate',
                description:
                  'The provider presents the case to the judge or decisionmaker, answers questions, and interacts with the other party. They may also negotiate with the other side, and respond to settlement offers.',
                icon: '/icons/present-negotiate.png',
              },
              {
                title: 'Administration & Strategy',
                description:
                  'The provider monitors cases and outcomes overall, manages staff and reporting, spots patterns, operates tech, and identifies areas for service improvement, policy change, strategic litigation, or tech innovation.',
                icon: '/icons/admin-icon.png',
              },
            ].map((step) => (
              <div
                key={step.title}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden max-w-[300px] mx-auto"
              >
                <div className="relative w-full h-40">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-navy bg-opacity-80 text-white text-center px-2 py-2 text-xl font-semibold">
                    {step.title}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-xs leading-snug">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA to Tasks ═══ */}
      <section className="bg-navy py-14 px-6 sm:px-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Explore the Task Taxonomy
          </h2>
          <p className="text-white/80 mb-8">
            Across all different problem types and geographies, what specific tasks can AI do to
            improve how people get legal help and how providers serve people? Explore the full
            taxonomy of 30+ AI tasks organized by workflow stage.
          </p>
          <Link
            href="/task"
            className="inline-block bg-peach text-navy font-semibold px-8 py-3 rounded-lg hover:bg-white transition text-lg"
          >
            View All Tasks →
          </Link>
        </div>
      </section>
    </main>
  )
}
