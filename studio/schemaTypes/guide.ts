const guide = {
    name: 'guide',
    title: 'Resources',
    type: 'document',
    description: 'Links to external guides, PDFs, toolkits from other organizations',
    fields: [
      { name: 'title', title: 'Resource Title', type: 'string' },
      {
        name: 'sortOrder',
        title: 'Order',
        type: 'number',
        description: 'Lower numbers appear first',
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
      { name: 'link', title: 'Link to Full Resource', type: 'url' },
      { name: 'image', title: 'Illustration', type: 'image', options: { hotspot: true } },
    ],
  }
  
  export default guide
  