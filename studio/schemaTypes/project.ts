const project = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
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
      name: 'oneliner',
      title: 'Brief Description',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'description',
      title: 'Long Description',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'url',
      title: 'Link to Repo or Demo',
      type: 'url',
    },
    {
      name: 'image',
      title: 'Illustration',
      type: 'image',
      options: { hotspot: true },
    },

    // NEW fields:
    {
      name: 'relatedTasks',
      title: 'Related Tasks',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'task' }] }],
    },
    {
      name: 'relatedDatasets',
      title: 'Related Datasets',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'dataset' }] }],
    },
    {
      name: 'relatedEvaluations',
      title: 'Related Evaluation Tools',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'evaluation' }] }],
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    },
  ],
}

export default project
