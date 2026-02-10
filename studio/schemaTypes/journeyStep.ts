// /schemas/objects/journeyStep.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "journeyStep",
  title: "Journey Step",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Step title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "inputs",
      title: "Inputs",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "outputs",
      title: "Outputs",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "risks",
      title: "Risks / Failure modes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "implementationNotes",
      title: "Implementation notes",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: { select: { title: "title" } },
});