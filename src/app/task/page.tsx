// src/app/tasks/page.tsx
import { sanityClient } from '@/lib/sanity'
import Image from 'next/image'

// ISR – tweak as you like
export const revalidate = 300

// ---------- Types ----------
type PTBlock = {
  _type: 'block'
  children?: { text?: string }[]
}

type TaskRow = {
  id: string
  slug: string | null
  code: string | null
  title: string
  oneLinerPlain: string
  categoryTitle: string | null
  categorySlug: string | null
  iconUrl: string | null
}

// Convert Portable Text array to plain string (first paragraph is enough for a table)
function ptToPlainText(blocks?: any): string {
  if (!Array.isArray(blocks)) return ''
  const firstText = (blocks as PTBlock[])
    .filter((b) => b?._type === 'block')
    .flatMap((b) => b.children ?? [])
    .map((c) => c?.text ?? '')
    .join('')
    .trim()
  return firstText || ''
}

// ---------- Server data fetch ----------
async function fetchTasks(): Promise<TaskRow[]> {
  const tasks = await sanityClient.fetch(`
    *[_type == "task"]{
      _id,
      title,
      "slug": slug.current,
      code,
      oneLiner,
      icon{ asset->{ url } },
      category->{ title, "slug": slug.current }
    } | order(coalesce(code, title) asc)
  `)

  return (tasks ?? []).map((t: any) => ({
    id: t._id as string,
    slug: t.slug ?? null,
    code: t.code ?? null,
    title: t.title ?? 'Untitled task',
    oneLinerPlain: ptToPlainText(t.oneLiner),
    categoryTitle: t.category?.title ?? null,
    categorySlug: t.category?.slug ?? null,
    iconUrl: t.icon?.asset?.url ?? null,
  }))
}

// ---------- Client table (sorting) ----------
function sortRows(rows: TaskRow[], key: keyof TaskRow, dir: 'asc'|'desc') {
  const mul = dir === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    const av = (a[key] ?? '') as string
    const bv = (b[key] ?? '') as string
    return av.localeCompare(bv, undefined, { numeric: true }) * mul
  })
}

'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'

function SortableTable({ initial }: { initial: TaskRow[] }) {
  type ColKey = 'title' | 'code' | 'categoryTitle'
  const [sortKey, setSortKey] = useState<ColKey>('code')
  const [dir, setDir] = useState<'asc' | 'desc'>('asc')

  const rows = useMemo(() => sortRows(initial, sortKey, dir), [initial, sortKey, dir])

  function clickHeader(k: ColKey) {
    if (k === sortKey) {
      setDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(k)
      setDir('asc')
    }
  }

  const caret = (k: ColKey) => (
    <span className="ml-1 text-xs">{sortKey === k ? (dir === 'asc' ? '▲' : '▼') : ''}</span>
  )

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-peach-extra-light/70">
          <tr>
            <th className="px-4 py-3 text-left w-14">Icon</th>
            <th className="px-4 py-3 text-left w-32 cursor-pointer" onClick={() => clickHeader('code')}>
              Task ID {caret('code')}
            </th>
            <th className="px-4 py-3 text-left cursor-pointer" onClick={() => clickHeader('title')}>
              Name {caret('title')}
            </th>
            <th className="px-4 py-3 text-left">Brief Description</th>
            <th className="px-4 py-3 text-left w-56 cursor-pointer" onClick={() => clickHeader('categoryTitle')}>
              Category {caret('categoryTitle')}
            </th>
            <th className="px-4 py-3 text-left w-32">Link</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-4 py-3">
                {r.iconUrl ? (
                  <Image
                    src={r.iconUrl}
                    alt=""
                    width={24}
                    height={24}
                    className="rounded"
                  />
                ) : (
                  <div className="w-6 h-6 rounded bg-gray-200" />
                )}
              </td>
              <td className="px-4 py-3 font-mono text-[12px] text-gray-800">
                {r.code ?? '—'}
              </td>
              <td className="px-4 py-3 text-[15px] font-medium text-gray-900">
                {r.title}
              </td>
              <td className="px-4 py-3 text-gray-700">
                {r.oneLinerPlain || '—'}
              </td>
              <td className="px-4 py-3">
                {r.categorySlug ? (
                  <Link href={`/task?category=${r.categorySlug}`} className="underline text-navy">
                    {r.categoryTitle}
                  </Link>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                {r.slug ? (
                  <Link href={`/task/${r.slug}`} className="underline text-navy">
                    View →
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

// ---------- Page (server) ----------
export default async function TasksPage() {
  const data = await fetchTasks()

  return (
    <main className="font-sans px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-5xl font-heading font-bold text-navy mb-3">Task Taxonomy</h1>
      <p className="text-gray-700 mb-8 max-w-3xl">
        A taxonomy view of tasks across categories. Click a task to view its full page. Click table headers to sort.
      </p>
      {/* Pass server data to client component safely */}
<SortableTable initial={data as any} />

    </main>
  )
}
