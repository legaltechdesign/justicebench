import { defineType, defineField } from "sanity";

export default defineType({
  name: "playbookDecisionRecord",
  title: "Decision Record",
  type: "object",
  fields: [
    defineField({ name: "decision", title: "Decision", type: "string" }),
    defineField({
      name: "context",
      title: "Context",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "tradeoffs",
      title: "Tradeoffs",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "decision" },
    prepare({ title }) {
      return { title: title || "Decision Record" };
    },
  },
});