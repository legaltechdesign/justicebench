// src/app/page.tsx
import { sanityClient } from '@/lib/sanity'
import Image from 'next/image'
import { PortableText, PortableTextComponents  } from '@portabletext/react'
import Link from 'next/link'
import { portableTextComponents } from '@/components/CustomPortableText'


async function safeFetch<T>(query: string) {
  try {
    return await sanityClient.fetch<T>(query)
  } catch (err) {
    console.error('[Sanity fetch failed]', query, err)
    return [] as unknown as T
  }
}

type Task = SanityDoc

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
}

// Fetch all categories in parallel
export default async function Home() {
  const [tasks, projects, datasets, guides] = await Promise.all([
    
    sanityClient.fetch(`*[_type == "task" && references(^._id)] | order(sortOrder asc){
      _id,
      title,
      slug,
        icon{asset->{url}},  
      "oneliner": oneLiner,
      image {
        asset->{
          _id,
          url
        }
      }
    }`),
sanityClient.fetch(`*[_type == "project"]{
  _id,
  title,
  slug,
  "issue": issue->{
  title,
  slug,
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
  const tasksByCategory = await sanityClient.fetch(`
    *[_type == "category"] | order(coalesce(sortOrder, 9999) asc, title asc){
      _id,
      title,
      slug,
      description,
      oneliner,
      icon{ asset->{_id, url} },
      sortOrder,
      "tasks": *[_type == "task" && references(^._id)]| order(sortOrder asc){
        _id,
        title,
        slug,
        sortOrder,
        code,   
        "oneliner": oneLiner,
        icon{asset->{url}},
        image {
          asset->{
            _id,
            url
          }
        }
      } | order(sortOrder asc)
    }
  `)
  
  const categoriesMeta = tasksByCategory
  .map((c: any) => ({
    _id: c._id,
    title: c.title,
    slug: c.slug,
    sortOrder: c.sortOrder ?? 9999,
    description: c.description ?? '',   
    oneliner: c.oneliner ?? null, 
    iconUrl: c.icon?.asset?.url ?? c.image?.asset?.url ?? null,
  }))
  .sort((a: any, b: any) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))


  const statusOrder = ['Pilots', 'Prototypes', 'Proposals']

  const groupedProjects = statusOrder.map((status) => ({
    status,
    projects: projects.filter((p: any) => p.status?.status === status),
    description: projects.find((p: any) => p.status?.status === status)?.status?.description,
    icon: projects.find((p: any) => p.status?.status === status)?.status?.icon,
    iconUrl: projects.find((p: any) => p.status?.status === status)?.status?.iconUrl,
  })).filter(group => group.projects.length > 0)

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
        An R&amp;D Community Platform for AI and Access to Justice
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-peach-light px-4 py-2 text-sm font-medium text-navy">
        <span>🚧 This platform is still under development.</span>
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
    JusticeBench is an R&D platform for legal leaders, technologists, researchers, and community members working on AI to advance access to justice.
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
        Look at prototypes, pilots, and proposals others are building to find inspiration, collaborators, or models.
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


<section className="bg-peach-light text-white rounded-2xl p-8 max-w-5xl mx-auto mb-12 shadow-lg my-8">
  <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-center">
    New to the Access to Justice Domain?
  </h2>
  <p className="text-base text-black md:text-lg mb-6">
    Are you a technologist, researcher, data scientist, or professional who is new to the world of legal aid, courts, and civil legal problems? 
    </p>
    <p className="text-base text-black md:text-lg mb-6">
      Learn the basics of what a person's journey looks like, as they deal with a legal problem like eviction, debt, divorce, reentry, employement problems, or  more.
      </p>
      <p className="text-base text-black md:text-lg mb-6">
     Also explore the common workflows of service providers who assist people in resolving their legal problems.
  </p>
  <a
    href="#justice-journey"
    className="inline-block bg-navy text-white font-semibold text-xl px-6 py-3 rounded-lg hover:bg-navy/90 transition flex justify-center items-center"
  >
    Learn More about Access to Justice
  </a>
</section>


<section id="projects" className="bg-white py-16 px-6 sm:px-10">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-6xl font-heading font-bold text-navy mb-10 text-center">
      Projects
    </h2>
    <p className="text-gray-700 mb-12 text-center max-w-3xl mx-auto">
      What kinds of AI projects are already in the works to advance access to justice? Explore AI projects organized by the legal need / service area or team that the project relates to. Each card notes the project's status -- whether it's a pilot, prototype, or proposal. If you know of other projects aside from those here, please tell us about them!
    </p>

    {(() => {
      // -----------------------------
      // Types to keep TS happy
      // -----------------------------
      type Project = {
  _id: string
  title: string
  slug: { current: string }
  issue?: {
    title?: string
    slug?: { current: string }
    icon?: { asset?: { url?: string } }
    oneLiner?: any            // ← add
    description?: any         // ← add
  }
  image?: { asset?: { url?: string } }
  oneliner?: any
  tasks?: { title: string; slug: { current: string }; icon?: { asset?: { url?: string } } }[]
  category?: { title?: string; slug?: { current: string }; sortOrder?: number; icon?: { asset?: { url?: string } }; oneliner?: any }
  status?: { status?: string }
}


      type IssueGroup = {
        key: string
        title: string
        slug?: string
        iconUrl?: string | null
        blurb?: any  
        projects: Project[]
      }

      // -----------------------------
      // 1) Group projects by ISSUE/TEAM
      // -----------------------------
      const groupsMap = new Map<string, IssueGroup>()
      ;(projects as Project[]).forEach((p) => {
        const key = p.issue?.slug?.current ?? '__uncategorized__'
        const g: IssueGroup =
          groupsMap.get(key) ??
          {
            key,
            title: p.issue?.title ?? 'Other service areas',
            slug: p.issue?.slug?.current,
            iconUrl: p.issue?.icon?.asset?.url ?? null,
            blurb: p.issue?.oneLiner ?? null,  // ← NEW
            projects: [] as Project[],
          }
        g.projects.push(p)
        groupsMap.set(key, g)
      })

      // Optional display order for issue/team groups
      const preferredOrder: string[] = [
        'housing', 'debt-consumer', 'reentry', 'family-law', 'estates',
        'intake-triage-brief-advice', 'self-help-education', 'court-clerk-case-mgmt', 'legal-org-admin',
      ]
      const groups = Array.from(groupsMap.values())
      const rank = (g: IssueGroup) => {
        const k = (g.slug ?? g.title ?? '').toLowerCase()
        const bySlug = preferredOrder.indexOf(k)
        if (bySlug !== -1) return bySlug
        const titleMatch = preferredOrder.findIndex(hint => (g.title ?? '').toLowerCase().includes(hint))
        return titleMatch !== -1 ? titleMatch + 100 : 999
      }
      groups.sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title))



// --- Jump Menu (full-bleed) ---
const groupsWithProjects = groups.filter(g => g.projects.length > 0)

{/* Full-bleed wrapper */}
<div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen mb-10">
  <div className="bg-peach-extra-light border border-[#f5cbbf] py-8">
    <div className="max-w-7xl mx-auto px-6 sm:px-10">
      <h3 className="text-xl font-heading font-semibold text-navy mb-4">
        Jump to an Issue Area
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {groupsWithProjects.map((g) => (
          <a
            key={`jump-${g.key}`}
            href={`#${g.slug ?? ''}`}
            className="group flex items-center gap-3 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-200 hover:border-navy/40 hover:bg-white transition p-3"
          >
            {g.iconUrl ? (
              <img
                src={g.iconUrl}
                alt={`${g.title} icon`}
                className="h-8 w-8 rounded"
              />
            ) : (
              <div className="h-8 w-8 rounded bg-navy/10" />
            )}
            <div className="flex-1">
              <div className="text-sm font-semibold text-navy leading-tight">
                {g.title}
              </div>
              {g.slug && (
                <div className="text-[11px] text-gray-600">
                  View {g.title} AI Projects
                </div>
              )}
            </div>
            <span className="ml-auto text-navy/50 group-hover:text-navy">↘</span>
          </a>
        ))}
      </div>
    </div>
  </div>
</div>
// --- end Jump Menu ---



// Helper: trim "Legal Services" or "Services" suffix for cleaner display
function cleanIssueName(title?: string): string {
  if (!title) return ''
  return title.replace(/\s*(Legal\s+Services|Services)\s*$/i, '').trim()
}

      // -----------------------------
      // 2) Render each ISSUE group
      //    Sub-group by the PROJECT'S OWN CATEGORY (sorted by categoriesMeta.sortOrder)
      // -----------------------------
      return groups.map((group) => (
        <div key={group.key} className="mb-16" id={group.slug ?? undefined}>
          {/* Issue/Team heading */}
          {/* Issue/Team heading with peach band */}

{/* === Issue banner (full-bleed) === */}
<div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen mb-8" id={group.slug ?? undefined}>
  <div className="bg-peach-extra-light/70 border-y border-peach">
    <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5">
      <div className="flex items-center gap-3">
        {group.iconUrl ? (
          <Image
            src={group.iconUrl}
            alt={`${group.title} icon`}
            width={48}
            height={48}
            className="rounded-md"
          />
        ) : null}
        <h3 className="text-3xl md:text-4xl font-heading font-semibold text-navy">
          {group.title} AI Projects
        </h3>
      </div>

      {group.blurb && (
        <div className="mt-2 text-base text-gray-700 max-w-4xl">
          {typeof group.blurb === 'string'
            ? group.blurb
            : <PortableText value={group.blurb} components={portableTextComponents} />}
        </div>
      )}
    </div>
  </div>
</div>



          {/* === Sub-groups by Project Category (ONLY project.category is used) === */}
          {(() => {
            // Build a map of categorySlug -> projects (using ONLY project.category)
            const byCat = new Map<string, Project[]>()
            group.projects.forEach((p) => {
              const catSlug = p.category?.slug?.current ?? '__uncategorized__'
              const arr = byCat.get(catSlug) ?? ([] as Project[])
              arr.push(p)
              byCat.set(catSlug, arr)
            })

            return (
              <>
                {/* Known categories in sortOrder via categoriesMeta */}
                {categoriesMeta.map((cat: any) => {
                  const catSlug = cat.slug?.current
                  const catProjects = (catSlug && byCat.get(catSlug)) || []
                  if (!catProjects.length) return null

                  return (
                    <div key={`${group.key}-${cat._id}`} className="mb-10">
                      <div className="flex items-center gap-2 mb-2">
  {cat.icon?.asset?.url && (
    <Image
      src={cat.icon.asset.url}
      alt={`${cat.title} icon`}
      width={28}
      height={28}
    />
  )}
 <h4 className="text-2xl font-heading font-semibold text-navy">
  AI for {cat.title} for {cleanIssueName(group.title)}
</h4>

</div>


                      {cat.oneliner && (
                        <div className="text-sm text-gray-600 mb-3 max-w-3xl">
                          <PortableText value={cat.oneliner} components={portableTextComponents} />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {catProjects.map((project: any) => (
                          <Link key={project._id} href={`/project/${project.slug.current}`}>
                            <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                              {/* Status pill */}
                              {project.status?.status && (
                                <span className="absolute top-3 left-3 z-10 rounded-full bg-navy text-white text-xs px-2 py-1">
                                  {project.status.status}
                                </span>
                              )}

                              {/* Image */}
                              {project.image?.asset?.url && (
                                <Image
                                  src={project.image.asset.url}
                                  alt={project.title}
                                  width={400}
                                  height={220}
                                  className="object-cover w-full h-48"
                                />
                              )}

                              {/* Body */}
                              <div className="p-4">
                                <h5 className="text-lg font-heading font-bold text-navy mb-2">
                                  {project.title}
                                </h5>
                                {project.oneliner && (
                                  <div className="text-sm text-gray-700">
                                    <PortableText value={project.oneliner} components={portableTextComponents} />
                                  </div>
                                )}

                                {/* Task chips (decorative only) */}
                                {project.tasks?.length ? (
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {project.tasks.map((t: any) => (
                                      <Link
                                        key={t.slug.current}
                                        href={`/task/${t.slug.current}`}
                                        className="flex items-center bg-peach rounded-full px-3 py-1 text-xs text-navy hover:bg-gray-200"
                                      >
                                        {t.icon?.asset?.url && (
                                          <Image src={t.icon.asset.url} alt={t.title} width={14} height={14} className="mr-1" />
                                        )}
                                        <span>{t.title}</span>
                                      </Link>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {/* Uncategorized (no project.category) */}
                {(() => {
                  const uncategorized = byCat.get('__uncategorized__') ?? []
                  if (!uncategorized.length) return null

                  return (
                    <div className="mb-10">
                      <h4 className="text-2xl font-heading font-semibold text-navy mb-3">
                        Uncategorized
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {uncategorized.map((project) => (
                          <Link key={project._id} href={`/project/${project.slug.current}`}>
                            <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                              {project.status?.status && (
                                <span className="absolute top-3 left-3 z-10 rounded-full bg-navy text-white text-xs px-2 py-1">
                                  {project.status.status}
                                </span>
                              )}
                              {project.image?.asset?.url && (
                                <Image
                                  src={project.image.asset.url}
                                  alt={project.title}
                                  width={400}
                                  height={220}
                                  className="object-cover w-full h-48"
                                />
                              )}
                              <div className="p-4">
                                <h5 className="text-lg font-heading font-bold text-navy mb-2">{project.title}</h5>
                                {project.oneliner && (
                                  <div className="text-sm text-gray-700">
                                    <PortableText value={project.oneliner} components={portableTextComponents} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </>
            )
          })()}
        </div>
      ))
    })()}
  </div>
</section>






<section className="bg-navy py-14 px-6 sm:px-10 text-white" id="justice-journey">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-4xl font-heading font-bold text-white mb-6 text-center">
      Learn More about the Access to Justice Domain
    </h1>
    <p className="text-white mb-12 text-center max-w-3xl mx-auto">
      What does 'access to justice' mean? How can technology help more people navigate their legal problems and the justice system in order to get to good outcomes? Explore this section to get oriented in this A2J domain.
    </p>
    </div>
    </section>
<section className="bg-white py-10 px-6 sm:px-10" >
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-heading font-bold text-navy mb-10 text-center">
      Common Stages of a Person's Justice Journey
    </h2>

<p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
  <strong>How does a legal problem play out in a person's life?</strong> Different legal problems -- eviction, debt collection, divorce, driver's license suspension, or other disputes -- often follow the same 7 stages.
</p>
<p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
  Use this overview to understand where AI might help a person. Then <a href="#tasks" className="text-navy underline">go to the Tasks Section</a> to see the specific AI opportunities at each stage.
</p>
<figure className="my-8">
  <Image
    src="/images/user-workflow.png"
    alt="User justice journey overview"
    width={2400}            // any large intrinsic width is fine
    height={1400}           // keep the aspect ratio roughly correct
    className="w-full h-auto rounded-xl shadow"
    sizes="(min-width: 1280px) 72rem, 100vw"  // helps Next pick the right size
    priority                 // optional: prioritize this image
  />
  <figcaption className="text-center text-xs text-gray-500 mt-2">
    Overview of the person’s justice journey stages.
  </figcaption>
</figure>
<div className="grid justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

{[
  {
    title: 'Awareness Stage',
    description: 'As a conflict brews, the person begins to recognize that they might need legal help to deal with it. They begin to seek out help online, through friends, or by contacting a service provider.',
    icon: '/icons/awareness.png',
  },
  {
    title: 'Orientation Stage',
    description: 'The person gets a diagnosis of the exact legal scenario they are in, what the law says about their rights, what options they have, and what services can help.',
    icon: '/icons/orientation.png',
  },
  {
    title: 'Strategy Stage',
    description: 'The person decides how they want to handle the problem. They weigh their goals, rights, and risks. They choose what path to take and get a plan of action -- including paperwork, research, hearings, meetings, and more.',
    icon: '/icons/strategy.png',
  },
  {
    title: 'Work Product Stage',
    description: 'The person drafts documents and forms to file, researches the law, gathers and organizes evidence, responds to requests, makes requests of the other side, and crafts talking points.',
    icon: '/icons/work-product.png',
  },
  {
    title: 'Engagement Stage',
    description: 'The person completes all of the steps, deadlines, and procedural requirements. They file things on time, make payments or get fee waivers, attend required meetings and hearings, and stay updated on their case progress and obligations.',
    icon: '/icons/engagement.png',
  },
  {
    title: 'Present and Negotiate Stage',
    description: 'The person presents their case to the judge or decisionmaker, answers questions, and interacts with the other party. They may also negotiate with the other side, and respond to settlement offers.',
    icon: '/icons/presentation.png',
  },
  {
    title: 'Follow-Through Stage',
    description: 'After a decision or settlement, the person must ensure they understand what the final arrangement is and how to live up to it (or enforce it). They may need to comply with orders, secure what they won, or clear their record to prevent collateral consequences.',
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
<section id="service-provider-workflow" className="bg-white py-10 px-6 sm:px-10">
<div className="max-w-7xl mx-auto">
  <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
   Service Providers' Workflows to Suport Better Justice Journeys
  </h2>
  <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
    Aside from users, service providers are also key stakeholders in advancing access to justice.
    Legal aid groups, court help centers, pro bono clinics, and other justice workers have common clusters of tasks. These tasks all relate to the front-facing services or back-end operations of providing legal help to the public.
  </p>
  <figure className="my-8">
  <Image
    src="/images/provider-workflow.png"
    alt="Provider journey overview"
    width={2400}            // any large intrinsic width is fine
    height={1400}           // keep the aspect ratio roughly correct
    className="w-full h-auto rounded-xl shadow"
    sizes="(min-width: 1280px) 72rem, 100vw"  // helps Next pick the right size
    priority                 // optional: prioritize this image
  />
  <figcaption className="text-center text-xs text-gray-500 mt-2">
    Overview of the service provider’s workflow, tasks along the justice journey.
  </figcaption>
</figure>

<div className="grid justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
  {[
    {
      title: "Outreach & Education",
      description:
        "The provider tries to connect with the right audience—raising awareness, providing legal information, building trust, and helping people recognize legal issues and seek help.",
      icon: "/icons/outreach-icon.png",
    },
    {
      title: "Screening & Triage",
      description:
        "The provider attempts to understand each person's background and legal issue to determine if and how the organization can help. This includes routing people to services, guides, or referrals.",
      icon: "/icons/screen-icon.png",
    },
    {
      title: "Tailored Advice",
      description:
        "The provider provides the user with detailed, custom advice on their legal options, risks, and next steps. Advice is specific to the user's goals, context, and documents—and designed to support informed decisions.",
      icon: "/icons/advice-icon.png",
    },
    {
      title: "Work Product & Legal Research",
      description:
        "The provider researches the law, draft and file documents, analyze legal options, collect evidence, and keep them on track with deadlines and next steps.",
      icon: "/icons/work-icon.png",
    },
    {
      title: "Coaching & Support",
      description:
        "The provider gives ongoing encouragement, legal education, and guidance throughout the justice journey, so users stay involved and making informed decisions.",
      icon: "/icons/coach-icon.png",
    },
    {
      title: "Present & Negotiate",
      description:
        "The provider presents the case to the judge or decisionmaker, answers questions, and interacts with the other party. They may also negotiate with the other side, and respond to settlement offers.",
      icon: "/icons/present-negotiate.png",
    },
    {
      title: "Administration & Strategy",
      description:
        "The provider monitors cases and outcomes overall, manages staff and reporting, spots patterns, operates tech, and identifies areas for service improvement, policy change, strategic litigation, or tech innovation.",
      icon: "/icons/admin-icon.png",
    },
  ].map((step) => (
    <div
      key={step.title}
      className="bg-navy/10 rounded-xl shadow hover:shadow-lg transition overflow-hidden max-w-[300px] mx-auto"
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

  
  </section>.

 
<section id="tasks" className="bg-peach-extra-light px-10 py-16">
  <h2 className="text-5xl font-heading font-bold text-navy mb-6">Tasks for AI to Advance Access to Justice</h2>

  <div className="text-gray-600 mb-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
    <div>
      <p>
        <strong>Across all different problem types and geographies, what tasks can AI do to improve how people get legal help & how providers serve people?</strong>
      </p>
      <p>
        For the various stages of a person's justice journey, we have documented the main tasks that need to be done. These specific tasks can help people successfully resolve their legal problems, and they can help service providers operate more effectively.
      </p>
      <p className="mt-4">
        These tasks are all general (across problem types and regions) so that we can find ways to collaborate on common technology solutions.
      </p>
    </div>
    <div>
      <p>
        The 7 main clusters of Access to Justice tasks came from our community brainstorms & workflow mapping. Some of them are tasks that the user does, others are what the service provider (like a legal aid group or a court) would do:
      </p>
      <ul className="list-disc pl-5 mt-2">
        <li>User: Getting Brief Help</li>
        <li>Provider: Providing Brief Help</li>
        <li>User-Provider: Service Onboarding</li>
        <li>User-Provider: Work Product</li>
        <li>Provider: Case Management</li>
        <li>Provider: Administration, Ops, & Strategy</li>
        <li>Provider: Tech Tooling</li>
      </ul>
      <p className="mt-4">Explore each in detail below, or visit our <a href="https://www.justicebench.org/task">Task Taxonomy page.</a></p>
    </div>
  </div>

  {/* === Taxonomy-style list by Task Category === */}
  {tasksByCategory.map((category: any) => {
    const hasTasks = Array.isArray(category.tasks) && category.tasks.length > 0
    if (!hasTasks) return null

    return (
      <div key={category._id} id={category.slug?.current} className="mb-12">
        {/* Category heading with icon + title */}
        <div className="flex items-center gap-3 mb-3">
          {category.icon?.asset?.url && (
            <Image
              src={category.icon.asset.url}
              alt={`${category.title} icon`}
              width={36}
              height={36}
              className="rounded"
            />
          )}
          <h3 className="text-3xl font-heading font-semibold text-navy">
            {category.title} Tasks
          </h3>
        </div>
        {category.description && (
          <p className="text-gray-600 mb-4 max-w-3xl">{category.description}</p>
        )}

        {/* Full-width rows */}
        <div className="space-y-3">
          {category.tasks.map((task: any) => {
            const href = task.slug?.current ? `/task/${task.slug.current}` : undefined
            return (
              <Link
                key={task._id}
                href={href ?? '#'}
                className={`block rounded-xl border bg-white hover:shadow-md transition ${
                  href ? 'cursor-pointer' : 'pointer-events-none opacity-70'
                }`}
              >
                <div className="p-4 md:p-5 flex items-start gap-4">
                  {/* Icon / image */}
{task.icon?.asset?.url ? (
  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-peach-extra-light flex-shrink-0">
    <Image
      src={task.icon.asset.url}
      alt={`${task.title} icon`}
      width={64}
      height={64}
      className="object-contain"
    />
  </div>
) : task.image?.asset?.url ? (
  <Image
    src={task.image.asset.url}
    alt={task.title}
    width={80}
    height={80}
    className="rounded-md object-cover flex-shrink-0"
  />
) : (
  <div className="w-16 h-16 rounded-full bg-peach-extra-light border flex-shrink-0" />
)}



                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title + code badge */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-xl font-heading font-bold text-navy leading-tight">
                        {task.title}
                      </h4>
                      {task.code && (
                        <span className="inline-block text-xs font-semibold bg-navy text-white px-2 py-0.5 rounded-full">
                          {task.code}
                        </span>
                      )}
                    </div>

                    {/* Brief description (oneliner preferred; fallback to description) */}
                    <div className="text-sm text-gray-700 line-clamp-2">
                      {Array.isArray(task.oneliner) ? (
                        <PortableText value={task.oneliner} components={portableTextComponents} />
                      ) : task.oneliner ? (
                        <span>{task.oneliner}</span>
                      ) : Array.isArray(task.description) ? (
                        <PortableText value={task.description} components={portableTextComponents} />
                      ) : task.description ? (
                        <span>{task.description}</span>
                      ) : null}
                    </div>

                    {/* Read more */}
                    {href && (
                      <div className="mt-2">
                        <span className="text-navy text-sm underline">Read more about this task →</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    )
  })}
</section>


     
     
<section className="px-10 pt-0 pb-16">
  <Section
  id="datasets"
  title="Datasets, Evaluation, and Benchmarks"
  description="Are you looking for data to build AI or measure its performance? Do you need evaluation protocols or standards to test out LLMs or tools? We are featuring open datasets, evaluation harnesses, benchmarks, and more resources that can be used for testing the performance of models and applications, and to improve how an AI system works."
  items={datasets}
  bg="bg-white" 

  baseUrl="/dataset"
/>

  <p className="text-xl text-gray-700 max-w-2xl">
    <strong>Please share datasets</strong> with JusticeBench at{' '}
    <a href="https://docs.google.com/forms/d/e/1FAIpQLScxjzlRUOZcwSDI_Fq5WWDWatdPF-6JQ30VcNBpCEwlSHvTlw/viewform" className="underline text-navy">
      this form.
    </a>
  </p>
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
