const task = {
    name: 'task',
    title: 'Task',
    type: 'document',
    fields: [
      { name: 'title', title: 'Task Name', type: 'string' },
      { name: 'description', title: 'What this task involves', type: 'text' },
      { name: 'category', title: 'Category', type: 'string' },
      { name: 'image', title: 'Illustration', type: 'image', options: { hotspot: true } },
    ],
  }
  
  export default task
  