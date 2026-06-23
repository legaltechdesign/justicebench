// src/app/task/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity'
import imageUrlBuilder from '@sanity/image-url'
import { notFound } from 'next/navigation'
import { CustomPortableText } from '@/components/CustomPortableText'
import { portableTextComponents } from '@/components/CustomPortableText'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) {
  return builder.image(source)
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await sanityClient.fetch(
    `*[_type == "task" && defined(slug.current)][].slug.current`
  )
  return slugs.map((slug: string) => ({ slug }))
}

export default async function TaskPage({ params }: any) {
  const task = await sanityClient.fetch(
    `*[_type == "task" && slug.current == $slug][0]{
      title,
      image,
      code,
      oneLiner,
      description,
      qualityStandards,
      "category": category->{
        _id,
        title,
        slug
      },
      "siblingTasks": *[_type == "task" && category._ref == ^.category._ref && slug.current != $slug] | order(coalesce(sortOrder, 9999) asc, code asc){
        _id,
        title,
        slug,
        code,
        icon{asset->{url}}
      },
      "relatedProjects": *[_type == "project" && references(^._id)]{
        _id,
        title,
        slug,
        "oneliner": oneliner,
        image{ asset->{ url } },
        status->{ status },
        category->{ title, slug },
        issue->{ title, slug }
      },
      "relatedDatasets": relatedDatasets[]->{title, slug, "oneliner": oneliner, image{asset->{url}}, datasetType},
      "relatedEvaluations": relatedEvaluations[]->{title, slug, method},
      "relatedGuides": relatedGuides[]->{title, slug, "oneliner": oneliner, link}
    }`,
    { slug: params.slug }
  )

  if (!task) return notFound()

  const projectCount = task.relatedProjects?.length ?? 0
  const datasetCount = task.relatedDatasets?.length ?? 0
  const guideCount = task.relatedGuides?.length ?? 0

  return (
    <main className="font-sans">
      {/* ═══ Hero ═══ */}
      <section className="bg-gradient-to-b from-peach-extra-light to-white px-6 sm:px-10 pt-8 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-navy transition">JusticeBench</Link>
            <span>/</span>
            <Link href="/task" className="hover:text-navy transition">Tasks</Link>
            {task.category?.title && (
              <>
                <span>/</span>
                <Link
                  href={`/task#${task.category.slug?.current ?? ''}`}
                  className="hover:text-navy transition"
                >
                  {task.category.title}
                </Link>
              </>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left: text */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy leading-tight">
                  {task.title}
                </h1>
                {task.code && (
                  <span className="text-sm font-semibold bg-navy text-white px-3 py-1 rounded-full whitespace-nowrap">
                    {task.code}
                  </span>
                )}
              </div>

              {task.oneLiner && (
                <div className="text-lg text-gray-600 leading-relaxed mb-6 max-w-2xl">
                  <CustomPortableText value={task.oneLiner} />
                </div>
              )}

              {/* Quick stats */}
              <div className="flex flex-wrap gap-3">
                {projectCount > 0 && (
                  <a href="#projects" className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-navy hover:border-navy/30 transition">
                    🛠️ {projectCount} project{projectCount !== 1 ? 's' : ''}
                  </a>
                )}
                {datasetCount > 0 && (
                  <a href="#data" className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-navy hover:border-navy/30 transition">
                    📊 {datasetCount} dataset{datasetCount !== 1 ? 's' : ''}
                  </a>
                )}
                {guideCount > 0 && (
                  <a href="#guides" className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-navy hover:border-navy/30 transition">
                    📚 {guideCount} guide{guideCount !== 1 ? 's' : ''}
                  </a>
                )}
              </div>
            </div>

            {/* Right: image */}
            {task.image && urlFor(task.image).url() && (
              <div className="lg:w-[360px] flex-shrink-0">
                <img
                  src={urlFor(task.image).width(720).url()}
                  alt={task.title}
                  className="rounded-xl shadow-md w-full"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Tab-style jump nav ═══ */}
      <div className="sticky top-[64px] z-40 bg-white border-b border-gray-200 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto py-2 -mb-px">
          {[
            { id: 'description', label: 'Overview' },
            { id: 'quality', label: 'Quality Standards', show: !!task.qualityStandards },
            { id: 'data', label: 'Data & Evaluation', show: datasetCount > 0 },
            { id: 'projects', label: 'Projects', show: projectCount > 0 },
            { id: 'guides', label: 'Guides', show: guideCount > 0 },
          ]
            .filter((t) => t.show !== false)
            .map((tab) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-500 hover:text-navy border-b-2 border-transparent hover:border-navy/30 transition"
              >
                {tab.label}
              </a>
            ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 space-y-16">
        {/* ═══ Description ═══ */}
        {task.description && (
          <section id="description" className="scroll-mt-28">
            <h2 className="text-3xl font-heading font-bold text-navy mb-6">
              About This Task
            </h2>
            <div className="prose prose-lg prose-gray max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-navy prose-a:decoration-peach prose-a:decoration-2 prose-a:underline-offset-2 prose-strong:text-navy prose-blockquote:border-l-peach prose-blockquote:bg-peach-extra-light prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-600">
              <CustomPortableText value={task.description} />
            </div>
          </section>
        )}

        {/* ═══ Quality Standards ═══ */}
        {task.qualityStandards && (
          <section id="quality" className="scroll-mt-28">
            <div className="rounded-xl border-2 border-navy/10 bg-gradient-to-br from-peach-extra-light to-white p-8">
              <h2 className="text-3xl font-heading font-bold text-navy mb-2">
                Quality Standards
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                What does good performance look like for this task? Use these criteria to evaluate systems.
              </p>
              <div className="prose prose-lg prose-gray max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-navy prose-a:decoration-peach prose-a:decoration-2 prose-a:underline-offset-2 prose-strong:text-navy prose-blockquote:border-l-peach prose-blockquote:bg-white prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-600 prose-li:marker:text-navy">
                <CustomPortableText value={task.qualityStandards} />
              </div>
            </div>
          </section>
        )}

        {/* ═══ Data & Evaluation ═══ */}
        {(datasetCount > 0 || task.relatedEvaluations?.length > 0) && (
          <section id="data" className="scroll-mt-28">
            <h2 className="text-3xl font-heading font-bold text-navy mb-2">
              Data &amp; Evaluation Resources
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Datasets, benchmarks, and evaluation tools relevant to this task.
            </p>

            {/* Datasets */}
            {datasetCount > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {task.relatedDatasets.map((d: any) => (
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
                      {d.datasetType && (
                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">{d.datasetType}</span>
                      )}
                      {d.oneliner && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          <PortableText value={d.oneliner} components={portableTextComponents} />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Evaluations */}
            {task.relatedEvaluations?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-heading font-semibold text-navy">Evaluation Tools</h3>
                {task.relatedEvaluations.map((e: any) => (
                  <Link
                    key={e.slug?.current ?? e.title}
                    href={e.slug?.current ? `/evaluation/${e.slug.current}` : '#'}
                    className="block rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm hover:border-navy/20 transition"
                  >
                    <h4 className="font-heading font-bold text-navy">{e.title}</h4>
                    {e.method && <p className="text-sm text-gray-500 mt-1">{e.method}</p>}
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ═══ Projects ═══ */}
        {projectCount > 0 && (
          <section id="projects" className="scroll-mt-28">
            <h2 className="text-3xl font-heading font-bold text-navy mb-2">
              Projects Building This Task
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {projectCount} project{projectCount !== 1 ? 's are' : ' is'} working on this task across the field.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {task.relatedProjects.map((p: any) => (
                <Link
                  key={p._id}
                  href={p.slug?.current ? `/project/${p.slug.current}` : '#'}
                  className="group block"
                >
                  <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition h-full flex flex-col">
                    {p.status?.status && (
                      <span className="absolute top-3 left-3 z-10 rounded-full bg-navy text-white text-[11px] px-2.5 py-1 font-medium">
                        {p.status.status}
                      </span>
                    )}
                    {p.image?.asset?.url && (
                      <Image
                        src={p.image.asset.url}
                        alt={p.title}
                        width={400}
                        height={220}
                        className="object-cover w-full h-40"
                      />
                    )}
                    <div className="p-4 flex-1">
                      <h4 className="text-base font-heading font-bold text-navy mb-1 group-hover:underline leading-tight">
                        {p.title}
                      </h4>
                      {p.oneliner && (
                        <div className="text-xs text-gray-600 line-clamp-2">
                          <PortableText value={p.oneliner} components={portableTextComponents} />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.issue?.title && (
                          <span className="text-[10px] bg-peach-extra-light text-navy rounded-full px-2 py-0.5">
                            {p.issue.title}
                          </span>
                        )}
                        {p.category?.title && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                            {p.category.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ Guides ═══ */}
        {guideCount > 0 && (
          <section id="guides" className="scroll-mt-28">
            <h2 className="text-3xl font-heading font-bold text-navy mb-6">
              Related Guides
            </h2>
            <div className="space-y-3">
              {task.relatedGuides.map((g: any) => {
                const href = g.slug?.current ? `/guide/${g.slug.current}` : g.link || '#'
                return (
                  <a
                    key={g.slug?.current ?? g.title}
                    href={href}
                    target={g.link && !g.slug?.current ? '_blank' : undefined}
                    rel={g.link && !g.slug?.current ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm hover:border-navy/20 transition"
                  >
                    <span className="text-2xl">📚</span>
                    <div>
                      <h4 className="font-heading font-bold text-navy">{g.title}</h4>
                      {g.oneliner && (
                        <div className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                          <PortableText value={g.oneliner} components={portableTextComponents} />
                        </div>
                      )}
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}

        {/* ═══ Sibling Tasks ═══ */}
        {task.siblingTasks?.length > 0 && (
          <section className="pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-heading font-bold text-navy mb-2">
              Other {task.category?.title ?? ''} Tasks
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Explore related tasks in the same workflow category.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {task.siblingTasks.map((sibling: any) => (
                <Link
                  key={sibling._id}
                  href={sibling.slug?.current ? `/task/${sibling.slug.current}` : '#'}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white hover:shadow-sm hover:border-navy/20 transition p-3"
                >
                  {sibling.icon?.asset?.url ? (
                    <Image
                      src={sibling.icon.asset.url}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full bg-peach-extra-light"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-peach-extra-light flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-heading font-semibold text-navy leading-tight line-clamp-1">
                      {sibling.title}
                    </span>
                    {sibling.code && (
                      <span className="text-[10px] text-gray-400 ml-1">{sibling.code}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
