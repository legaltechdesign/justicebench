import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: 'swtijbu4', // your project ID
  dataset: 'production',
  apiVersion: '2023-10-01',
  useCdn: true,
})
