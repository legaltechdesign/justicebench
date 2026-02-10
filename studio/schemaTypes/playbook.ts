import { defineType, defineField } from "sanity";

export default defineType({
  name: "playbook",
  title: "Playbook",
  type: "document",
  groups: [
    { name: "basics", title: "Basics" },
    { name: "content", title: "Playbook Content" },
    { name: "links", title: "Links & Relationships" },
    { name: "publishing", title: "Publishing" },
  ],
  fields: [
    // --- BASICS ---
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "basics",
      validation: (Rule) => Rule.required().min(8),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basics",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "playbookType",
      title: "Playbook Type",
      type: "string",
      group: "basics",
      options: {
        list: [
          { title: "Task Playbook", value: "task" },
          { title: "Workflow Playbook", value: "workflow" },
          { title: "Starter Kit", value: "starterKit" },
          { title: "Reference Architecture", value: "referenceArchitecture" },
          { title: "Evaluation Playbook", value: "evaluation" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Short Summary",
      type: "text",
      group: "basics",
      rows: 3,
      description: "1–3 sentences that appear on cards and the top of the page.",
      validation: (Rule) => Rule.required().min(40).max(320),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "basics",
      options: { hotspot: true },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "publishing",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "In Review", value: "review" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      group: "publishing",
      description: "Human-readable version (e.g., v0.3, 2026-02).",
      initialValue: "v0.1",
    }),
    defineField({
      name: "lastValidatedAt",
      title: "Last Validated",
      type: "datetime",
      group: "publishing",
      description: "When someone last sanity-checked the content for correctness/fitness.",
    }),

    // --- WHO IT'S FOR / USE CONTEXT ---
    defineField({
      name: "audiences",
      title: "Primary Audiences",
      type: "array",
      group: "basics",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Legal Aid Lawyers", value: "lawyers" },
          { title: "Court Self-Help Staff", value: "courtStaff" },
          { title: "Legal Aid Technologists", value: "legalTech" },
          { title: "LLM / ML Technologists", value: "mlTech" },
          { title: "Evaluators / Researchers", value: "evaluators" },
          { title: "Funders / Philanthropy", value: "funders" },
          { title: "Website Content Teams", value: "contentTeams" },
        ],
      },
    }),
    defineField({
      name: "maturityLevel",
      title: "Maturity Level",
      type: "string",
      group: "basics",
      options: {
        list: [
          { title: "Starter (0–90 days)", value: "starter" },
          { title: "Scaling (3–12 months)", value: "scaling" },
          { title: "Advanced (12+ months)", value: "advanced" },
        ],
        layout: "radio",
      },
      initialValue: "starter",
    }),

    // --- MAIN PLAYBOOK BODY (SECTION BUILDER) ---
    defineField({
      name: "sections",
      title: "Playbook Sections",
      type: "array",
      group: "content",
      description:
        "Build the playbook from structured sections so pages stay consistent and scannable.",
      of: [
        { type: "playbookHero" },
        { type: "playbookProblemFrame" },
        { type: "playbookUserJourney" },
        { type: "playbookArchitecture" },
        { type: "playbookImplementationPatterns" },
        { type: "playbookFailureModes" },
        { type: "playbookEvaluation" },
        { type: "playbookAssets" },
        { type: "playbookDecisionRecord" },
        { type: "playbookOpenQuestions" },
        { type: "playbookFreeform" }, // escape hatch
      ],
      validation: (Rule) => Rule.min(1),
    }),

    // --- LINKS & RELATIONSHIPS ---
    defineField({
      name: "relatedTasks",
      title: "Related Tasks",
      type: "array",
      group: "links",
      of: [{ type: "reference", to: [{ type: "task" }] }],
      description: "Connect to your existing JusticeBench Task pages.",
    }),
    defineField({
      name: "relatedProjects",
      title: "Related Projects",
      type: "array",
      group: "links",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
    defineField({
      name: "relatedDatasets",
      title: "Related Datasets",
      type: "array",
      group: "links",
      of: [{ type: "reference", to: [{ type: "dataset" }] }],
    }),

    // Optional: if you have “tools” or “vendors” content types later
    defineField({
      name: "externalLinks",
      title: "External Links",
      type: "array",
      group: "links",
      of: [{ type: "link" }],
    }),

    // --- SEO ---
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
      group: "publishing",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "playbookType",
      media: "heroImage",
      status: "status",
      version: "version",
    },
    prepare({ title, subtitle, media, status, version }) {
      return {
        title: `${title} ${version ? `(${version})` : ""}`,
        subtitle: `${subtitle || "playbook"} • ${status || "draft"}`,
        media,
      };
    },
  },
});