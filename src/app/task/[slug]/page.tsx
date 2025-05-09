// src/app/task/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import '@/app/globals.css'

// Sanity image URL builder
const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

// Fetch a single task by slug
export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(`*[_type == "task" && defined(slug.current)][].slug.current`)
  return slugs.map((slug: string) => ({ slug }))
}

export default async function TaskPage({ params }: { params: { slug: string } }) {
  const task = await sanityClient.fetch(
    `*[_type == "task" && slug.current == $slug][0]{
      title,
      image,
      oneLiner,
      description,
      qualityStandards,
      "relatedProjects": relatedProjects[]->{title, slug},
      "relatedDatasets": relatedDatasets[]->{title, slug},
      "relatedEvaluations": relatedEvaluations[]->{title, slug},
      "relatedGuides": relatedGuides[]->{title, slug}
    }`,
    { slug: params.slug }
  )

  if (!task) return notFound()

  return (
    <main className="font-sans px-8 py-12 max-w-6xl mx-auto">
      <h1 className="text-6xl font-heading font-bold text-navy mb-6">{task.title}</h1>

      <div className="bg-peach-extra-light rounded-lg p-6 flex flex-col md:flex-row gap-6 mb-12">
        {task.image && (
          <img
            src={urlFor(task.image).width(800).url()}
            alt={task.title}
            className="rounded-lg w-full md:w-2/3 object-cover"
          />
        )}
        <div className="md:w-1/3">
          {task.oneLiner && (
            <PortableText value={task.oneLiner} />
          )}
        </div>
      </div>

      <Section title="Task Description" content={task.description} />
      <Section title="How to Measure Quality?" content={task.qualityStandards} />
      <ReferenceList title="Related Projects" items={task.relatedProjects} />
      <ReferenceList title="Related Datasets" items={task.relatedDatasets} />
      <ReferenceList title="Related Evaluation Tools" items={task.relatedEvaluations} />
      <ReferenceList title="Related Guides" items={task.relatedGuides} />
    </main>
  )
}

function Section({ title, content }: { title: string; content?: any }) {
  if (!content) return null
  return (
    <section className="mb-10">
      <h2 className="text-5xl font-heading text-navy mb-2">{title}</h2>
      <div className="prose">
        <PortableText value={content} />
      </div>
    </section>
  )
}

function ReferenceList({ title, items }: { title: string; items?: { title: string; slug: { current: string } }[] }) {
  if (!items || items.length === 0) return null
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-heading text-navy mb-2">{title}</h2>
      <ul className="list-disc pl-5 text-gray-700">
        {items.map((item) => (
          <li key={item.slug.current}>
            <a className="text-navy underline" href={`/project/${item.slug.current}`}>{item.title}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}
