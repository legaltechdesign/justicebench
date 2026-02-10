// /schemas/objects/link.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "url", title: "URL", type: "url", validation: (Rule) => Rule.required() }),
  ],
});