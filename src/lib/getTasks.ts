import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-05-01',
  useCdn: false,
})

export async function getTasks() {
  const query = `
    *[_type == "task"] | order(_createdAt desc){
      _id,
      title,
      slug,
      "imageUrl": image.asset->url,
      briefDescription
    }
  `
  return await client.fetch(query)
}
