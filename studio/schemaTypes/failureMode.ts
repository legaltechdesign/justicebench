// /schemas/objects/failureMode.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "failureMode",
  title: "Failure Mode",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      options: {
        list: [
          { title: "Low", value: "low" },
          { title: "Medium", value: "medium" },
          { title: "High", value: "high" },
        ],
        layout: "radio",
      },
      initialValue: "medium",
    }),
    defineField({ name: "whatHappens", title: "What happens", type: "text", rows: 2 }),
    defineField({ name: "whyItMatters", title: "Why it matters", type: "text", rows: 2 }),
    defineField({
      name: "mitigations",
      title: "Mitigations",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "severity" },
  },
});