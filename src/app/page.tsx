// src/app/page.tsx
import { sanityClient } from '@/lib/sanity'
import Image from 'next/image'

// Define types
interface SanityDoc {
  _id: string
  title: string
  description?: string
  image?: {
    asset: {
      _ref: string
    }
  }
}

// Fetch all categories in parallel
export default async function Home() {
  const [tasks, projects, datasets, guides] = await Promise.all([
    sanityClient.fetch(`*[_type == "task"]{ _id, title, description, image }`),
    sanityClient.fetch(`*[_type == "project"]{ _id, title, description, image }`),
    sanityClient.fetch(`*[_type == "dataset"]{ _id, title, description, image }`),
    sanityClient.fetch(`*[_type == "guide"]{ _id, title, description, image }`),
  ])

  return (
    <main className="font-sans">
      <header className="bg-white p-12 text-center">
        <h1 className="text-6xl font-spartan font-bold text-navy">Justice Bench</h1>
        <p className="text-xl text-gray-700 mt-4">
          An R&D Community Platform for AI and Access to Justice
        </p>
      </header>

      <Section
        title="Tasks"
        description="What new AI projects are needed? These are some of the main tasks that need to be done to help people with their legal problems. Explore the task pages to understand what needs to be built, what benchmarks need to be met, and what is already in the works."
        items={tasks}
        bg="bg-peach-extra-light"
      />

      <Section
        title="Projects"
        description="What is already happening in this space? Many groups are working on new tools and pilots to use AI for access to justice. Look through these project pages to see who is building what, the data they have to share, how they are measuring progress, and what protocols you might borrow."
        items={projects}
        bg="bg-white"
      />

      <Section
        title="Datasets"
        description="Are you looking for data to build AI or measure its performance? We are featuring open datasets that can be used for benchmarking quality of AI, or to improve how an AI system works."
        items={datasets}
        bg="bg-peach-extra-light"
      />

      <Section
        title="Guides"
        description="How can you create an AI plan for your justice organization, and what's the best way to impelement new AI develoments? Explore our guides for justice institution leaders."
        items={guides}
        bg="bg-white"
      />
    </main>
  )
}

function Section({ title, description, items, bg }: { title: string; description: string; items: SanityDoc[]; bg: string }) {
  return (
    <section className={`${bg} px-10 py-16`}>
      <h2 className="text-3xl font-bold text-navy mb-2">{title}</h2>
      <p className="text-gray-600 max-w-2xl mb-6">{description}</p>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-4 border rounded-lg shadow">
            {item.image?.asset?._ref && <div className="mb-4 h-40 bg-gray-100 rounded" /> /* Placeholder for image */}
            <h3 className="text-xl font-semibold text-navy">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
