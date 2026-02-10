// /schemas/objects/architectureLayer.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "architectureLayer",
  title: "Architecture Layer",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Layer name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "components",
      title: "Components",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: { select: { title: "name" } },
});