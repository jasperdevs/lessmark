import { CALLOUT_KINDS, CORE_BLOCK_NAMES, LIST_KINDS, RISK_LEVELS, TASK_STATUSES } from "./grammar.js";

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
    version: "0.1.0",
    astVersion: "v0",
    extensions: [".mu", ".lessmark"],
    mediaType: "text/vnd.lessmark; charset=utf-8",
    blocks: [...CORE_BLOCK_NAMES],
    inlineFunctions: [...INLINE_FUNCTIONS],
    enums: {
      taskStatus: [...TASK_STATUSES],
      riskLevel: [...RISK_LEVELS],
      listKind: [...LIST_KINDS],
      calloutKind: [...CALLOUT_KINDS]
    },
    cli: {
      commands: ["parse", "check", "format", "fix", "from-markdown", "to-markdown", "render", "build", "info"],
      jsonCommands: ["check --json", "info --json"],
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
      rawHtml: false,
      hooks: false,
      customBlocks: false,
      nestedLists: true
    }
  };
}
