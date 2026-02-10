import { defineType, defineField } from "sanity";

export default defineType({
  name: "playbookOpenQuestions",
  title: "Open Questions",
  type: "object",
  fields: [
    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Open Questions" };
    },
  },
});