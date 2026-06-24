// src/app/project/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity'
import imageUrlBuilder from '@sanity/image-url'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { portableTextComponents } from '@/components/CustomPortableText'
import { CustomPortableText } from '@/components/CustomPortableText'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'

const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(
    `*[_type == "project" && defined(slug.current)][].slug.current`
  )
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
      "tasks": tasks[]->{title, slug, icon{asset->{url}}},
      "relatedDatasets": relatedDatasets[]->{title, slug, "oneliner": oneliner, image{asset->{url}}},
      "relatedEvaluations": relatedEvaluations[]->{title, slug, method},
      "category": category->{title, slug, icon{asset->{url}}},
      "issue": issue->{title, slug, icon{asset->{url}}},
      "status": status->{status, description, color},
    }`,
    { slug: params.slug }
  )

  if (!project) return notFound()

  return (
    <main className="font-sans">
      {/* ═══ Hero ═══ */}
      <section className="bg-gradient-to-b from-peach-extra-light to-white px-6 sm:px-10 pt-8 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-navy transition">JusticeBench</Link>
            <span>/</span>
            <Link href="/#projects" className="hover:text-navy transition">Projects</Link>
            {project.issue?.title && (
              <>
                <span>/</span>
                <span className="text-gray-500">{project.issue.title}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: text */}
            <div className="flex-1">
              {/* Status badge */}
              {project.status?.status && (
                <span className="inline-block mb-3 rounded-full bg-navy text-white text-xs font-semibold px-3 py-1">
                  {project.status.status}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy leading-tight mb-4">
                {project.title}
              </h1>

              {project.oneliner && (
                <div className="text-lg text-gray-600 leading-relaxed mb-6 max-w-2xl">
                  <PortableText value={project.oneliner} components={portableTextComponents} />
                </div>
              )}

              {/* Chips: tasks, category, issue */}
              <div className="flex flex-wrap gap-2">
                {project.tasks?.length > 0 &&
                  project.tasks.map((task: any) => (
                    <Link
                      key={task.slug.current}
                      href={`/task/${task.slug.current}`}
                      className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-navy hover:border-navy/30 hover:shadow-sm transition"
                    >
                      {task.icon?.asset?.url && (
                        <Image
                          src={task.icon.asset.url}
                          alt=""
                          width={16}
                          height={16}
                        />
                      )}
                      <span>{task.title}</span>
                    </Link>
                  ))}
                {project.category && (
                  <Link
                    href={`/#${project.category.slug?.current}`}
                    className="flex items-center gap-1.5 bg-peach-extra-light border border-peach/30 rounded-full px-3 py-1.5 text-sm text-navy hover:border-navy/30 transition"
                  >
                    {project.category.icon?.asset?.url && (
                      <Image
                        src={project.category.icon.asset.url}
                        alt=""
                        width={16}
                        height={16}
                      />
                    )}
                    <span>{project.category.title}</span>
                  </Link>
                )}
                {project.issue && (
                  <Link
                    href={`/issue/${project.issue.slug?.current}`}
                    className="flex items-center gap-1.5 bg-navy/5 border border-navy/10 rounded-full px-3 py-1.5 text-sm text-navy hover:border-navy/30 transition"
                  >
                    {project.issue.icon?.asset?.url && (
                      <Image
                        src={project.issue.icon.asset.url}
                        alt=""
                        width={16}
                        height={16}
                      />
                    )}
                    <span>{project.issue.title}</span>
                  </Link>
                )}
              </div>

              {/* Project link + CTAs */}
              {project.url && (
                <div className="mt-6">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-navy/90 transition text-sm"
                  >
                    Visit Project ↗
                  </a>
                </div>
              )}
            </div>

            {/* Right: image */}
            {project.image && (
              <div className="lg:w-[420px] flex-shrink-0">
                <img
                  src={urlFor(project.image).width(840).url()}
                  alt={project.title}
                  className="rounded-xl shadow-md w-full"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Description ═══ */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 space-y-16">
        {project.description && (
          <section>
            <h2 className="text-3xl font-heading font-bold text-navy mb-6">
              About This Project
            </h2>
            <div className="prose prose-lg prose-gray max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-navy prose-a:decoration-peach prose-a:decoration-2 prose-a:underline-offset-2 prose-strong:text-navy prose-blockquote:border-l-peach prose-blockquote:bg-peach-extra-light prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-600">
              <CustomPortableText value={project.description} />
            </div>
          </section>
        )}

        {/* ═══ Related Datasets ═══ */}
        {project.relatedDatasets?.length > 0 && (
          <section>
            <h2 className="text-2xl font-heading font-bold text-navy mb-4">
              Related Datasets
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.relatedDatasets.map((d: any) => (
                <Link
                  key={d.slug?.current ?? d.title}
                  href={d.slug?.current ? `/dataset/${d.slug.current}` : '#'}
                  className="group flex gap-4 items-start rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md hover:border-navy/20 transition"
                >
                  {d.image?.asset?.url && (
                    <Image
                      src={d.image.asset.url}
                      alt=""
                      width={80}
                      height={80}
                      className="rounded-lg object-cover w-16 h-16 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-heading font-bold text-navy group-hover:underline leading-tight">
                      {d.title}
                    </h4>
                    {d.oneliner && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        <PortableText value={d.oneliner} components={portableTextComponents} />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ Related Evaluations ═══ */}
        {project.relatedEvaluations?.length > 0 && (
          <section>
            <h2 className="text-2xl font-heading font-bold text-navy mb-4">
              Related Evaluation Tools
            </h2>
            <div className="space-y-3">
              {project.relatedEvaluations.map((e: any) => (
                <Link
                  key={e.slug?.current ?? e.title}
                  href={e.slug?.current ? `/evaluation/${e.slug.current}` : '#'}
                  className="block rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm hover:border-navy/20 transition"
                >
                  <h4 className="font-heading font-bold text-navy">{e.title}</h4>
                  {e.method && (
                    <p className="text-sm text-gray-500 mt-1">{e.method}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
