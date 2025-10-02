// schemas/benchmark.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'benchmark',
  title: 'Benchmark / Rubric',
  type: 'document',
  fields: [
    // Basics
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: r => r.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: r => r.required()
    }),
    defineField({
      name: 'summary',
      title: 'One-liner / Summary',
      type: 'string',
      description: 'Short description of what this benchmark measures',
      validation: r => r.max(200)
    }),

    // Link to issues (lets you show this under multiple issue pages)
    defineField({
      name: 'issues',
      title: 'Related Issue Areas',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'issue' }] }]
    }),

    // Rubric criteria (what “good” looks like)
    defineField({
      name: 'criteria',
      title: 'Rubric Criteria',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'id', title: 'ID', type: 'string', validation: r => r.required() }),
          defineField({ name: 'label', title: 'Label', type: 'string', validation: r => r.required() }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          defineField({
            name: 'scale',
            title: 'Scale (anchors)',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'e.g., ["0 — Fails", "1 — Partial", "2 — Adequate", "3 — Strong"]'
          }),
          defineField({
            name: 'weight',
            title: 'Weight (0–1)',
            type: 'number',
            validation: r => r.min(0).max(1)
          })
        ],
        preview: {
          select: { title: 'label', subtitle: 'id' }
        }
      }]
    }),

    // Protocol (how to run the evaluation)
    defineField({
      name: 'protocol',
      title: 'Evaluation Protocol',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'step', title: 'Step Name', type: 'string', validation: r => r.required() }),
          defineField({ name: 'details', title: 'Details', type: 'text', rows: 3 }),
          defineField({
            name: 'inputs',
            title: 'Inputs/Artifacts',
            type: 'array',
            of: [{ type: 'string' }]
          })
        ],
        preview: { select: { title: 'step' } }
      }]
    }),

    // Sample prompts / conversations
    defineField({
      name: 'samples',
      title: 'Sample Questions / Conversations',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'id', title: 'ID', type: 'string' }),
          defineField({ name: 'user', title: 'User Prompt', type: 'text', rows: 3 }),
          defineField({ name: 'expected', title: 'Expected Elements / Gold Notes', type: 'text', rows: 3 }),
          defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' }
          })
        ],
        preview: { select: { title: 'id', subtitle: 'user' } }
      }]
    }),

    // Scoring / outputs (optional, for publishing results)
    defineField({
      name: 'scoring',
      title: 'Scoring & Reporting',
      type: 'object',
      fields: [
        defineField({ name: 'aggregation', title: 'Aggregation Method', type: 'string', description: 'e.g., weighted mean across criteria' }),
        defineField({ name: 'passThreshold', title: 'Pass Threshold', type: 'number' }),
        defineField({ name: 'notes', title: 'Notes', type: 'text', rows: 3 })
      ]
    }),

    // Links, attachments, datasets used
    defineField({
      name: 'datasets',
      title: 'Datasets Used or Produced',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'dataset' }] }]
    }),
    defineField({
      name: 'resources',
      title: 'Resources / Links',
      type: 'array',
      of: [{ type: 'url' }]
    })
  ],
  preview: {
    select: { title: 'title', subtitle: 'summary' }
  }
})
