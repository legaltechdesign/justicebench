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
