import { defineType, defineField } from "sanity";

export default defineType({
  name: "playbookImplementationPatterns",
  title: "Playbook Implementation Patterns",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Implementation patterns" }),
    defineField({
      name: "patterns",
      title: "Patterns",
      type: "array",
      of: [{ type: "implementationPattern" }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: { select: { title: "heading" } },
});