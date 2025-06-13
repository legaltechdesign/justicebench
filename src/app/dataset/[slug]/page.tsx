// src/app/dataset/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { portableTextComponents } from '@/components/CustomPortableText'
import { CustomPortableText } from '@/components/CustomPortableText'
import Link from 'next/link'

const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(`*[_type == "dataset" && defined(slug.current)][].slug.current`)
  return slugs.map((slug: string) => ({ slug }))
}

export default async function DatasetPage({ params }: any) {
  const dataset = await sanityClient.fetch(
    `*[_type == "dataset" && slug.current == $slug][0]{
      title,
      oneliner,
      description,
      image,
      link
    }`,
    { slug: params.slug }
  )

  if (!dataset) return notFound()

  return (
    <main className="font-sans px-8 py-12 max-w-6xl mx-auto">
      <h1 className="text-6xl font-heading font-bold text-navy mb-6">{dataset.title}</h1>

      <div className="bg-peach-extra-light rounded-lg p-6 flex flex-col md:flex-row gap-6 mb-12">
        {dataset.image && (
          <img
            src={urlFor(dataset.image).width(800).url()}
            alt={dataset.title}
            className="rounded-lg w-full md:w-2/3 object-cover"
          />
        )}
        <div className="md:w-1/3">
          {dataset.oneliner && (
            <PortableText value={dataset.oneliner} components={portableTextComponents} />
          )}
        </div>
      </div>

      <Section title="Description" content={dataset.description} />

      {dataset.link && (
        <div className="mb-10">
          <h2 className="text-2xl font-heading text-navy mb-2">Access the Dataset</h2>
          <a
            href={dataset.link}
            className="text-navy underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {dataset.link}
          </a>
        </div>
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

