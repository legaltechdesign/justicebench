// src/app/page.tsx
import { sanityClient } from '@/lib/sanity'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'


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
    sanityClient.fetch(`*[_type == "task"]{
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
      }
    }`),
    sanityClient.fetch(`*[_type == "dataset"]{
      _id,
      "title": name,
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
    *[_type == "category"] | order(sortOrder asc) {
      _id,
      title,
      slug,
      description,
      sortOrder,
      "tasks": *[_type == "task" && references(^._id)]{
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
      }
    }
  `)

  return (
    <main className="font-sans">
      <header className="bg-white p-12 text-center">
  <div className="flex justify-center items-center gap-4">
    
    <h1 className="text-6xl font-heading font-bold text-navy">Justice Bench</h1>
  </div>
  <p className="text-xl text-gray-700 mt-4">
    An R&D Community Platform for AI and Access to Justice
  </p>
  <div className="mt-4 bg-yellow-100 text-yellow-900 text-sm font-medium px-4 py-2 rounded-md max-w-xl mx-auto">
    🚧 This platform is still under development. Please explore and send us feedback, contributions, and ideas to <a href="mailto:legaldesignlab@law.stanford.edu" className="underline">legaldesignlab@law.stanford.edu</a>.
  </div>
</header>
      <section className="bg-navy px-6 py-16">
  <h2 className="text-2xl md:text-3xl font-heading font-bold text-white text-center mb-6">
    How to Use JusticeBench
  </h2>
  <p className="text-white text-center max-w-4xl mx-auto mb-10">
    JusticeBench is an open platform for legal leaders, technologists, researchers, and community members working on AI to advance access to justice.
  </p>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-xl font-bold text-navy mb-2">Tasks</h3>
      <p className="text-gray-700">
        Explore specific use cases where AI can help improve access to justice. Scope what to work on — and where you fit in.
      </p>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-4xl mb-4">🛠️</div>
      <h3 className="text-xl font-bold text-navy mb-2">Projects</h3>
      <p className="text-gray-700">
        Look at prototypes, pilots, and tools others are building to find inspiration, collaborators, or models.
      </p>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-4xl mb-4">📊</div>
      <h3 className="text-xl font-bold text-navy mb-2">Datasets</h3>
      <p className="text-gray-700">
        Share or use data to train, evaluate, and improve legal AI projects and performance standards.
      </p>
    </div>
  </div>
</section>

      

      <section className="bg-peach-extra-light px-10 py-16">
        <h2 className="text-3xl font-heading font-bold text-navy mb-6">Tasks</h2>
        <div className="text-gray-600 mb-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <div>
            <p>
              <strong>What new AI projects are needed to improve access to justice?</strong> These are some of the main tasks that need to be done to help people with their legal problems, and to help service providers operate more effectively.
            </p>
            <p className="mt-4">
              These tasks are all general (across problem types and regions) so that we can find ways to collaborate on common technology solutions.
            </p>
          </div>
          <div>
            <p>
              We have 8 main clusters of Access to Justice tasks from our community brainstorms & workflow mapping:
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Getting Brief Help</li>
              <li>Providing Brief Help</li>
              <li>Service Onboarding</li>
              <li>Work Product</li>
              <li>Case Management</li>
              <li>Coaching</li>
              <li>Administration, Ops, & Strategy</li>
              <li>Tech Tooling</li>
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

      <Section title="Projects" description="What is already happening in this space? Many groups are working on new tools and pilots to use AI for access to justice. Look through these project pages to see who is building what, the data they have to share, how they are measuring progress, and what protocols you might borrow." items={projects} bg="bg-white" baseUrl="/project" />

      <Section
  title="Datasets"
  description="Are you looking for data to build AI or measure its performance? We are featuring open datasets that can be used for benchmarking quality of AI, or to improve how an AI system works."
  items={datasets}
  bg="bg-peach-extra-light"
  baseUrl="/dataset"
/>

<section className="bg-peach-extra-light px-10 pt-0 pb-16">
  <p className="text-xl text-gray-700 max-w-2xl">
    <strong>Please share datasets</strong> with JusticeBench at{' '}
    <a href="mailto:legaldesignlab@law.stanford.edu" className="underline text-navy">
      legaldesignlab@law.stanford.edu
    </a>
  </p>
</section>


      <Section
  title="Guides"
  description="How can you create an AI plan for your justice organization, and what's the best way to implement new AI developments? Explore our guides for justice institution leaders."
  items={guides}
  bg="bg-white"
  baseUrl="/guide"
/>

<section className="bg-white px-10 pt-0 pb-16">
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
  title,
  description,
  items,
  bg,
  baseUrl,
}: {
  title: string
  description: string
  items: SanityDoc[]
  bg: string
  baseUrl: string
}) {
  return (
    <section className={`${bg} px-10 py-16`}>
      <h2 className="text-3xl font-heading font-bold text-navy mb-2">{title}</h2>
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
