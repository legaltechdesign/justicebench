export default {
    name: 'legalProblemType',
    title: 'Legal Problem Type',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'parent',
        title: 'Parent Category',
        type: 'reference',
        to: [{ type: 'legalProblemType' }],
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
      },
      {
        name: 'image',
        title: 'Illustration',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
    ],
  }
  