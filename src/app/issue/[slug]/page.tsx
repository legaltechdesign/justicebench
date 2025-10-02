// src/app/issue/[slug]/page.tsx
import { sanityClient } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { CustomPortableText } from '@/components/CustomPortableText'

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(
    `*[_type == "issue" && defined(slug.current)][].slug.current`
  )
  return slugs.map((slug: string) => ({ slug }))
}

export default async function IssuePage({ params }: { params: { slug: string } }) {
  const issue = await sanityClient.fetch(
    `*[_type == "issue" && slug.current == $slug][0]{
      title,
      oneLiner,
      description,
      heroTags,
      languages,
      jurisdictions[]->{ name, code, type },
      listCode,
      listCodeUrl,
      icon{ asset->{ url } },

      // Workflows (15 tiles)
      workflows[]{
        title,
        oneLiner,
        sampleQuote,
        serviceTypes,
        tags,
        impact{ timeSavedMins, riskLevel },
        // Split spotlights into project refs vs idea objects
        "spotlightProjects": aiSpotlights[_type == "reference"]->{
          _id, title, "slug": slug.current, image{asset->{url}}, oneliner
        },
        "ideas": aiSpotlights[_type == "idea"]{ label, description, link }
      },

      // Service portfolio rows
      servicePortfolio[]{ serviceLine, scope, channels, aiSupport },

      // Explicit issue-wide links
      aiProjects[]->{ _id, title, "slug": slug.current, image{asset->{url}}, oneliner },

      // Back-compat: any project that references this issue
      "projectsByRef": *[_type == "project" && references(^._id)]{
        _id, title, "slug": slug.current, image{asset->{url}}, oneliner
      },

      // Evidence
      benchmarks[]->{ title, "slug": slug.current },
      datasets[]->{ title, "slug": slug.current },

      // Impact
      kpis{ volume, timeSaved, riskReduction, languageParity },
      faq[]{ q, a },
      ctas[]{ label, href, style }
    }`,
    { slug: params.slug }
  )

  if (!issue) return notFound()

  // Merge explicit aiProjects with back-compat referenced projects; de-dupe by _id
  const projectMap: Record<string, any> = {}
  ;[...(issue.aiProjects ?? []), ...(issue.projectsByRef ?? [])].forEach((p: any) => {
    if (p?._id) projectMap[p._id] = p
  })
  const mergedProjects = Object.values(projectMap)

  return (
    <main className="font-sans px-6 py-12 max-w-6xl mx-auto">
      {/* Title */}
      <h1 className="text-5xl font-heading font-bold text-navy mb-6">{issue.title}</h1>

      {/* Hero / one-liner */}
      <div className="bg-peach-extra-light rounded-lg p-6 flex flex-col md:flex-row gap-6 mb-12">
        {issue.icon?.asset?.url && (
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
        <div className="w-full md:w-3/4 flex flex-col justify-center gap-3">
          {issue.oneLiner && (
            <p className="text-lg text-gray-800">{issue.oneLiner}</p>
          )}
          {/* Hero tags (subtopics) */}
          {issue.heroTags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {issue.heroTags.map((t: string) => (
                <span
                  key={t}
                  className="inline-block rounded-full bg-white border px-3 py-1 text-sm text-gray-700"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {/* Optional lang / jurisdiction chips */}
          <div className="flex flex-wrap gap-2 mt-1">
            {issue.languages?.map((lang: string) => (
              <span key={lang} className="text-xs px-2 py-0.5 rounded bg-white border text-gray-600">
                {lang.toUpperCase()}
              </span>
            ))}
            {issue.jurisdictions?.map((j: any) => (
              <span key={j.code} className="text-xs px-2 py-0.5 rounded bg-white border text-gray-600">
                {j.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      {issue.description && (
        <section className="mb-10">
          <h2 className="text-3xl font-heading text-navy mb-2">
            More About This Legal Services Area
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{issue.description}</p>
        </section>
      )}

      {/* LIST code */}
      <section className="mb-12">
        <h2 className="text-2xl font-heading text-navy mb-2">
          LIST (Legal Issues Taxonomy) Code
        </h2>
        {issue.listCode ? (
          <p className="text-gray-700">
            Code: <strong>{issue.listCode}</strong>{' '}
            {issue.listCodeUrl && (
              <Link
                href={issue.listCodeUrl}
                className="text-navy underline ml-2"
                target="_blank"
              >
                View on taxonomy.legal
              </Link>
            )}
          </p>
        ) : (
          <p className="text-gray-700">
            <Link href="https://taxonomy.legal" className="text-navy underline">
              Explore all LIST codes at taxonomy.legal
            </Link>
          </p>
        )}
      </section>

      {/* Workflows grid */}
      {issue.workflows?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-heading text-navy mb-4">Top Workflows & Needs</h2>
          <p className="text-gray-700 mb-6">
            Common scenarios in this issue area, with typical service types and AI support ideas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issue.workflows.map((w: any, idx: number) => (
              <div key={idx} className="bg-white border rounded-lg shadow p-4">
                <h3 className="text-lg font-bold text-navy leading-snug">{w.title}</h3>
                {w.oneLiner && (
                  <p className="mt-1 text-sm text-gray-700">{w.oneLiner}</p>
                )}
                {w.sampleQuote && (
                  <figure className="mt-3 rounded bg-peach-extra-light/50 border p-3 text-sm">
                    <blockquote>“{w.sampleQuote}”</blockquote>
                  </figure>
                )}

                {/* Service types / tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {w.serviceTypes?.map((s: string) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded bg-white border text-gray-600">
                      {s}
                    </span>
                  ))}
                  {w.tags?.map((t: string) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded bg-white border text-gray-600">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Impact ribbon */}
                {(w.impact?.timeSavedMins || w.impact?.riskLevel) && (
                  <div className="mt-3 text-xs text-gray-600">
                    {w.impact?.timeSavedMins != null && (
                      <span className="mr-3">Time saved ~{w.impact.timeSavedMins}m</span>
                    )}
                    {w.impact?.riskLevel && <span>Risk: {w.impact.riskLevel}</span>}
                  </div>
                )}

                {/* Per-workflow spotlights and ideas */}
                {(w.spotlightProjects?.length > 0 || w.ideas?.length > 0) && (
                  <div className="mt-4 border-t pt-3">
                    {w.spotlightProjects?.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs font-semibold text-gray-700 mb-1">
                          Project spotlights
                        </div>
                        <ul className="space-y-1">
                          {w.spotlightProjects.map((p: any) => (
                            <li key={p._id} className="text-sm">
                              <Link
                                className="text-navy underline"
                                href={`/project/${p.slug}`}
                              >
                                {p.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {w.ideas?.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-1">Ideas</div>
                        <ul className="space-y-1">
                          {w.ideas.map((i: any, iidx: number) => (
                            <li key={iidx} className="text-sm">
                              <span className="font-medium">{i.label} — </span>
                              <span className="text-gray-700">{i.description}</span>
                              {i.link && (
                                <>
                                  {' '}
                                  <Link href={i.link} target="_blank" className="underline text-navy">
                                    Learn more
                                  </Link>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Service Portfolio */}
      {issue.servicePortfolio?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-heading text-navy mb-4">Service Portfolio & Referrals</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-peach-extra-light/70">
                <tr>
                  <th className="px-4 py-3 text-left">Service Line</th>
                  <th className="px-4 py-3 text-left">Scope</th>
                  <th className="px-4 py-3 text-left">Channels</th>
                  <th className="px-4 py-3 text-left">AI Support</th>
                </tr>
              </thead>
              <tbody>
                {issue.servicePortfolio.map((row: any, ridx: number) => (
                  <tr key={ridx} className="border-t">
                    <td className="px-4 py-3 font-medium">{row.serviceLine}</td>
                    <td className="px-4 py-3">{row.scope}</td>
                    <td className="px-4 py-3">{row.channels}</td>
                    <td className="px-4 py-3">{row.aiSupport}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* AI Projects (merged) */}
      {mergedProjects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-heading text-navy mb-6">AI Projects around this Legal Issue</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mergedProjects.map((project: any) => (
              <Link key={project._id} href={`/project/${project.slug}`}>
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
                  <h3 className="text-xl font-bold text-navy mb-2 leading-tight">
                    {project.title}
                  </h3>
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

      {/* Benchmarks & Datasets */}
      {(issue.benchmarks?.length > 0 || issue.datasets?.length > 0) && (
        <section className="mb-12">
          <h2 className="text-3xl font-heading text-navy mb-6">Benchmarks & Datasets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg shadow p-4">
              <h3 className="text-lg font-bold text-navy mb-3">Benchmarks</h3>
              {issue.benchmarks?.length ? (
                <ul className="list-disc pl-5 space-y-1">
                  {issue.benchmarks.map((b: any, bidx: number) => (
                    <li key={bidx}>
                      <Link className="underline text-navy" href={`/benchmark/${b.slug}`}>
                        {b.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">No benchmarks listed yet.</p>
              )}
            </div>
            <div className="bg-white border rounded-lg shadow p-4">
              <h3 className="text-lg font-bold text-navy mb-3">Datasets</h3>
              {issue.datasets?.length ? (
                <ul className="list-disc pl-5 space-y-1">
                  {issue.datasets.map((d: any, didx: number) => (
                    <li key={didx}>
                      <Link className="underline text-navy" href={`/dataset/${d.slug}`}>
                        {d.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">No datasets listed yet.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Impact & FAQ */}
      {(issue.kpis || issue.faq?.length > 0 || issue.ctas?.length > 0) && (
        <section className="mb-12">
          <h2 className="text-3xl font-heading text-navy mb-6">Impact & FAQ</h2>

          {/* KPIs */}
          {issue.kpis && (
            <div className="bg-white border rounded-lg shadow p-4 mb-6">
              <h3 className="text-lg font-bold text-navy mb-2">Impact & KPIs</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                {issue.kpis.volume && <li><strong>Volume:</strong> {issue.kpis.volume}</li>}
                {issue.kpis.timeSaved && <li><strong>Time saved:</strong> {issue.kpis.timeSaved}</li>}
                {issue.kpis.languageParity && <li><strong>Language parity:</strong> {issue.kpis.languageParity}</li>}
                {issue.kpis.riskReduction && (
                  <li className="md:col-span-2">
                    <strong>Risk reduction:</strong> {issue.kpis.riskReduction}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* FAQ */}
          {issue.faq?.length > 0 && (
            <div className="bg-white border rounded-lg shadow p-4 mb-6">
              <h3 className="text-lg font-bold text-navy mb-2">Frequently Asked Questions</h3>
              <ul className="space-y-3">
                {issue.faq.map((f: any, fidx: number) => (
                  <li key={fidx}>
                    <p className="font-semibold text-gray-800">{f.q}</p>
                    <p className="text-gray-700 whitespace-pre-line">{f.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTAs */}
          {issue.ctas?.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {issue.ctas.map((c: any, cidx: number) => (
                <Link key={cidx} href={c.href} target="_blank">
                  <span
                    className={[
                      'inline-block rounded px-4 py-2 border',
                      c.style === 'primary'
                        ? 'bg-navy text-white border-navy'
                        : c.style === 'outline'
                        ? 'bg-white text-navy border-navy'
                        : 'bg-white text-gray-800 border-gray-300'
                    ].join(' ')}
                  >
                    {c.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}
