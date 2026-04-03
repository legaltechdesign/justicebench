'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from '@/components/CustomPortableText'

type Project = {
  _id: string
  title: string
  slug: { current: string }
  oneliner?: any
  image?: { asset?: { url?: string } }
  tasks?: { title: string; slug: { current: string }; icon?: { asset?: { url?: string } } }[]
  status?: { status?: string }
  issue?: {
    title?: string
    slug?: { current: string }
    icon?: { asset?: { url?: string } }
    sortOrder?: number
    oneLiner?: any
  }
  category?: {
    title?: string
    slug?: { current: string }
    sortOrder?: number
    icon?: { asset?: { url?: string } }
    oneliner?: any
  }
}

type IssueGroup = {
  key: string
  title: string
  slug?: string
  iconUrl?: string | null
  blurb?: any
  sortOrder: number
  projects: Project[]
}

function buildIssueGroups(projects: Project[]): IssueGroup[] {
  const map = new Map<string, IssueGroup>()
  projects.forEach((p) => {
    const key = p.issue?.slug?.current ?? '__other__'
    if (!map.has(key)) {
      map.set(key, {
        key,
        title: p.issue?.title ?? 'Other Service Areas',
        slug: p.issue?.slug?.current,
        iconUrl: p.issue?.icon?.asset?.url ?? null,
        blurb: p.issue?.oneLiner ?? null,
        sortOrder: p.issue?.sortOrder ?? 9999,
        projects: [],
      })
    }
    map.get(key)!.projects.push(p)
  })
  return Array.from(map.values()).sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title))
}

const STATUS_ORDER = ['Pilots', 'Prototypes', 'Proposals']

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [issueFilter, setIssueFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Apply filters
  let filtered = projects
  if (issueFilter !== 'all') {
    filtered = filtered.filter((p) => (p.issue?.slug?.current ?? '__other__') === issueFilter)
  }
  if (statusFilter !== 'all') {
    filtered = filtered.filter((p) => p.status?.status === statusFilter)
  }

  const groups = buildIssueGroups(filtered)

  // Collect unique issue areas for pills (from all projects, not filtered)
  const allGroups = buildIssueGroups(projects)

  // Collect unique statuses
  const statuses = Array.from(new Set(projects.map((p) => p.status?.status).filter(Boolean))) as string[]
  statuses.sort((a, b) => STATUS_ORDER.indexOf(a) - STATUS_ORDER.indexOf(b))

  return (
    <>
      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <button
          onClick={() => setStatusFilter('all')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-navy text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Statuses
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Issue area filter pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <button
          onClick={() => setIssueFilter('all')}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
            issueFilter === 'all'
              ? 'bg-peach text-navy'
              : 'bg-peach-extra-light text-navy/60 hover:bg-peach-light hover:text-navy'
          }`}
        >
          All Issue Areas
        </button>
        {allGroups.map((g) => (
          <button
            key={g.key}
            onClick={() => setIssueFilter(g.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
              issueFilter === g.key
                ? 'bg-peach text-navy'
                : 'bg-peach-extra-light text-navy/60 hover:bg-peach-light hover:text-navy'
            }`}
          >
            {g.iconUrl && (
              <Image src={g.iconUrl} alt="" width={16} height={16} className="rounded-sm" />
            )}
            {g.title.replace(/\s*(Legal\s+Services|Services)\s*$/i, '')}
            <span className="text-[10px] opacity-60">{g.projects.length}</span>
          </button>
        ))}
      </div>

      {/* Grouped project cards */}
      {groups.map((group) => (
        <div key={group.key} className="mb-12">
          {/* Group heading — only show in "all" view */}
          {issueFilter === 'all' && (
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              {group.iconUrl && (
                <Image
                  src={group.iconUrl}
                  alt=""
                  width={36}
                  height={36}
                  className="rounded"
                />
              )}
              <div>
                <h3 className="text-2xl font-heading font-bold text-navy">
                  {group.title}
                </h3>
                {group.blurb && (
                  <div className="text-sm text-gray-500 mt-0.5 max-w-2xl">
                    {typeof group.blurb === 'string' ? (
                      group.blurb
                    ) : (
                      <PortableText value={group.blurb} components={portableTextComponents} />
                    )}
                  </div>
                )}
              </div>
              <span className="ml-auto text-sm text-gray-400">
                {group.projects.length} project{group.projects.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {group.projects.map((project) => (
              <Link
                key={project._id}
                href={`/project/${project.slug.current}`}
                className="group block"
              >
                <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition h-full flex flex-col">
                  {/* Status pill */}
                  {project.status?.status && (
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-navy text-white text-xs px-2.5 py-1 font-medium">
                      {project.status.status}
                    </span>
                  )}

                  {/* Image */}
                  {project.image?.asset?.url && (
                    <Image
                      src={project.image.asset.url}
                      alt={project.title}
                      width={400}
                      height={220}
                      className="object-cover w-full h-44"
                    />
                  )}

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-lg font-heading font-bold text-navy mb-1.5 group-hover:underline leading-tight">
                      {project.title}
                    </h4>
                    {project.oneliner && (
                      <div className="text-sm text-gray-600 line-clamp-2 mb-3">
                        <PortableText
                          value={project.oneliner}
                          components={portableTextComponents}
                        />
                      </div>
                    )}

                    {/* Task chips */}
                    {project.tasks?.length ? (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                        {project.tasks.map((t) => (
                          <span
                            key={t.slug.current}
                            className="flex items-center bg-peach-extra-light rounded-full px-2 py-0.5 text-[11px] text-navy"
                          >
                            {t.icon?.asset?.url && (
                              <Image
                                src={t.icon.asset.url}
                                alt=""
                                width={12}
                                height={12}
                                className="mr-1"
                              />
                            )}
                            {t.title}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          No projects match the current filters.
        </p>
      )}
    </>
  )
}
