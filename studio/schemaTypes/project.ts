const project = {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
      { name: 'title', title: 'Title', type: 'string' },
      { name: 'description', title: 'Description', type: 'text' },
      { name: 'url', title: 'Link to Repo or Demo', type: 'url' },
      { name: 'image', title: 'Illustration', type: 'image', options: { hotspot: true } },
    ],
  }
  
  export default project
  