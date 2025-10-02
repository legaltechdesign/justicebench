// schemas/jurisdiction.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'jurisdiction',
  title: 'Jurisdiction',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g., California, Los Angeles County, Federal (9th Cir.)',
      validation: r => r.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: r => r.required()
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
      description: 'Short code (e.g., CA, LA-County, US-9th)',
      validation: r => r.required()
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Federal', value: 'federal' },
          { title: 'State', value: 'state' },
          { title: 'County', value: 'county' },
          { title: 'City/Municipal', value: 'city' },
          { title: 'Tribal', value: 'tribal' },
          { title: 'Province', value: 'province' },
          { title: 'Other/International', value: 'intl' }
        ],
        layout: 'radio'
      },
      validation: r => r.required()
    })
  ],
  preview: {
    select: { title: 'name', subtitle: 'code' }
  }
})
