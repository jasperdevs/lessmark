# Markdown Governance Timeline

This timeline is not a history of who was right. It is a list of failure modes Lessmark should avoid.

## 2009: Maintenance Without Stewardship

Jeff Atwood argued that Markdown had become important enough that a static home page, stale reference implementation, and hard-to-find test suite were no longer enough.

Lessmark lesson: the project home must include the current spec, implementation status, fixtures, schemas, and release process. A popular format with unclear ownership becomes hard to trust.

## 2012: Standardization Proposal

Atwood's later proposal asked for a formal spec, a test suite, saner defaults for common gotchas, cleanup of ambiguous edge cases, and a registry of known variants.

Lessmark lesson: this is the right shape. Lessmark should keep a small core, make behavior testable, and document named profiles instead of letting private variants accumulate.

## 2014: Standard Markdown Naming Conflict

The Standard Markdown launch became a naming and authority conflict. The project was renamed first to Common Markdown and then to CommonMark.

Lessmark lesson: names matter. Do not claim ownership of another ecosystem's identity. Lessmark can compare itself to Markdown, but it should not present itself as a blessed Markdown standard or drop-in replacement.

## 2014: Implementation Divergence

The Ars Technica coverage and Babelmark examples show the real operational problem: many Markdown parsers produced different outputs for ordinary input.

Lessmark lesson: conformance must be automated and cross-runtime. Human-friendly syntax is not enough if different implementations disagree.

## 2012-2014: Public Backlash

The MetaFilter and Hacker News discussions show a social split: some people wanted a clear standard, some objected to the naming, and some objected to attacking an original author for not maintaining a free project forever.

Lessmark lesson: keep the project factual. Publish the spec and tests, avoid personal framing, and make adoption depend on utility rather than drama.

## 2025: Markdown Is Still Chaotic

The OSNews summary of Karl Voit's critique repeats the durable complaints: variants, ambiguity, hard long-term processing, and syntax that was not designed for heavier structured documentation.

Lessmark lesson: Lessmark should not chase every Markdown feature. It should be explicit about its best use cases: agent-readable context and strict docs/sites where parseability matters more than ecosystem habit.

## Operating Rules

- Keep v0 strict.
- Keep the source grammar small.
- Keep every runtime fixture-compatible.
- Name profiles explicitly.
- Reject unknown syntax.
- Prefer versioned changes over compatibility guesses.
- Document tradeoffs before claiming superiority.
