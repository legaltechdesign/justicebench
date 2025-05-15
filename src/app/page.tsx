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
        <h1 className="text-6xl font-heading font-bold text-navy">Justice Bench</h1>
        <p className="text-xl text-gray-700 mt-4">
          An R&D Community Platform for AI and Access to Justice
        </p>
      </header>

      <section className="bg-peach-extra-light px-10 py-16">
  <h2 className="text-3xl font-heading font-bold text-navy mb-6">Tasks</h2>
  <p className="text-gray-600 max-w-2xl mb-10">
    <strong>What new AI projects are needed to improve access to justice?</strong> These are some of the main tasks that need to be done to help people with their legal problems, and to help service providers operate more effectively. <br />
    <br />  
    These tasks are all general (across problem types and regions) so that we can find ways to collaborate on common technology solutions.
    <br />  
    <br />
    We have 8 main clusters of A2J tasks: Getting Brief Help, Providing Brief Help, Service Onboarding, Work Product, Case Management, Coaching, Administration & Strategy, and Tech Tooling. Explore them each below!
  </p>

  {tasksByCategory.map((category: any) => (
    <div key={category._id} className="mb-12">
      <h3 className="text-2xl font-heading text-navy mb-4">{category.title}</h3>
      <p className="text-gray-600 mb-4">{category.description}</p>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {category.tasks.map((task: any) => (
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
              <h4 className="text-lg font-heading text-navy mb-2">{task.title}</h4>
              {task.oneliner && (
                <div className="text-sm text-gray-700">
                  <PortableText value={task.oneliner} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  ))}
</section>

      <Section title="Projects" description="What is already happening in this space? Many groups are working on new tools and pilots to use AI for access to justice. Look through these project pages to see who is building what, the data they have to share, how they are measuring progress, and what protocols you might borrow." items={projects} bg="bg-white" baseUrl="/project" />

      <Section title="Datasets" description="Are you looking for data to build AI or measure its performance? We are featuring open datasets that can be used for benchmarking quality of AI, or to improve how an AI system works." items={datasets} bg="bg-peach-extra-light" baseUrl="/dataset" />
      <p className="text-xl text-gray-700 mt-4">
      Coming Soon. Please share datasets with us at <a href="mailto:legaldesignlab@gmail.com">legaldesignlab@gmail.com</a> </p>

      <Section title="Guides" description="How can you create an AI plan for your justice organization, and what's the best way to implement new AI developments? Explore our guides for justice institution leaders." items={guides} bg="bg-white" baseUrl="/guide" />
      <p className="text-xl text-gray-700 mt-4">
      Coming Soon. Please share guide proposals and open-source materials with us at <a href="mailto:legaldesignlab@gmail.com">legaldesignlab@gmail.com</a> </p>
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
          <Link key={item._id} href={`${baseUrl}/${item.slug?.current || ''}`}>
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
              <h3 className="text-xl font-semibold text-navy font-heading mb-2">
                {item.title}
              </h3>
              {item.oneliner && (
                <div className="text-sm text-gray-700">
                  <PortableText value={item.oneliner} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
