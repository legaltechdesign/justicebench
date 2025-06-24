// src/app/project/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { portableTextComponents } from '@/components/CustomPortableText'
import { CustomPortableText } from '@/components/CustomPortableText'

const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

export async function generateStaticParams() {
    const slugs = await sanityClient.fetch(`*[_type == "project" && defined(slug.current)][].slug.current`)
    return slugs.map((slug: string) => ({ slug }))
  }

import type { Metadata, ResolvingMetadata } from 'next'

export default async function ProjectPage({ params }: any) {


  const project = await sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      title,
      image,
      oneliner,
      description,
      url,
      "relatedTasks": relatedTasks[]->{title, slug, icon},
      "relatedDatasets": relatedDatasets[]->{title, slug},
      "relatedEvaluations": relatedEvaluations[]->{title, slug},
      "categories": categories[]->{title, slug, icon},
      "legalIssue": legalIssue->{title, slug, icon}
    }`,
    { slug: params.slug }
  )

  if (!project) return notFound()

  return (
    <main className="font-sans px-8 py-12 max-w-6xl mx-auto">
      <h1 className="text-6xl font-heading font-bold text-navy mb-6">{project.title}</h1>

      <div className="bg-peach-extra-light rounded-lg p-6 flex flex-col md:flex-row gap-6 mb-12">
  {project.image && (
    <img
      src={urlFor(project.image).width(800).url()}
      alt={project.title}
      className="rounded-lg w-full md:w-2/3 object-cover"
    />
  )}
  <div className="md:w-1/3 space-y-4">
    {project.oneliner && (
      <PortableText value={project.oneliner} components={portableTextComponents} />
    )}

    <div className="flex flex-wrap gap-3 pt-4">
      {project.legalIssue && (
        <LabelTag
          label="Legal Issue"
          item={project.legalIssue}
          baseUrl="/issue"
        />
      )}
      {project.categories?.map((cat) => (
        <LabelTag key={cat.slug.current} label="Category" item={cat} baseUrl="/category" />
      ))}
      {project.relatedTasks?.map((task) => (
        <LabelTag key={task.slug.current} label="Task" item={task} baseUrl="/task" />
      ))}
    </div>
  </div>
</div>

      
      <Section title="Project Description" content={project.description} />
     
      {project.url && (
        <div className="mb-10">
          <h2 className="text-2xl font-heading text-navy mb-2">Link to Project</h2>
          <a
            href={project.url}
            className="text-navy underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.url}
          </a>
        </div>
      )}

      <ReferenceList title="Related Tasks" items={project.relatedTasks} baseUrl="/task" />
      <ReferenceList title="Related Datasets" items={project.relatedDatasets} baseUrl="/dataset" />
      <ReferenceList title="Related Evaluation Tools" items={project.relatedEvaluations} baseUrl="/evaluation" />

      {project.categories?.length > 0 && (
        <ReferenceList title="Categories" items={project.categories} baseUrl="/category" />
      )}
    </main>
  )
}

function Section({ title, content }: { title: string; content?: any }) {
  if (!content) return null
  return (
    <section className="mb-10">
      <h2 className="text-4xl font-heading text-navy mb-4">{title}</h2>
      <div className="prose prose-lg">
        <CustomPortableText value={content} />
      </div>
    </section>
  )
}

function LabelTag({
  label,
  item,
  baseUrl,
}: {
  label: string
  item: { title: string; slug: { current: string }; icon?: { asset?: { url: string } } }
  baseUrl: string
}) {
  return (
    <Link
      href={`${baseUrl}/${item.slug.current}`}
      className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
    >
      {item.icon?.asset?.url && (
        <img src={item.icon.asset.url} alt={item.title} className="w-4 h-4 mr-2" />
      )}
      <span className="font-semibold mr-1">{label}:</span> {item.title}
    </Link>
  )
}


function ReferenceList({
  title,
  items,
  baseUrl,
}: {
  title: string
  items?: { title: string; slug: { current: string } }[]
  baseUrl: string
}) {
  if (!items || items.length === 0) return null
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-heading text-navy mb-2">{title}</h2>
      <ul className="list-disc pl-5 text-gray-700">
        {items.map((item) => (
          <li key={item.slug.current}>
            <Link href={`${baseUrl}/${item.slug.current}`} className="text-navy underline">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
