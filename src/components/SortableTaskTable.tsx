'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

export type TaskRow = {
  _id: string
  slug?: { current?: string }
  title?: string
  code?: string
  category?: { title?: string }
  oneLiner?: any
  icon?: { asset?: { url?: string } }
}

export default function SortableTaskTable({ initial }: { initial: TaskRow[] }) {
  const [sortKey, setSortKey] = useState<keyof TaskRow | 'categoryTitle'>('code')
  const [asc, setAsc] = useState(true)

  const rows = useMemo(() => {
    const copy = [...(initial ?? [])]
    copy.sort((a, b) => {
      const av =
        sortKey === 'categoryTitle'
          ? (a.category?.title ?? '')
          : (a[sortKey] as any) ?? ''
      const bv =
        sortKey === 'categoryTitle'
          ? (b.category?.title ?? '')
          : (b[sortKey] as any) ?? ''
      return (String(av).localeCompare(String(bv)) || 0) * (asc ? 1 : -1)
    })
    return copy
  }, [initial, sortKey, asc])

  const clickHeader = (key: typeof sortKey) => {
    if (sortKey === key) setAsc(!asc)
    else {
      setSortKey(key)
      setAsc(true)
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-peach-extra-light/70">
          <tr>
            <th className="px-4 py-3 w-16" />
            <th className="px-4 py-3 text-left cursor-pointer" onClick={() => clickHeader('code')}>
              Task ID {sortKey === 'code' ? (asc ? '▲' : '▼') : ''}
            </th>
            <th className="px-4 py-3 text-left cursor-pointer" onClick={() => clickHeader('title')}>
              Name {sortKey === 'title' ? (asc ? '▲' : '▼') : ''}
            </th>
            <th className="px-4 py-3 text-left">Brief Description</th>
            <th className="px-4 py-3 text-left cursor-pointer" onClick={() => clickHeader('categoryTitle')}>
              Category {sortKey === 'categoryTitle' ? (asc ? '▲' : '▼') : ''}
            </th>
            <th className="px-4 py-3 text-left w-40">Link</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t._id} className="border-t align-top">
              <td className="px-4 py-3">
                {t.icon?.asset?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.icon.asset.url} alt="" className="w-6 h-6" />
                ) : null}
              </td>
              <td className="px-4 py-3 font-mono text-[12px] text-gray-800">{t.code ?? '—'}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{t.title ?? 'Untitled task'}</td>
              <td className="px-4 py-3 text-gray-700">
                {Array.isArray(t.oneLiner) ? (
                  // render first block’s plain text quickly
                  <span>
                    {t.oneLiner[0]?.children?.map((c: any) => c.text).join('') ?? ''}
                  </span>
                ) : (
                  (t.oneLiner as any) ?? '—'
                )}
              </td>
              <td className="px-4 py-3 text-gray-700">{t.category?.title ?? '—'}</td>
              <td className="px-4 py-3">
                {t.slug?.current ? (
                  <Link className="text-navy underline" href={`/task/${t.slug.current}`}>
                    View task →
                  </Link>
                ) : (
                  <span className="text-gray-400">No link</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
