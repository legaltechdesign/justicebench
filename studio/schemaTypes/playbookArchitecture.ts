// /schemas/objects/playbookSections/playbookArchitecture.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "playbookArchitecture",
  title: "Reference Architecture",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Reference architecture" }),
    defineField({
      name: "diagram",
      title: "Diagram",
      type: "image",
      options: { hotspot: true },
      description: "Upload a diagram image (or swap later for a custom diagram component).",
    }),
    defineField({
      name: "layers",
      title: "Architecture layers",
      type: "array",
      of: [{ type: "architectureLayer" }],
    }),
    defineField({
      name: "variationPoints",
      title: "Variation points",
      type: "array",
      of: [{ type: "string" }],
      description: "Places teams can swap vendors/tools without breaking the pattern.",
    }),
  ],
  preview: { select: { title: "heading" } },
});