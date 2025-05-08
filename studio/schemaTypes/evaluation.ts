const evaluation = {
    name: 'evaluation',
    title: 'Evaluation',
    type: 'document',
    fields: [
      { name: 'title', title: 'Evaluation Title', type: 'string' },
      { name: 'method', title: 'Method Summary', type: 'text' },
      { name: 'link', title: 'External Resource or GitHub', type: 'url' },
      { name: 'image', title: 'Illustration', type: 'image', options: { hotspot: true } },
    ],
  }
  
  export default evaluation
  