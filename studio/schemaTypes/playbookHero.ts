import { defineType, defineField } from "sanity";

export default defineType({
  name: "playbookHero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subhead", title: "Subhead", type: "text", rows: 2 }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Hero" };
    },
  },
});