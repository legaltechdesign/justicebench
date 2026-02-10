// /schemas/objects/playbookSections/playbookAssets.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "playbookAssets",
  title: "Assets & Templates",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Assets & templates" }),
    defineField({
      name: "assets",
      title: "Assets",
      type: "array",
      of: [{ type: "assetLink" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: { select: { title: "heading" } },
});