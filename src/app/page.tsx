// src/app/page.tsx
import { sanityClient } from '@/lib/sanity'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { DatasetGrid } from '@/components/DatasetGrid'
import { ProjectGrid } from '@/components/ProjectGrid'


async function safeFetch<T>(query: string) {
  try {
    return await sanityClient.fetch<T>(query)
  } catch (err) {
    console.error('[Sanity fetch failed]', query, err)
    return [] as unknown as T
  }
}


type Dataset = SanityDoc
type Guide = SanityDoc

// Define types
interface SanityDoc {
  _id: string
  title: string
  slug?: {
    current: string
  }
  oneliner?: any // Portable Text
  image?: {
    asset: {
      _id: string
      url: string
    }
  }
  link?: string
  datasetType?: string
}

// Fetch all categories in parallel
export default async function Home() {
  const [projects, datasets, guides] = await Promise.all([
sanityClient.fetch(`*[_type == "project"]{
  _id,
  title,
  slug,
  "issue": issue->{
  title,
  slug,
   sortOrder,      
  icon{asset->{url}},
  oneLiner,
  description
},
  "oneliner": oneliner,
  image{ asset->{ url } },
  status->{ status, description, color, icon{asset->{url}} },

  category->{
    title, slug, sortOrder, icon{asset->{url}}, oneliner
  },

  // tasks kept for chips (not used for grouping)
  tasks[]->{ title, slug, icon{asset->{url}} }
}`),


    sanityClient.fetch(`*[_type == "dataset"]{
      _id,
      title,
      slug,
      datasetType,
      "oneliner": oneliner,
      image {
        asset->{
          _id,
          url
        }
      }
    }`),
    sanityClient.fetch(`*[_type == "guide"] | order(coalesce(sortOrder,9999) asc, title asc){
      _id, title, slug, link, "oneliner": oneliner, image{asset->{_id, url}}
    }`),
  ])

  return (
    <main className="font-sans">

<header className="relative isolate overflow-hidden min-h-[420px] sm:min-h-[480px] lg:min-h-[560px] pt-16 md:pt-24 pb-12">

  {/* Background image */}
  <Image
    src="/images/banner.png"
    alt=""
    fill
    priority
    sizes="100vw"
    className="object-cover object-center"
  />

  {/* Optional gradient scrim to further tame busy areas */}
  <div className="absolute inset-0 bg-gradient-to-b from-peach/50 via-peach/40 to-peach/20" aria-hidden />

  {/* Centered content container */}
  <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-center px-6">
    <div className="w-full max-w-3xl rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl ring-1 ring-black/5 p-6 sm:p-10 text-center">
      <h1 className="text-5xl md:text-6xl font-heading font-bold text-navy">
        JusticeBench
      </h1>

      <p className="mt-3 text-base md:text-xl text-gray-700">
        Explore What Is Being Built in Justice AI
      </p>

      <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
        Discover AI projects across the access to justice landscape, understand where they fit in the justice journey, and find data and evaluation tools to know if they work. JusticeBench is the discovery layer of the{' '}
        <Link href="https://legalhelpcommons.org" className="text-navy font-semibold underline underline-offset-2 hover:text-navy/80">
          Legal Help Commons
        </Link>.
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-peach-light px-4 py-2 text-sm font-medium text-navy">
        <span>🚧 The JusticeBench platform is under development. Please give us your feedback and ideas!</span>
        <Link
          href="https://docs.google.com/forms/d/e/1FAIpQLScxjzlRUOZcwSDI_Fq5WWDWatdPF-6JQ30VcNBpCEwlSHvTlw/viewform?usp=sharing&ouid=105527964805660002479"
          className="underline underline-offset-2"
        >
          Share feedback &amp; projects
        </Link>
      </div>
    </div>
  </div>
</header>

<section className="bg-navy px-6 py-16">
  <h2 className="text-5xl md:text-5xl font-heading font-bold text-white text-center mb-4">
    How to Use JusticeBench
  </h2>
  <p className="text-white text-center max-w-4xl mx-auto mb-10">
    JusticeBench is an R&amp;D platform for legal teams, technologists, researchers, and community members working on AI to advance access to justice. Explore the landscape here — then head to the{' '}
    <Link href="https://legalhelpcommons.org" className="underline underline-offset-2 text-peach hover:text-white">
      Legal Help Commons
    </Link>{' '}
    for implementation playbooks, working groups, and shared tools when you&rsquo;re ready to build.
  </p>

  {/* 2 columns on md, 4 on lg */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
    {/* Projects */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Link href="#projects">
        <div className="text-4xl mb-4" aria-hidden>🛠️</div>
        <h3 className="text-3xl font-bold text-navy mb-2">Projects</h3>
      </Link>
      <p className="text-gray-700">
        Explore prototypes, pilots, and proposals others are building to find inspiration, collaborators, or models.
      </p>
    </div>

    {/* Tasks */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Link href="#tasks">
        <div className="text-4xl mb-4" aria-hidden>🔍</div>
        <h3 className="text-3xl font-bold text-navy mb-2">Tasks</h3>
      </Link>
      <p className="text-gray-700">
        Explore specific use cases where AI can help improve access to justice. Scope what to work on — and where you fit in.
      </p>
    </div>

    {/* Datasets */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Link href="#datasets">
        <div className="text-4xl mb-4" aria-hidden>📊</div>
        <h3 className="text-3xl font-bold text-navy mb-2">Data & Eval</h3>
      </Link>
      <p className="text-gray-700">
        Share or use data to train, evaluate, and improve legal AI projects and performance standards.
      </p>
    </div>

    {/* Guides (new) */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Link href="#guides">
        <div className="text-4xl mb-4" aria-hidden>📚</div>
        <h3 className="text-3xl font-bold text-navy mb-2">Guides</h3>
      </Link>
      <p className="text-gray-700">
        Step-by-step playbooks and templates for planning, evaluating, and rolling out AI in justice institutions.
      </p>
    </div>
  </div>
</section>

{/* Commons callout */}
<section className="px-6 py-8">
  <div className="max-w-5xl mx-auto">
    <Link
      href="https://legalhelpcommons.org"
      className="group block rounded-2xl border-2 border-navy/10 bg-gradient-to-r from-peach-extra-light to-white p-6 sm:p-8 hover:shadow-lg hover:border-navy/20 transition"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-4xl" aria-hidden>🔧</div>
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-navy">
            Ready to build? Visit the Legal Help Commons
          </h3>
          <p className="mt-1 text-gray-600 text-sm sm:text-base">
            JusticeBench shows you what&rsquo;s possible. The Legal Help Commons shows you how to do it — with implementation playbooks, reference architectures, and working groups you can join today.
          </p>
        </div>
        <span className="text-navy font-heading font-bold text-lg group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  </div>
</section>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto my-8 px-6">
  {/* New to A2J teaser */}
  <Link
    href="/journey"
    className="group block rounded-2xl border border-navy/10 bg-peach-light p-6 hover:shadow-lg hover:border-navy/20 transition"
  >
    <h3 className="text-xl font-heading font-bold text-navy mb-2">
      New to Access to Justice?
    </h3>
    <p className="text-gray-600 text-sm mb-3">
      Learn how legal problems play out in people&rsquo;s lives, the 7 stages of a justice journey, and how service providers work to help.
    </p>
    <span className="text-navy text-sm font-semibold group-hover:underline">
      Explore the A2J domain →
    </span>
  </Link>

  {/* Tasks teaser */}
  <Link
    href="/task"
    className="group block rounded-2xl border border-navy/10 bg-peach-extra-light p-6 hover:shadow-lg hover:border-navy/20 transition"
  >
    <h3 className="text-xl font-heading font-bold text-navy mb-2">
      AI Task Taxonomy
    </h3>
    <p className="text-gray-600 text-sm mb-3">
      30+ specific tasks where AI can improve legal help — from document explanation to intake triage to case management. Organized by workflow stage.
    </p>
    <span className="text-navy text-sm font-semibold group-hover:underline">
      View all tasks →
    </span>
  </Link>
</div>


<section id="projects" className="bg-white py-16 px-6 sm:px-10">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-5xl font-heading font-bold text-navy mb-4 text-center">
      Projects
    </h2>
    <p className="text-gray-700 mb-10 text-center max-w-3xl mx-auto">
      What kinds of AI projects are already in the works to advance access to justice?
      Filter by issue area or project status to find what&rsquo;s relevant to your work.
    </p>

    <ProjectGrid projects={projects} />

    <p className="text-lg text-gray-500 max-w-2xl mt-8">
      <strong className="text-navy">Know of a project not listed here?</strong>{' '}
      <a href="https://docs.google.com/forms/d/e/1FAIpQLScxjzlRUOZcwSDI_Fq5WWDWatdPF-6JQ30VcNBpCEwlSHvTlw/viewform" className="underline text-navy hover:text-navy/70">
        Tell us about it.
      </a>
    </p>
  </div>
</section>







<section className="bg-navy px-10 py-16" id="datasets">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-5xl font-heading font-bold text-white mb-4 text-center">
      Data &amp; Evaluation
    </h2>
    <p className="text-white/80 text-center max-w-3xl mx-auto mb-10">
      Datasets, benchmarks, evaluation protocols, taxonomies, and leaderboards for building and testing legal AI. Use these to train models, measure performance, and establish quality standards.
    </p>

    <DatasetGrid datasets={datasets} />

    <p className="text-lg text-white/70 max-w-2xl mt-8">
      <strong className="text-white">Please share datasets</strong> with JusticeBench at{' '}
      <a href="https://docs.google.com/forms/d/e/1FAIpQLScxjzlRUOZcwSDI_Fq5WWDWatdPF-6JQ30VcNBpCEwlSHvTlw/viewform" className="underline text-peach hover:text-white">
        this form.
      </a>
    </p>
  </div>
</section>

<section className="bg-peach-extra-light px-10 pt-0 pb-16">
  <Section
    id="guides"
    title="Guides"
    bg="bg-peach-extra-light"
    description="How can you create an AI plan for your justice organization, and what's the best way to implement new AI developments? Explore our guides for justice institution leaders."
    items={guides}
    baseUrl="/guide"
    cardBg="bg-peach-extra-light" // <— peach cards
  />
  <p className="text-xl text-gray-700 max-w-2xl">
    <strong>Please share guide proposals and open-source materials</strong> with us at{' '}
    <a href="https://docs.google.com/forms/d/e/1FAIpQLScxjzlRUOZcwSDI_Fq5WWDWatdPF-6JQ30VcNBpCEwlSHvTlw/viewform" className="underline text-navy">
      this form.
    </a>
  </p>
</section>

    </main>
  )
}

function Section({
  id,
  title,
  description,
  items,
  bg,
  baseUrl,
  cardBg = 'bg-white',
}: {
  id?: string
  title: string
  description: string
  items: SanityDoc[]
  bg: string
  baseUrl: string
  cardBg?: string 
}) {
  return (
    <section id={id} className={`${bg} px-10 py-16`}>
      <h2 className="text-4xl font-heading font-bold text-navy mb-2">{title}</h2>
      <p className="text-gray-600 max-w-2xl mb-6">{description}</p>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
          // Prefer internal slug; else fall back to external link
          const href = item.slug?.current
            ? `${baseUrl}/${item.slug.current}`
            : item.link || '#'
          const isExternal = !!item.link && !item.slug?.current

          const Card = (
            <div className={`${cardBg} p-4 border rounded-lg shadow flex flex-col hover:shadow-lg transition-shadow`}>
              {item.image?.asset?.url && (
                <Image
                  src={item.image.asset.url}
                  alt={item.title}
                  width={400}
                  height={200}
                  className="object-cover w-full h-40 rounded mb-4"
                />
              )}
              <h3 className="text-xl font-semibold text-navy font-heading mb-2 leading-tight">
                {item.title}
              </h3>
              {item.oneliner && (
                <div className="text-sm text-gray-700 leading-snug">
                  <PortableText value={item.oneliner} />
                </div>
              )}
            </div>
          )

          return isExternal ? (
            <a key={item._id} href={href} target="_blank" rel="noopener noreferrer">
              {Card}
            </a>
          ) : (
            <Link key={item._id} href={href}>
              {Card}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
