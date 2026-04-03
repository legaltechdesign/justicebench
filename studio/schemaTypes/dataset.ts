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
          { title: 'Evaluation Benchmark', value: 'benchmark' },
          { title: 'Labeled Dataset', value: 'labeled-dataset' },
          { title: 'Taxonomy / Standard', value: 'taxonomy' },
          { title: 'Leaderboard', value: 'leaderboard' },
          { title: 'Reference Data', value: 'reference' },
          { title: 'Evaluation Protocol', value: 'eval-protocol' },
          { title: 'Test Suite', value: 'test-suite' },
        ],
        layout: 'dropdown',
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
