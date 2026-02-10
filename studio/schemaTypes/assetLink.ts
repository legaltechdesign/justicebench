// /schemas/objects/assetLink.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "assetLink",
  title: "Asset Link",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "assetType",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Prompt", value: "prompt" },
          { title: "Rubric", value: "rubric" },
          { title: "Schema / JSON", value: "schema" },
          { title: "Checklist", value: "checklist" },
          { title: "Repository", value: "repo" },
          { title: "Example documents", value: "examples" },
          { title: "Other", value: "other" },
        ],
        layout: "dropdown",
      },
      initialValue: "other",
    }),
    defineField({ name: "link", title: "Link", type: "url", validation: (Rule) => Rule.required().uri({ allowRelative: true }) }),
    defineField({ name: "notes", title: "Notes", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "title", subtitle: "assetType" },
  },
});