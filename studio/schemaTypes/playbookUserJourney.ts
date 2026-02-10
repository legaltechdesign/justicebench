import { defineType, defineField } from "sanity";

export default defineType({
  name: "playbookUserJourney",
  title: "User Journey",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "User journey",
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [{ type: "journeyStep" }],
      validation: (Rule) => Rule.min(3),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "User Journey" };
    },
  },
});