import { defineField, defineType } from "sanity";

export default defineType({
  name: "implementationPattern",
  title: "Implementation Pattern",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      options: {
        list: [
          { title: "Starter", value: "starter" },
          { title: "Scaling", value: "scaling" },
          { title: "Advanced", value: "advanced" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 2 }),
    defineField({
      name: "recommendedFor",
      title: "Recommended for",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "components",
      title: "Key components",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "tradeoffs",
      title: "Tradeoffs",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "summary" },
  },
});