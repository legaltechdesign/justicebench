import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'task',
  title: 'Task',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    
    defineField({
      name: 'oneLiner',
      title: 'Brief Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Long Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'qualityStandards',
      title: 'Quality Standards',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
    defineField({
      name: 'relatedDatasets',
      title: 'Related Datasets',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'dataset'}]}],
    }),
    defineField({
      name: 'relatedEvaluations',
      title: 'Related Evaluation Tools',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'evaluation'}]}],
    }),
    defineField({
      name: 'relatedGuides',
      title: 'Related Guides',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'guide'}]}],
    }),
  ],
})
