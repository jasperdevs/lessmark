import { CALLOUT_KINDS, CORE_BLOCK_NAMES, DIAGRAM_KINDS, LIST_KINDS, MATH_NOTATIONS, RISK_LEVELS, TASK_STATUSES } from "./grammar.js";

export const INLINE_FUNCTIONS = [
  "strong",
  "em",
  "code",
  "kbd",
  "del",
  "mark",
  "sup",
  "sub",
  "ref",
  "footnote",
  "link"
];

export function getCapabilities() {
  return {
    language: "lessmark",
    version: "0.1.4",
    astVersion: "v0",
    extensions: [".lmk", ".lessmark"],
    mediaType: "text/vnd.lessmark; charset=utf-8",
    blocks: [...CORE_BLOCK_NAMES],
    inlineFunctions: [...INLINE_FUNCTIONS],
    enums: {
      taskStatus: [...TASK_STATUSES],
      riskLevel: [...RISK_LEVELS],
      listKind: [...LIST_KINDS],
      calloutKind: [...CALLOUT_KINDS],
      mathNotation: [...MATH_NOTATIONS],
      diagramKind: [...DIAGRAM_KINDS]
    },
    cli: {
      commands: ["parse", "check", "format", "fix", "from-markdown", "to-markdown", "render", "build", "info"],
      jsonCommands: ["check --json", "info --json"],
      formatCheck: true,
      strictBuild: true
    },
    renderer: {
      html: true,
      fullDocument: true,
      staticSiteBuild: true,
      strictLinkAssetCheck: true,
      rawHtml: false
    },
    syntaxPolicy: {
      aliases: true,
      plainParagraphs: true,
      canonicalSource: true,
      documentedConveniencesOnly: true,
      maxSpellingsPerMeaning: 3,
      maxSpellingsException: "paragraph",
      blockAliases: {
        p: "paragraph",
        note: "callout",
        warning: "callout",
        ul: "list",
        ol: "list"
      },
      aliasAttrs: {
        note: { kind: "note" },
        warning: { kind: "warning" },
        ul: { kind: "unordered" },
        ol: { kind: "ordered" }
      },
      shorthandAttrs: {
        api: "name",
        callout: "kind",
        code: "lang",
        diagram: "kind",
        decision: "id",
        definition: "term",
        "depends-on": "target",
        file: "path",
        footnote: "id",
        link: "href",
        math: "notation",
        metadata: "key",
        reference: "target",
        risk: "level",
        table: "columns",
        task: "status"
      },
      literalBlocks: ["code", "example", "math", "diagram"],
      literalBlockTermination: "blank-line-before-next-block",
      markdownLegacySyntax: false,
      rawHtml: false,
      hooks: false,
      customBlocks: false,
      nestedLists: true
    }
  };
}
