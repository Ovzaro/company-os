# Filesystem Knowledge Retrieval

This adapter implements the Knowledge-owned retrieval port by reading approved
Markdown documents from the sibling `ovzaro-knowledge` repository. It builds a
read-only in-memory index once, then ranks exact normalized keyword matches
across titles, headings, filenames, tags, metadata, and document content.
Scores are fixed and ties are resolved by repository-relative path.

Only documents whose frontmatter has `status: Approved` enter the index.
Results preserve the body, title, headings, tags, all parsed frontmatter, the
repository-relative path, and explicit source attribution.

## Architectural reasons

Deterministic retrieval comes before semantic retrieval because it proves the
port, orchestration order, Behavior gate, provenance, and context handoff
without hiding mistakes behind model behavior or approximate ranking.

Business facts remain repository-owned. The knowledge repository supplies
review, ownership, approval status, version history, and one canonical home for
facts; the Receptionist consumes those facts but does not rewrite them.

Generation providers never read files directly. Application orchestration calls
the Knowledge port only after Behavior permits the action, then passes the
result into the Generation Context Builder. This keeps filesystem layout,
retrieval strategy, and provider implementation independently replaceable and
ensures prohibited requests cannot trigger retrieval.

## Future evolution

The filesystem index can later be replaced by an adapter that chunks approved
documents and uses embeddings or another semantic index. The Knowledge request,
result, metadata, and attribution contracts should remain stable. Semantic
ranking must add evaluation, freshness handling, and provenance guarantees
rather than moving retrieval into a generation provider.
