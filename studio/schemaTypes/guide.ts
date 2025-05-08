const guide = {
    name: 'guide',
    title: 'Guide',
    type: 'document',
    fields: [
      { name: 'title', title: 'Guide Title', type: 'string' },
      { name: 'description', title: 'Summary', type: 'text' },
      { name: 'link', title: 'Link to Full Guide', type: 'url' },
      { name: 'image', title: 'Illustration', type: 'image', options: { hotspot: true } },
    ],
  }
  
  export default guide
  