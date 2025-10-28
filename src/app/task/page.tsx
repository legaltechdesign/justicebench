// src/app/task/page.tsx  (server component)
import { sanityClient } from '@/lib/sanity'
import SortableTaskTable, { TaskRow } from '@/components/SortableTaskTable'

export const revalidate = 300

async function fetchTasks(): Promise<TaskRow[]> {
  return sanityClient.fetch(`
    *[_type == "task"] | order(coalesce(code,"") asc, title asc){
      _id,
      slug{current},
      title,
      code,
      "oneLiner": oneLiner,
      icon{asset->{url}},
      category->{title}
    }
  `)
}

export default async function TasksPage() {
  const data = await fetchTasks()
  return (
    <main className="font-sans px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-5xl font-heading font-bold text-navy mb-3">Task Taxonomy</h1>
      <p className="text-gray-700 mb-8 max-w-3xl">
        A taxonomy view of tasks across categories. Click a task to view its full page. Click table headers to sort.
      </p>
      <SortableTaskTable initial={data} />
    </main>
  )
}
