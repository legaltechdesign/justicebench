export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
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
    {
      name: 'status',
      title: 'Status',
      type: 'reference',
      to: [{ type: 'status' }],
      description: 'Current stage of the project (e.g., Vision, Prototype, Pilot, Live).'
    },
    {
      name: 'issue',
      title: 'Legal Issue Area',
      type: 'reference',
      to: [{ type: 'issue' }],
      description: 'What legal issue areas does this project address?'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'The broader area of legal work or system reform this project contributes to'
    },
    {
      name: 'tasks',
      title: 'Related Tasks',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'task' }] }],
      description: 'Specific legal help tasks that this project supports or addresses'
    }
  ],
}
