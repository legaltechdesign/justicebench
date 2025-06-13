export default {
    name: 'status',
    title: 'Status',
    type: 'document',
    fields: [
      {
        name: 'status',
        title: 'Status',
        type: 'string',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        description: 'Brief explanation of what this status means for the project lifecycle.'
      },
      {
        name: 'icon',
        title: 'Icon',
        type: 'image',
        description: 'Visual icon representing this project status (e.g., vision, prototype, pilot, live).',
        options: {
          hotspot: true
        }
      },
      {
        name: 'color',
        title: 'Color Code',
        type: 'string',
        description: 'Hex or Tailwind-compatible color code to use for UI labeling.',
      }
    ]
  };
  