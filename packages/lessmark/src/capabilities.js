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
    version: "0.1.6",
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
      commands: ["parse", "check", "format", "fix", "from-markdown", "to-markdown", "render", "build", "init", "skill", "info"],
      jsonCommands: ["check --json", "format --check --json", "info --json"],
      formatCheck: true,
      sourcePositions: true,
      stdin: true,
      recursiveCheck: true,
      recursiveFormat: true,
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
    aliases: false,
      plainParagraphs: true,
      canonicalSource: true,
      documentedConveniencesOnly: true,
      maxSpellingsPerMeaning: 2,
      blockAliases: {},
      aliasAttrs: {},
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
        list: "kind",
        math: "notation",
        metadata: "key",
        reference: "target",
        risk: "level",
        skill: "name",
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
