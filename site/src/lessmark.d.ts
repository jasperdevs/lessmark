/// <reference types="vite/client" />

declare module "lessmark" {
  export type LessmarkInline = {
    type: "text" | "strong" | "em" | "code" | "kbd" | "mark" | "del" | "link" | "ref" | "footnote";
    text?: string;
    label?: string;
    href?: string;
    target?: string;
    id?: string;
    children?: LessmarkInline[];
  };

  export type LessmarkBlock = {
    type: string;
    name?: string;
    text?: string;
    level?: number;
    attrs?: Record<string, string>;
    children?: LessmarkInline[];
    items?: Array<{ text: string; children?: LessmarkInline[] }>;
    columns?: string[];
    rows?: string[][];
  };

  export type LessmarkAst = {
    type: "document";
    version?: string;
    children: LessmarkBlock[];
  };

  export class LessmarkError extends Error {
    constructor(message: string, line?: number, column?: number);
    line: number;
    column: number;
  }

  export function parseLessmark(source: string, options?: { sourcePositions?: boolean }): LessmarkAst;
  export function formatLessmark(source: string): string;
  export function formatAst(ast: LessmarkAst): string;
  export function validateSource(source: string): Array<{ message: string; line: number; column: number; code?: string }>;
  export function validateAst(ast: LessmarkAst): Array<{ message: string; line: number; column: number; code?: string }>;
  export function errorCodeForMessage(message: string): string | undefined;
  export function fromMarkdown(source: string): string;
  export function toMarkdown(source: string): string;
  export function renderHtml(astOrSource: string | LessmarkAst, options?: { document?: boolean }): string;
  export function renderInline(children: LessmarkInline[]): string;
  export function getCapabilities(): unknown;
  export const CORE_BLOCKS: readonly string[];
}
