// schemas/issue.ts

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'issue',
  title: 'Legal Issue Area',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name of the legal issue area (e.g. Housing, Family Law)',
      validation: Rule => Rule.required()
    }),
    defineField({
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'title', maxLength: 96 },
      }),
    defineField({
      name: 'oneLiner',
      title: 'One-liner Explanation',
      type: 'string',
      description: 'A short summary or tagline for this legal issue',
      validation: Rule => Rule.max(160)
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A full description of what this issue area includes',
      rows: 5,
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'An icon or illustration for this legal issue area',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'listCode',
      title: 'LIST Code',
      type: 'string',
      description: 'The taxonomy.legal LIST code associated with this issue area (e.g. HOU-1000)'
    }),

    defineField({
        name: 'listCodeUrl',
        title: 'LIST Code URL',
        type: 'url',
        description: 'Link to the LIST taxonomy.legal page for this code',
      }),
      
    defineField({
      name: 'relatedSubIssues',
      title: 'Related Sub-Issues',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'issue' }] }],
      description: 'Nested or related topics within this legal issue area'
    }),
    defineField({
        name: 'sortOrder',
        title: 'Sort Order',
        type: 'number',
        description: 'Lower numbers appear first'
      })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'icon',
      subtitle: 'listCode'
    }
  }
})
