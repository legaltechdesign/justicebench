// src/app/page.tsx
import { sanityClient } from '@/lib/sanity'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { portableTextComponents } from '@/components/CustomPortableText'



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
}

// Fetch all categories in parallel
export default async function Home() {
  const [tasks, projects, datasets, guides] = await Promise.all([
    sanityClient.fetch(`*[_type == "task" && references(^._id)] | order(sortOrder asc){
      _id,
      title,
      slug,
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
      "oneliner": oneliner,
      image {
        asset->{
          _id,
          url
        }
      },
      status->{
        status,
        description,
        color,
        "iconUrl": icon.asset->url
      }
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
    sanityClient.fetch(`*[_type == "guide"]{
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
  ])
  const tasksByCategory = await sanityClient.fetch(`
    *[_type == "category"] | order(sortOrder asc){
      _id,
      title,
      slug,
      description,
      sortOrder,
      "tasks": *[_type == "task" && references(^._id)]| order(sortOrder asc){
        _id,
        title,
        slug,
        sortOrder,
        "oneliner": oneLiner,
        image {
          asset->{
            _id,
            url
          }
        }
      } | order(sortOrder asc)
    }
  `)
  const statusOrder = ['Pilots', 'Prototypes', 'Proposals']

  const groupedProjects = statusOrder.map((status) => ({
    status,
    projects: projects.filter((p: any) => p.status?.status === status),
    description: projects.find((p: any) => p.status?.status === status)?.status?.description,
    iconUrl: projects.find((p: any) => p.status?.status === status)?.status?.iconUrl,
  })).filter(group => group.projects.length > 0)

  return (
    <main className="font-sans">
      <header className="bg-white p-12 text-center">
  <div className="flex justify-center items-center gap-4">
    
    <h1 className="text-6xl font-heading font-bold text-navy">JusticeBench</h1>
  </div>
  <p className="text-xl text-gray-700 mt-4">
    An R&D Community Platform for AI and Access to Justice
  </p>
  <div className="mt-4 bg-peach-light text-navy text-sm font-medium px-4 py-2 rounded-md max-w-xl mx-auto">
    🚧 This platform is still under development. Please explore and send us feedback, contributions, and ideas to <a href="mailto:legaldesignlab@law.stanford.edu" className="underline">legaldesignlab@law.stanford.edu</a>.
  </div>
</header>
      <section className="bg-navy px-6 py-16">
  <h2 className="text-5xl md:text-5xl font-heading font-bold text-white text-center mb-4">
    How to Use JusticeBench
  </h2>
  <p className="text-white text-center max-w-4xl mx-auto mb-10">
    JusticeBench is an open platform for legal leaders, technologists, researchers, and community members working on AI to advance access to justice.
  </p>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
  <div className="bg-white p-6 rounded-xl shadow-md">
    <Link href="#projects">
      <div className="text-4xl mb-4">🛠️</div>
      <h3 className="text-3xl font-bold text-navy mb-2">Projects</h3>
      </Link>
      <p className="text-gray-700">
        Look at prototypes, pilots, and proposals others are building to find inspiration, collaborators, or models.
      </p>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-md">
    <Link href="#tasks">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-3xl font-bold text-navy mb-2">Tasks</h3>
      </Link>
      <p className="text-gray-700">
        Explore specific use cases where AI can help improve access to justice. Scope what to work on — and where you fit in.
      </p>
    </div>
 
    <div className="bg-white p-6 rounded-xl shadow-md">
    <Link href="#datasets">
      <div className="text-4xl mb-4">📊</div>
      
      <h3 className="text-3xl font-bold text-navy mb-2">Datasets</h3>
      </Link>
      <p className="text-gray-700">
        Share or use data to train, evaluate, and improve legal AI projects and performance standards.
      </p>
    </div>
  </div>
</section>

<section className="bg-peach-light text-white rounded-2xl p-8 max-w-5xl mx-auto mb-12 shadow-lg my-8">
  <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
    New to the Access to Justice Domain?
  </h2>
  <p className="text-base text-black md:text-lg mb-6">
    Are you a technologist, researcher, data scientist, or professional who is new to the world of legal aid, courts, and civil legal problems? Learn the basics of what a person's journey through a legal problem like eviction, debt, or divorce looks like—and how service providers try to assist them.
  </p>
  <a
    href="#justice-journey"
    className="inline-block bg-navy text-white font-semibold text-xl px-6 py-3 rounded-lg hover:bg-navy/90 transition"
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
      What AI projects are already happening in the Access to Justice domain? Many groups are working on new tools to help people & providers dealing with legal problems. Look through these project pages to see who is building what, the data they have to share, how they are measuring progress, and what protocols you might borrow.
    </p>

    {groupedProjects.map((group) => (
      <div key={group.status} className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          {group.iconUrl && (
            <Image src={group.iconUrl} alt={group.status} width={60} height={60} />
          )}
          <h3 className="text-5xl font-heading text-navy text-center">{group.status}</h3>
        </div>
        {group.description && (
          <p className="text-gray-700 mb-6 max-w-3xl">{group.description}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {group.projects.map((project: any) => (
            <Link key={project._id} href={`/project/${project.slug.current}`}>
              <div className="bg-peach-extra-light border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
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
                  <h4 className="text-xl font-heading font-bold text-navy mb-2">
                    {project.title}
                  </h4>
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
    ))}
  </div>
</section>

<section className="bg-navy py-14 px-6 sm:px-10 text-white" id="justice-journey">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-4xl font-heading font-bold text-white mb-6 text-center">
      Learn More about the Access to Justice Domain
    </h1>
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
    title: 'Follow Through Stage',
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
<section id="service-provider-workflow" className="py-10">
  <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
   Service Providers' Workflows to Suport Better Justice Journeys
  </h2>
  <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
    Aside from users, service providers are also key stakeholders in advancing access to justice.
    Legal aid groups, court providers, pro bono clinics, and other providers have certain clusters of activities, that they do to provide front-facing services and back-end operations and strategy.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
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
        "The provider works with the user to research the law, draft and file documents, analyze legal options, collect evidence, and keep them on track with deadlines and next steps.",
      icon: "/icons/work-icon.png",
    },
    {
      title: "Coaching & Support",
      description:
        "The provider gives ongoing encouragement, legal education, and guidance throughout the justice journey, so users stay involved and making informed decisions.",
      icon: "/icons/coach-icon.png",
    },
    {
      title: "Administration & Strategy",
      description:
        "The provider monitors cases and outcomes overall, manages staff and reporting, spots patterns, operates tech, and identifies areas for service improvement, policy change, strategic litigation, or tech innovation.",
      icon: "/icons/admin-icon.png",
    },
  ].map((step, idx) => (
    <div
      key={idx}
      className="relative bg-[#e8edf6] rounded-xl shadow-md overflow-hidden flex flex-col h-[360px] hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <img
          src={step.icon}
          alt={step.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-navy bg-opacity-60 flex items-center justify-center p-4">
          <h3 className="text-xxl text-white font-bold text-center leading-tight font-heading">
            {step.title}
          </h3>
        </div>
      </div>
      <div className="p-4 text-sm text-gray-800">
        <p>{step.description}</p>
      </div>
    </div>
  ))}
</div>

  
  </section>.

 

      <section id="tasks" className="bg-peach-extra-light px-10 py-16">
        <h2 className="text-5xl font-heading font-bold text-navy mb-6">Tasks for AI to Advance Access to Justice</h2>
        <div className="text-gray-600 mb-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <div>
            <p>
              <strong>Across all different problem types and geographies, what tasks can AI do to improve how people get legal help & how providers serve people?</strong></p> 
              <p>For the various stages of a person's justice journey, we have documented the main tasks that need to be done. These specific tasks can help people successfully resolve their legal problems, and they can help service providers operate more effectively.
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
            <p className="mt-4">Explore each in detail below.</p>
          </div>
        </div>

        {tasksByCategory.map((category: any) => (
          <div key={category._id} className="mb-12">
            <h3 className="text-3xl font-heading font-semibold text-navy mb-4">{category.title}</h3>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {category.tasks.map((task: any) => (
                task.slug?.current && (
                  <Link key={task._id} href={`/task/${task.slug.current}`}>
                    <div className="bg-white p-4 border rounded-lg shadow hover:shadow-lg transition-shadow">
                      {task.image?.asset?.url && (
                        <Image
                          src={task.image.asset.url}
                          alt={task.title}
                          width={400}
                          height={200}
                          className="object-cover w-full h-40 rounded mb-4"
                        />
                      )}
                      <h4 className="text-xl font-heading text-navy font-bold mb-2 leading-tight">{task.title}</h4>
                      {task.oneliner && (
                        <div className="text-sm text-gray-700 leading-snug">
                          <PortableText value={task.oneliner} />
                        </div>
                      )}
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>
        ))}
      </section>

     
     
<section className="px-10 pt-0 pb-16">
  <Section
  id="datasets"
  title="Datasets"
  description="Are you looking for data to build AI or measure its performance? We are featuring open datasets that can be used for benchmarking quality of AI, or to improve how an AI system works."
  items={datasets}
  bg="bg-white" 

  baseUrl="/dataset"
/>

  <p className="text-xl text-gray-700 max-w-2xl">
    <strong>Please share datasets</strong> with JusticeBench at{' '}
    <a href="mailto:legaldesignlab@law.stanford.edu" className="underline text-navy">
      legaldesignlab@law.stanford.edu
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
/>

  <p className="text-xl text-gray-700 max-w-2xl">
    <strong>Coming Soon.</strong> Please share guide proposals and open-source materials with us at{' '}
    <a href="mailto:legaldesignlab@law.stanford.edu" className="underline text-navy">
      legaldesignlab@law.stanford.edu
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
}: {
  id?: string
  title: string
  description: string
  items: SanityDoc[]
  bg: string
  baseUrl: string
}) {
  return (
    <section id={id} className={`${bg} px-10 py-16`}>
      <h2 className="text-4xl font-heading font-bold text-navy mb-2">{title}</h2>
      <p className="text-gray-600 max-w-2xl mb-6">{description}</p>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          item.slug?.current && (
            <Link key={item._id} href={`${baseUrl}/${item.slug.current}`}>
              <div className="bg-white p-4 border rounded-lg shadow flex flex-col hover:shadow-lg transition-shadow">
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
            </Link>
          )
        ))}
      </div>
    </section>
  )
}
