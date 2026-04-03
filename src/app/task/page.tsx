// src/app/task/page.tsx  (server component)
import { sanityClient } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/CustomPortableText'

export const revalidate = 300

export const metadata = {
  title: 'Task Taxonomy — JusticeBench',
  description:
    'A taxonomy of 40+ AI tasks that can improve how people get legal help and how providers serve them — organized by workflow stage.',
}

async function fetchTasksByCategory() {
  return sanityClient.fetch(`
    *[_type == "category"] | order(coalesce(sortOrder, 9999) asc, title asc){
      _id,
      title,
      slug,
      description,
      oneliner,
      sortOrder,
      icon{ asset->{url} },
      "tasks": *[_type == "task" && references(^._id)] | order(coalesce(sortOrder, 9999) asc, code asc, title asc){
        _id,
        title,
        slug,
        code,
        sortOrder,
        "oneLiner": oneLiner,
        icon{asset->{url}},
        image{asset->{url}},
        "projectCount": count(*[_type == "project" && references(^._id)])
      }
    }
  `)
}

export default async function TasksPage() {
  const categories = await fetchTasksByCategory()
  const categoriesWithTasks = categories.filter(
    (c: any) => Array.isArray(c.tasks) && c.tasks.length > 0
  )

  const totalTasks = categoriesWithTasks.reduce(
    (sum: number, c: any) => sum + c.tasks.length,
    0
  )

  return (
    <main className="font-sans">
      {/* Hero */}
      <section className="bg-navy py-14 px-6 sm:px-10 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-medium text-peach mb-3">
            <Link href="/" className="hover:underline">
              JusticeBench
            </Link>{' '}
            / Tasks
          </p>
          <h1 className="text-4xl md:text-5xl text-white font-heading font-bold mb-4">
            AI Task Taxonomy
          </h1>
          <p className="text-white/80 max-w-3xl mx-auto text-lg mb-6">
            {totalTasks} specific tasks where AI can improve how people get
            legal help and how providers serve them — organized by workflow
            stage across all problem types and geographies.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/journey"
              className="inline-block border border-white/30 text-white font-semibold px-5 py-2.5 rounded-lg hover:border-peach hover:text-peach transition text-sm"
            >
              How tasks map to the justice journey →
            </Link>
          </div>
        </div>
      </section>

      {/* Jump menu */}
      <section className="bg-peach-extra-light border-b border-peach py-6 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-heading font-semibold text-navy mb-3 text-center uppercase tracking-wide">
            Jump to a category
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {categoriesWithTasks.map((cat: any) => (
              <Link
                key={cat._id}
                href={`#${cat.slug?.current ?? ''}`}
                className="flex items-center gap-2 bg-white/70 hover:bg-white border border-gray-200 hover:border-navy/30 rounded-lg px-3 py-2 transition text-sm"
              >
                {cat.icon?.asset?.url && (
                  <Image
                    src={cat.icon.asset.url}
                    alt=""
                    width={22}
                    height={22}
                    className="rounded-sm"
                  />
                )}
                <span className="font-medium text-navy">{cat.title}</span>
                <span className="text-xs text-gray-400">
                  {cat.tasks.length}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories + tasks */}
      <section className="bg-white py-12 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          {categoriesWithTasks.map((category: any) => (
            <div
              key={category._id}
              id={category.slug?.current}
              className="mb-16 scroll-mt-24"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-2">
                {category.icon?.asset?.url && (
                  <Image
                    src={category.icon.asset.url}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded"
                  />
                )}
                <h2 className="text-3xl font-heading font-bold text-navy">
                  {category.title}
                </h2>
                <span className="ml-2 text-sm text-gray-400 font-medium">
                  {category.tasks.length} tasks
                </span>
              </div>
              {category.description && (
                <p className="text-gray-600 mb-6 max-w-3xl">
                  {category.description}
                </p>
              )}

              {/* Task cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.tasks.map((task: any) => {
                  const href = task.slug?.current
                    ? `/task/${task.slug.current}`
                    : '#'
                  return (
                    <Link
                      key={task._id}
                      href={href}
                      className="group block rounded-xl border border-gray-200 bg-white hover:shadow-md hover:border-navy/20 transition p-5"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        {task.icon?.asset?.url ? (
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-peach-extra-light flex-shrink-0">
                            <Image
                              src={task.icon.asset.url}
                              alt=""
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-peach-extra-light flex-shrink-0" />
                        )}

                        <div className="flex-1 min-w-0">
                          {/* Title + code */}
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-heading font-bold text-navy leading-tight group-hover:underline">
                              {task.title}
                            </h3>
                            {task.code && (
                              <span className="text-[10px] font-semibold bg-navy text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                {task.code}
                              </span>
                            )}
                          </div>

                          {/* One-liner */}
                          <div className="text-sm text-gray-600 line-clamp-2">
                            {Array.isArray(task.oneLiner) ? (
                              <PortableText
                                value={task.oneLiner}
                                components={portableTextComponents}
                              />
                            ) : task.oneLiner ? (
                              <span>{task.oneLiner}</span>
                            ) : null}
                          </div>

                          {/* Project count badge */}
                          {task.projectCount > 0 && (
                            <div className="mt-2">
                              <span className="inline-flex items-center gap-1 text-xs text-navy bg-peach-extra-light rounded-full px-2 py-0.5">
                                🛠️ {task.projectCount} project
                                {task.projectCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-peach-extra-light py-12 px-6 sm:px-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-navy mb-3">
            Have a task that&rsquo;s missing?
          </h2>
          <p className="text-gray-600 mb-6">
            This taxonomy is community-driven. If you see a gap — a task that
            legal help organizations need AI for but isn&rsquo;t listed here
            — tell us about it.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScxjzlRUOZcwSDI_Fq5WWDWatdPF-6JQ30VcNBpCEwlSHvTlw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-navy text-white font-semibold px-6 py-3 rounded-lg hover:bg-navy/90 transition"
          >
            Suggest a task →
          </a>
        </div>
      </section>
    </main>
  )
}
