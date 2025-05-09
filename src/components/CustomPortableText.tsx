// src/components/CustomPortableText.tsx
import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from '@/lib/sanity'

const builder = imageUrlBuilder(sanityClient)

function urlFor(source: any) {
  return builder.image(source).width(800).url()
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null
      return (
        <div className="my-6">
          <Image
            src={urlFor(value)}
            alt={value.alt || 'Sanity Image'}
            width={800}
            height={400}
            className="rounded"
          />
        </div>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 mb-4">{children}</ol>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-6 mb-2 text-navy">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-4 mb-2 text-navy">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-gray-800">{children}</p>
    ),
  },
}

export function CustomPortableText({ value }: { value: any }) {
  return <PortableText value={value} components={components} />
}
