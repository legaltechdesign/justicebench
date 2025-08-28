// src/app/issue/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { CustomPortableText } from '@/components/CustomPortableText'

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(`*[_type == "issue" && defined(slug.current)][].slug.current`)
  return slugs.map((slug: string) => ({ slug }))
}

export default async function IssuePage({ params }: any) {
  const issue = await sanityClient.fetch(
    `*[_type == "issue" && slug.current == $slug][0]{
      title,
      oneLiner,
      description,
      listCode,
      listCodeUrl,
      icon{
        asset->{
          _id,
          url
  }},
      "projects": *[_type == "project" && references(^._id)]{title, slug, image {asset->{ _id, url}},oneliner}
    }`,
    { slug: params.slug }
  )

  if (!issue) return notFound()

  return (
    <main className="font-sans px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-5xl font-heading font-bold text-navy mb-6">{issue.title}</h1>

      <div className="bg-peach-extra-light rounded-lg p-6 flex flex-col md:flex-row gap-6 mb-12">
        {issue.icon && (
          <div className="w-full md:w-1/4">
            <Image
              src={issue.icon.asset.url}
              alt={issue.title}
              width={200}
              height={200}
              className="rounded"
            />
          </div>
        )}
        <div className="w-full md:w-3/4 flex items-center">
          <p className="text-lg text-gray-800">{issue.oneLiner}</p>
        </div>
      </div>

      {issue.description && (
        <section className="mb-10">
          <h2 className="text-3xl font-heading text-navy mb-2">More About This Legal Services Area</h2>
          <p className="text-gray-700 whitespace-pre-line">{issue.description}</p>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-heading text-navy mb-2">LIST (Legal Issues Taxonomy) Code</h2>
        {issue.listCode ? (
          <p className="text-gray-700">
            Code: <strong>{issue.listCode}</strong>{' '}
            {issue.listCodeUrl && (
              <Link href={issue.listCodeUrl} className="text-navy underline ml-2" target="_blank">
                View on the LIST website, taxonomy.legal
              </Link>
            )}
          </p>
        ) : (
          <p className="text-gray-700">
            <Link href="https://taxonomy.legal" className="text-navy underline">
              Explore all Legal Issue codes at the LIST taxonomy website
            </Link>
          </p>
        )}
      </section>

      {issue.projects?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-heading text-navy mb-6">AI Projects around this Legal Issue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issue.projects.map((project: any) => (
              <Link key={project.slug.current} href={`/project/${project.slug.current}`}>
                <div className="bg-white border rounded-lg shadow p-4 hover:shadow-md transition">
                  {project.image?.asset?.url && (
                    <Image
                      src={project.image.asset.url}
                      alt={project.title}
                      width={400}
                      height={200}
                      className="object-cover w-full h-40 rounded mb-3"
                    />
                  )}
                  <h3 className="text-xl font-bold text-navy mb-2 leading-tight">{project.title}</h3>
                  {project.oneliner && (
                    <div className="text-sm text-gray-700 leading-snug">
                      <PortableText value={project.oneliner} />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
