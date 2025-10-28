// src/app/tasks/page.tsx
import { sanityClient } from '@/lib/sanity'

export const revalidate = 300 // revalidate every 5 minutes (tweak as you like)

type AirtableRecord = {
  id: string
  fields: Record<string, any>
}

type AirtableResp = {
  records: AirtableRecord[]
  offset?: string
}

type Row = {
  code?: string
  title?: string
  category?: string
  cluster?: string // e.g., “Getting Brief Help” (if you store a cluster/stage)
  slug?: string    // Link target to /task/[slug]
}

/** ---- Fetch Airtable with simple pagination ---- */
async function fetchAirtableAll(): Promise<AirtableRecord[]> {
  const token = process.env.AIRTABLE_PAT
  const base = process.env.AIRTABLE_BASE_ID
  const table = encodeURIComponent(process.env.AIRTABLE_TABLE || 'Tasks')
  const view = encodeURIComponent(process.env.AIRTABLE_VIEW || 'Grid view')

  if (!token || !base) {
    console.warn(
      'Airtable env missing — set AIRTABLE_PAT and AIRTABLE_BASE_ID in .env.local (and in Vercel env for production).'
    )
    return []
  }

  let url = `https://api.airtable.com/v0/${base}/${table}?view=${view}`
  const all: AirtableRecord[] = []

  while (url) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      // keep as no-store for fresh reads in dev; revalidate controls page caching
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Airtable fetch error', {
        status: res.status,
        statusText: res.statusText,
        url,
        body: text,
      })
      break
    }

    const data = (await res.json()) as AirtableResp
    all.push(...data.records)
    url = data.offset
      ? `https://api.airtable.com/v0/${base}/${table}?view=${view}&offset=${data.offset}`
      : ''
  }
  return all
}


/** ---- Fetch minimal Sanity task slugs so we can link rows ---- */
async function fetchSanityTaskSlugMap() {
  // Prefer to match by `code`; fallback to `title`
  const tasks = await sanityClient.fetch(
    `*[_type == "task"]{
      "slug": slug.current,
      title,
      code
    }`
  ) as { slug?: string; title?: string; code?: string }[]

  const byCode = new Map<string, string>()
  const byTitle = new Map<string, string>()

  for (const t of tasks) {
    if (t.slug) {
      if (t.code) byCode.set(t.code.trim().toLowerCase(), t.slug)
      if (t.title) byTitle.set(t.title.trim().toLowerCase(), t.slug)
    }
  }
  return { byCode, byTitle }
}

export default async function TasksIndexPage() {
  const [airtable, slugMaps] = await Promise.all([
    fetchAirtableAll(),
    fetchSanityTaskSlugMap(),
  ])

  const rows: Row[] = airtable.map((r) => {
    // Adjust these field names to match your Airtable column names exactly:
    const code = r.fields['Code'] ?? r.fields['Task Code'] ?? r.fields['code']
    const title = r.fields['Title'] ?? r.fields['Task'] ?? r.fields['title']
    const category = r.fields['Category'] ?? r.fields['Task Category'] ?? r.fields['category']
    const cluster = r.fields['Cluster'] ?? r.fields['Stage'] ?? r.fields['cluster'] // optional
    // preferred: Airtable also stores the actual slug
    let slug = r.fields['Slug'] as string | undefined

    if (!slug) {
      // fallback 1: resolve by code
      if (code) {
        slug = slugMaps.byCode.get(String(code).trim().toLowerCase())
      }
      // fallback 2: resolve by title
      if (!slug && title) {
        slug = slugMaps.byTitle.get(String(title).trim().toLowerCase())
      }
    }

    return { code, title, category, cluster, slug }
  })

  // Group by category (like your taxonomy)
  const byCategory = new Map<string, Row[]>()
  for (const row of rows) {
    const key = row.category || 'Other'
    const arr = byCategory.get(key) ?? []
    arr.push(row)
    byCategory.set(key, arr)
  }

  // Sort categories alphabetically; inside each, sort by code then title
  const categories = Array.from(byCategory.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  )

  categories.forEach(([cat, arr]) => {
    arr.sort((a, b) => {
      const ac = (a.code || '').toString()
      const bc = (b.code || '').toString()
      return ac.localeCompare(bc) || (a.title || '').localeCompare(b.title || '')
    })
  })

  return (
    <main className="font-sans px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-5xl font-heading font-bold text-navy mb-3">Task Taxonomy</h1>
      <p className="text-gray-700 mb-8 max-w-3xl">
        A taxonomy view of tasks across categories. Click a task to view its full page.
      </p>

      {/* Table for each category */}
      {categories.map(([category, items]) => (
        <section key={category} className="mb-12">
          <div className="flex items-baseline gap-3 mb-3">
            <h2 className="text-2xl font-heading font-semibold text-navy">
              {category} Tasks
            </h2>
            <span className="text-sm text-gray-500">({items.length})</span>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-peach-extra-light/70 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left w-28">Code</th>
                  <th className="px-4 py-3 text-left">Task</th>
                  <th className="px-4 py-3 text-left w-56">Cluster/Stage</th>
                  <th className="px-4 py-3 text-left w-40">Link</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row, i) => (
                  <tr key={`${category}-${row.code ?? row.title ?? i}`} className="border-t">
                    <td className="px-4 py-3 font-mono text-[12px] text-gray-800">
                      {row.code ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[15px] font-medium text-gray-900">{row.title ?? 'Untitled task'}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.cluster ?? '—'}</td>
                    <td className="px-4 py-3">
                      {row.slug ? (
                        <a
                          href={`/task/${row.slug}`}
                          className="text-navy underline"
                        >
                          View task →
                        </a>
                      ) : (
                        <span className="text-gray-400">No link</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </main>
  )
}
