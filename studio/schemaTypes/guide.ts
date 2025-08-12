const guide = {
    name: 'guide',
    title: 'Guide',
    type: 'document',
    fields: [
      { name: 'title', title: 'Guide Title', type: 'string' },
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
      { name: 'link', title: 'Link to Full Guide', type: 'url' },
      { name: 'image', title: 'Illustration', type: 'image', options: { hotspot: true } },
    ],
  }
  
  export default guide
  