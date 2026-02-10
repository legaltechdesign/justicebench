// /schemas/objects/playbookSections/playbookFailureModes.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "playbookFailureModes",
  title: "Failure Modes",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Common failure modes" }),
    defineField({
      name: "items",
      title: "Failure modes",
      type: "array",
      of: [{ type: "failureMode" }],
      validation: (Rule) => Rule.min(3),
    }),
  ],
  preview: { select: { title: "heading" } },
});