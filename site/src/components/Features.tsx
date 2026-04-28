import { PixelSchema, PixelTree, PixelShield } from "./PixelIcons";

const ITEMS = [
  {
    Icon: PixelSchema,
    title: "Schema-first",
    body:
      "Ten typed blocks with declared attributes. Unknown blocks and undeclared attributes fail the parser, not the renderer.",
  },
  {
    Icon: PixelTree,
    title: "Stable AST",
    body:
      "Two reference parsers — JavaScript and Python — produce the same versioned JSON tree. Tools can read it without tracking grammar changes.",
  },
  {
    Icon: PixelShield,
    title: "Nothing executes",
    body:
      "No raw HTML, no JSX, no scripts, no expression syntax. A document is data; a renderer chooses how to display it.",
  },
];

export function Features() {
  return (
    <div className="grid gap-10 md:grid-cols-3 md:gap-8">
      {ITEMS.map(({ Icon, title, body }) => (
        <div key={title} className="grid gap-3">
          <Icon className="size-12 text-fg" size={48} />
          <h3 className="font-serif text-[26px] leading-[1.1] tracking-tight">{title}</h3>
          <p className="text-[15px] leading-[1.55] text-fg-muted">{body}</p>
        </div>
      ))}
    </div>
  );
}
