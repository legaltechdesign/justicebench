// /schemas/objects/playbookSections/playbookFreeform.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "playbookFreeform",
  title: "Freeform Section",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Freeform Section" };
    },
  },
});