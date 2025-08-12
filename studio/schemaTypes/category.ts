// schemas/category.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
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
    {
      name: 'oneliner',
      title: 'One-Line Description',
      type: 'array',
      of: [{ type: 'block' }],
    },
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'Visual icon or illustration for this category',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'tasks',
      title: 'Tasks in this Category',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'task',
              title: 'Task',
              type: 'reference',
              to: [{ type: 'task' }],
            }),
            defineField({
              name: 'sortOrder',
              title: 'Sort Order in this Category',
              type: 'number',
              description: 'Lower numbers show first',
            }),
          ],
          preview: {
            select: {
              title: 'task.title',
              media: 'task.image',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'icon'
    }
  }
})
