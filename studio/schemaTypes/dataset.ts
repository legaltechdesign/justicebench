const dataset = {
    name: 'dataset',
    title: 'Dataset',
    type: 'document',
    fields: [
      { name: 'name', title: 'Dataset Name', type: 'string' },
      { name: 'description', title: 'What it contains / how it was labeled', type: 'text' },
      { name: 'link', title: 'Download or GitHub Link', type: 'url' },
      { name: 'image', title: 'Illustration', type: 'image', options: { hotspot: true } },
    ],
  }
  
  export default dataset
  