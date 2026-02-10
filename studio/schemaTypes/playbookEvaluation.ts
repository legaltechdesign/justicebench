// /schemas/objects/playbookSections/playbookEvaluation.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "playbookEvaluation",
  title: "Evaluation",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "How to evaluate" }),
    defineField({
      name: "rubricSummary",
      title: "Rubric summary",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "recommendedMetrics",
      title: "Recommended metrics / criteria",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "linkedDatasets",
      title: "Datasets for evaluation",
      type: "array",
      of: [{ type: "reference", to: [{ type: "dataset" }] }],
    }),
  ],
  preview: { select: { title: "heading" } },
});