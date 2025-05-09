// src/app/task/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import '@/app/globals.css'
import { CustomPortableText } from '@/components/CustomPortableText'


type Props = {
    params: {
      slug: string
    }
  }
  

// Sanity image URL builder
const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

// For static site generation
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await sanityClient.fetch(`*[_type == "task" && defined(slug.current)][].slug.current`)
  return slugs.map((slug: string) => ({ slug }))
}

export default async function TaskPage({ params }: any) {


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
      <h1 className="text-6xl font-heading font-bold text-navy mb-10">{task.title}</h1>

      <div className="bg-peach-extra-light rounded-lg p-6 flex flex-col md:flex-row gap-6 mb-16">
        {task.image && urlFor(task.image).url() && (
          <img
            src={urlFor(task.image).width(800).url()}
            alt={task.title}
            className="rounded-lg w-full md:w-2/3 object-cover"
          />
        )}
        <div className="md:w-1/3">
          {task.oneLiner && (
            <CustomPortableText value={task.oneLiner} />
          )}
        </div>
      </div>

      <Section title="Task Description" content={task.description} />
      <Section title="How to Measure Quality?" content={task.qualityStandards} />

      <ReferenceList title="Related Projects" items={task.relatedProjects} basePath="/project" />
      <ReferenceList title="Related Datasets" items={task.relatedDatasets} basePath="/dataset" />
      <ReferenceList title="Related Evaluation Tools" items={task.relatedEvaluations} basePath="/evaluation" />
      <ReferenceList title="Related Guides" items={task.relatedGuides} basePath="/guide" />
    </main>
  )
}

function Section({ title, content }: { title: string; content?: any }) {
  if (!content) return null
  return (
    <section className="mb-12">
      <h2 className="text-4xl font-heading text-navy mb-4 mt-8">{title}</h2>
      <div className="prose prose-lg">
        <CustomPortableText value={content} />
      </div>
    </section>
  )
}

function ReferenceList({
  title,
  items,
  basePath,
}: {
  title: string
  items?: { title: string; slug: { current: string } }[]
  basePath: string
}) {
  if (!items || items.length === 0) return null
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-heading text-navy mb-4">{title}</h2>
      <ul className="list-disc pl-6 text-gray-700 space-y-1">
        {items.map((item) => (
         <li key={item.slug?.current || item.title}>
         {item.slug?.current ? (
           <a className="text-navy underline" href={`/project/${item.slug.current}`}>{item.title}</a>
         ) : (
           <span className="text-gray-500">{item.title}</span>
         )}
       </li>
        ))}
      </ul>
    </section>
  )
}
