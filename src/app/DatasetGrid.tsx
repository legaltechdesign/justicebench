'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

const TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  'benchmark':      { label: 'Evaluation Benchmarks',  emoji: '📊' },
  'labeled-dataset': { label: 'Labeled Datasets',       emoji: '🏷️' },
  'taxonomy':       { label: 'Taxonomies & Standards',  emoji: '🗂️' },
  'leaderboard':    { label: 'Leaderboards',            emoji: '🏆' },
  'reference':      { label: 'Reference Data',          emoji: '📋' },
  'eval-protocol':  { label: 'Evaluation Protocols',    emoji: '✅' },
  'test-suite':     { label: 'Test Suites',             emoji: '🧪' },
}

type Dataset = {
  _id: string
  title: string
  slug?: { current: string }
  oneliner?: any
  image?: { asset: { _id: string; url: string } }
  link?: string
  datasetType?: string
}

export function DatasetGrid({ datasets }: { datasets: Dataset[] }) {
  const [activeFilter, setActiveFilter] = useState('all')

  // Collect which types actually have datasets
  const typesWithData = Array.from(
    new Set(datasets.map((d) => d.datasetType).filter(Boolean))
  ) as string[]

  const filtered =
    activeFilter === 'all'
      ? datasets
      : datasets.filter((d) => d.datasetType === activeFilter)

  // Group filtered datasets by type
  const grouped = new Map<string, Dataset[]>()
  filtered.forEach((d) => {
    const key = d.datasetType || '__uncategorized__'
    const arr = grouped.get(key) ?? []
    arr.push(d)
    grouped.set(key, arr)
  })

  // Sort groups by the TYPE_LABELS order
  const typeOrder = Object.keys(TYPE_LABELS)
  const sortedGroups = Array.from(grouped.entries()).sort(([a], [b]) => {
    const ai = typeOrder.indexOf(a)
    const bi = typeOrder.indexOf(b)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  return (
    <>
      {/* Filter pills */}
      {typesWithData.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-peach text-navy'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            All
          </button>
          {typesWithData.map((type) => {
            const meta = TYPE_LABELS[type]
            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === type
                    ? 'bg-peach text-navy'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {meta?.emoji} {meta?.label ?? type}
              </button>
            )
          })}
        </div>
      )}

      {/* Grouped cards */}
      {sortedGroups.map(([type, items]) => {
        const meta = TYPE_LABELS[type]
        return (
          <div key={type} className="mb-10">
            {/* Show type heading only in "All" view */}
            {activeFilter === 'all' && meta && (
              <h3 className="text-2xl font-heading font-semibold text-peach mb-4 flex items-center gap-2">
                <span>{meta.emoji}</span> {meta.label}
              </h3>
            )}
            {activeFilter === 'all' && !meta && type === '__uncategorized__' && (
              <h3 className="text-2xl font-heading font-semibold text-white/60 mb-4">
                Other Resources
              </h3>
            )}

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const href = item.slug?.current
                  ? `/dataset/${item.slug.current}`
                  : item.link || '#'
                const isExternal = !!item.link && !item.slug?.current

                const Card = (
                  <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-lg flex flex-col hover:bg-white/15 hover:border-white/20 transition group">
                    {item.image?.asset?.url && (
                      <Image
                        src={item.image.asset.url}
                        alt={item.title}
                        width={400}
                        height={200}
                        className="object-cover w-full h-40 rounded mb-4"
                      />
                    )}
                    <div className="flex items-start gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-white font-heading leading-tight flex-1">
                        {item.title}
                      </h4>
                      {item.datasetType && TYPE_LABELS[item.datasetType] && (
                        <span className="shrink-0 text-xs bg-white/10 text-white/60 rounded-full px-2 py-0.5">
                          {TYPE_LABELS[item.datasetType].label}
                        </span>
                      )}
                    </div>
                    {item.oneliner && (
                      <div className="text-sm text-white/70 leading-snug line-clamp-3">
                        <PortableText value={item.oneliner} />
                      </div>
                    )}
                  </div>
                )

                return isExternal ? (
                  <a key={item._id} href={href} target="_blank" rel="noopener noreferrer">
                    {Card}
                  </a>
                ) : (
                  <Link key={item._id} href={href}>
                    {Card}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}

      {filtered.length === 0 && (
        <p className="text-center text-white/50 py-8">
          No datasets match the current filter.
        </p>
      )}
    </>
  )
}
