// schemas/issue.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'issue',
  title: 'Legal Issue Area',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'workflows', title: 'Workflows' },
    { name: 'services', title: 'Service Portfolio' },
    { name: 'ai', title: 'AI Projects & Ideas' },
    { name: 'evidence', title: 'Benchmarks & Datasets' },
    { name: 'impact', title: 'Impact & FAQ' },
    { name: 'meta', title: 'Taxonomy & Meta' },
  ],
  fields: [
    // ===== Basic / existing =====
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name of the legal issue area (e.g. Housing, Family Law)',
      validation: Rule => Rule.required(),
      group: 'content'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      group: 'content'
    }),
    defineField({
      name: 'oneLiner',
      title: 'One-liner Explanation',
      type: 'string',
      description: 'A short summary or tagline for this legal issue',
      validation: Rule => Rule.max(160),
      group: 'content'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A full description of what this issue area includes',
      rows: 5,
      group: 'content'
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'An icon or illustration for this legal issue area',
      options: { hotspot: true },
      group: 'content'
    }),

    // ===== New: audience & hero helpers =====
    defineField({
      name: 'audienceNote',
      title: 'Audience Note (optional)',
      type: 'string',
      description: 'e.g., “Team leads and funders planning AI investments.”',
      group: 'content'
    }),
    defineField({
      name: 'heroTags',
      title: 'Hero Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Short tag chips for key subtopics (Eviction, Repairs, RA…)',
      group: 'content'
    }),

    // ===== Taxonomy / meta (keep your existing) =====
    defineField({
      name: 'listCode',
      title: 'LIST Code',
      type: 'string',
      description: 'taxonomy.legal LIST code (e.g. HOU-1000)',
      group: 'meta'
    }),
    defineField({
      name: 'listCodeUrl',
      title: 'LIST Code URL',
      type: 'url',
      description: 'Link to the LIST taxonomy.legal page for this code',
      group: 'meta'
    }),
     // === NEW: Jurisdictions ===
     defineField({
      name: 'jurisdictions',
      title: 'Jurisdictions',
      type: 'array',
      description: 'Common jurisdictions for this issue (used for filters + chips)',
      of: [{ type: 'reference', to: [{ type: 'jurisdiction' }] }],
      group: 'meta'
    }),
    defineField({
      name: 'languages',
      title: 'Languages supported',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      initialValue: ['en', 'es'],
      group: 'meta'
    }),
    defineField({
      name: 'relatedSubIssues',
      title: 'Related Sub-Issues',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'issue' }] }],
      description: 'Nested or related topics within this legal issue area',
      group: 'meta'
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
      group: 'meta'
    }),

    // ===== Workflows (the 15 tiles) =====
    defineField({
      name: 'workflows',
      title: 'Top Workflows / Needs',
      type: 'array',
      group: 'workflows',
      validation: Rule => Rule.min(1).max(20),
      of: [
        {
          type: 'object',
          name: 'workflow',
          fields: [
            defineField({ name: 'title', type: 'string', validation: r => r.required() }),
            defineField({ name: 'oneLiner', type: 'string', validation: r => r.required().max(160) }),
            defineField({ name: 'sampleQuote', type: 'string', description: 'Short user quote in quotes' }),
            defineField({
              name: 'serviceTypes',
              title: 'Typical Service Types',
              type: 'array',
              of: [{ type: 'string' }],
              options: { layout: 'tags', list: ['Info','Brief Advice','Limited Scope','Full Rep','Mediation','Navigation'] }
            }),
            defineField({
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [{ type: 'string' }],
              options: { layout: 'tags' }
            }),
            defineField({
              name: 'impact',
              title: 'Impact (optional)',
              type: 'object',
              fields: [
                { name: 'timeSavedMins', type: 'number', title: 'Time saved (minutes)' },
                { name: 'riskLevel', type: 'string', options: { list: ['low','med','high'] } }
              ]
            }),
            defineField({
              name: 'aiSpotlights',
              title: 'AI Project Spotlights',
              type: 'array',
              of: [
                { type: 'reference', to: [{ type: 'project' }], title: 'Existing Project' },
                { type: 'object',
                  name: 'idea',
                  title: 'Brainstorm Idea',
                  fields: [
                    { name: 'label', type: 'string' },
                    { name: 'description', type: 'text', rows: 3 },
                    { name: 'link', type: 'url' }
                  ]
                }
              ]
            })
          ],
          preview: {
            select: { title: 'title', one: 'oneLiner' },
            prepare: ({ title, one }) => ({ title, subtitle: one })
          }
        }
      ]
    }),

    // ===== Service Portfolio =====
    defineField({
      name: 'servicePortfolio',
      title: 'Service Portfolio & Referrals',
      type: 'array',
      group: 'services',
      of: [{
        type: 'object',
        fields: [
          { name: 'serviceLine', type: 'string', options: { list: ['Info','Brief Advice','Limited Scope','Full Representation','Mediation','Navigation'] }, validation: r => r.required() },
          { name: 'scope', type: 'string' },
          { name: 'channels', type: 'string', description: 'e.g., Web, Phone, Video, Chat/SMS' },
          { name: 'aiSupport', type: 'string', description: 'How AI can help this line' }
        ],
        preview: { select: { title: 'serviceLine', subtitle: 'scope' } }
      }]
    }),

    // ===== AI Projects & Ideas (section-level, beyond per-workflow spotlights) =====
    defineField({
      name: 'aiProjects',
      title: 'AI Projects (Issue-wide)',
      type: 'array',
      group: 'ai',
      of: [{ type: 'reference', to: [{ type: 'project' }] }]
    }),
    defineField({
      name: 'aiIdeas',
      title: 'AI Brainstorms (Issue-wide)',
      type: 'array',
      group: 'ai',
      of: [{ type: 'text' }]
    }),

    // ===== Benchmarks & Datasets =====
    defineField({
      name: 'datasets',
      title: 'Datasets',
      type: 'array',
      group: 'evidence',
      of: [{ type: 'reference', to: [{ type: 'dataset' }] }]
    }),
     // === NEW: Benchmarks (as references) ===
     defineField({
      name: 'benchmarks',
      title: 'Benchmarks',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'benchmark' }] }],
      group: 'evidence'
    }),


    // ===== Impact, KPIs, FAQ, CTA =====
    defineField({
      name: 'kpis',
      title: 'Impact & KPIs',
      type: 'object',
      group: 'impact',
      fields: [
        { name: 'volume', title: 'Typical volume (monthly/annual)', type: 'string' },
        { name: 'timeSaved', title: 'Time saved (typical)', type: 'string' },
        { name: 'riskReduction', title: 'Risk reduction notes', type: 'text', rows: 3 },
        { name: 'languageParity', title: 'Language parity status', type: 'string' }
      ]
    }),
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'impact',
      of: [{
        type: 'object',
        fields: [
          { name: 'q', title: 'Question', type: 'string' },
          { name: 'a', title: 'Answer', type: 'text', rows: 4 }
        ],
        preview: { select: { title: 'q' } }
      }]
    }),
    defineField({
      name: 'ctas',
      title: 'Calls to Action',
      type: 'array',
      group: 'impact',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string' },
          { name: 'href', type: 'url' },
          { name: 'style', type: 'string', options: { list: ['primary','outline','ghost'] } }
        ],
        preview: { select: { title: 'label', subtitle: 'href' } }
      }]
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'icon',
      subtitle: 'listCode',
      workflows: 'workflows'
    },
    prepare({ title, media, subtitle, workflows }) {
      const count = Array.isArray(workflows) ? workflows.length : 0
      const sub = [subtitle, count ? `${count} workflows` : null].filter(Boolean).join(' • ')
      return { title, media, subtitle: sub }
    }
  }
})
