// /schemas/objects/playbookSections/playbookProblemFrame.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "playbookProblemFrame",
  title: "Problem Frame",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "What this helps with" }),
    defineField({
      name: "oneLiner",
      title: "One-liner",
      type: "string",
      description: "A punchy sentence that shows up in callouts.",
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "whatGoodLooksLike",
      title: "What good looks like",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "redLines",
      title: "Red lines (don’t do this)",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "oneLiner" },
  },
});