// studio/schemas/dataset.ts
const dataset = {
  name: 'dataset',
  title: 'Dataset',
  type: 'document',
  fields: [
    { name: 'title', title: 'Dataset Title', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'datasetType',
      title: 'Dataset Type',
      type: 'string',
      description: 'What kind of resource is this?',
      options: {
        list: [
          { title: 'Test & Evaluate — Benchmarks, eval Q&A, test suites for scoring model performance', value: 'test' },
          { title: 'Build & Train — Labeled data, training corpora, synthetic queries for building tools', value: 'build' },
          { title: 'Organize & Standardize — Taxonomies, reference data, classification standards', value: 'organize' },
          { title: 'Compare — Leaderboards and model comparison tools', value: 'compare' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'oneliner',
      title: 'Brief Description',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'description',
      title: 'Long Description',
      type: 'array',
      of: [{type: 'block'},
        {
          type: 'image',
          options: { hotspot: true },
        },],
    },
    {
      name: 'link',
      title: 'Download or GitHub Link',
      type: 'url',
    },
    {
      name: 'image',
      title: 'Illustration',
      type: 'image',
      options: { hotspot: true },
    },
  ],
}

export default dataset
