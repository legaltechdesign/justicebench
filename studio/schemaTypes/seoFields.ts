// /schemas/objects/seoFields.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoFields",
  title: "SEO Fields",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
    defineField({ name: "metaDescription", title: "Meta Description", type: "text", rows: 3 }),
    defineField({ name: "openGraphImage", title: "Open Graph Image", type: "image", options: { hotspot: true } }),
  ],
});