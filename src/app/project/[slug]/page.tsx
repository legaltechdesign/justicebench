// src/app/project/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { portableTextComponents } from '@/components/CustomPortableText'
import { CustomPortableText } from '@/components/CustomPortableText'
import Image from 'next/image'

const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(`*[_type == "project" && defined(slug.current)][].slug.current`)
  return slugs.map((slug: string) => ({ slug }))
}

export default async function ProjectPage({ params }: any) {
  const project = await sanityClient.fetch(
    `*[_type == "project" && slug.current == $slug][0]{
      title,
      image,
      oneliner,
      description,
      url,
      "tasks": tasks[]->{title, slug, icon},
      "relatedDatasets": relatedDatasets[]->{title, slug},
      "relatedEvaluations": relatedEvaluations[]->{title, slug},
      "category": category->{title, slug, icon},
      "issue": issue->{title, slug, icon}
    }`,
    { slug: params.slug }
  )

  if (!project) return notFound()

  return (
    <main className="font-sans px-8 py-12 max-w-6xl mx-auto">
      <h1 className="text-6xl font-heading font-bold text-navy mb-6">{project.title}</h1>

      <div className="bg-peach-extra-light rounded-lg p-6 flex flex-col md:flex-row gap-6 mb-6">
        {project.image && (
          <img
            src={urlFor(project.image).width(800).url()}
            alt={project.title}
            className="rounded-lg w-full md:w-2/3 object-cover"
          />
        )}
        <div className="md:w-1/3">
          {project.oneliner && (
            <PortableText value={project.oneliner} components={portableTextComponents} />
          )}

          <div className="bg-peach-light rounded-lg p-4 mt-4 flex flex-wrap gap-4 items-center">
            {project.tasks?.length > 0 && project.tasks.map((task: any) => (
              <Link key={task.slug.current} href={`/task/${task.slug.current}`} className="flex items-center bg-white rounded-full px-3 py-1 text-sm text-gray-800 hover:bg-gray-100">
                {task.icon?.asset?.url && (
                  <Image src={task.icon.asset.url} alt="task icon" width={20} height={20} className="mr-2" />
                )}
                <span>Task: {task.title}</span>
              </Link>
            ))}
            {project.category && (
              <Link href={`/#${project.category.slug?.current}`} className="flex items-center bg-white rounded-full px-3 py-1 text-sm text-gray-800 hover:bg-gray-100">
                {project.category.icon?.asset?.url && (
                  <Image src={project.category.icon.asset.url} alt="category icon" width={20} height={20} className="mr-2" />
                )}
                <span>Category: {project.category.title}</span>
              </Link>
            )}
            {project.issue && (
              <Link href={`/issue/${project.issue.slug.current}`} className="flex items-center bg-navy rounded-full px-3 py-1 text-sm text-white hover:bg-gray-900">
                {project.issue.icon?.asset?.url && (
                  <Image src={project.issue.icon.asset.url} alt="issue icon" width={20} height={20} className="mr-2" />
                )}
                <span>Legal Issue: {project.issue.title}</span>
              </Link>
            )}
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

      <ReferenceList title="Related Datasets" items={project.relatedDatasets} baseUrl="/dataset" />
      <ReferenceList title="Related Evaluation Tools" items={project.relatedEvaluations} baseUrl="/evaluation" />
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
