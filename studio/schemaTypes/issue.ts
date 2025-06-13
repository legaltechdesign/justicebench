// schemas/issue.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'issue',
  title: 'Issue Area',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Issue Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first'
    })
  ]
})
