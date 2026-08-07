# Filesystem Knowledge Retrieval

This adapter implements the Knowledge-owned retrieval port by reading approved
Markdown documents from the sibling `ovzaro-knowledge` repository. It builds a
read-only in-memory unit index once. Knowledge-owned parsing splits each source
document by heading structure; Infrastructure supplies filesystem access,
frontmatter parsing, approval filtering, and source identity.

Only documents whose frontmatter has `status: Approved` enter the index.
Results preserve the bounded unit body, heading and heading path, source
document title and path, inherited tags and typed frontmatter, deterministic
unit ID and order, score, and explicit source attribution.

## Deterministic unit ranking

The normalized query is deduplicated into exact tokens. For each unique token,
the fixed weights are:

| Unit-level field                   |        Weight and bound |
| ---------------------------------- | ----------------------: |
| Unit heading                       |               120, once |
| Heading path                       |       80, at most twice |
| Source document title              |                60, once |
| Source filename                    |                50, once |
| Inherited tags                     |       40, at most twice |
| Inherited metadata keys and values |       15, at most twice |
| Direct unit content                | 10, at most three times |

These caps prevent repeated query terms, duplicate metadata, or long sections
from causing uncontrolled score inflation. This is exact deterministic keyword
ranking, not semantic similarity. Scores sort descending; ties sort by stable
repository-relative source path and then source unit order.

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

The same attributable units could later be indexed by a different ranking
adapter without changing their identity or provenance. Establishing bounded
units prepares that seam for future indexing techniques, including embeddings,
but this implementation requires none and makes no semantic claims.

Generation providers still cannot read files directly. Application retrieves
units only after Behavior permission and passes them through the Response-owned
Generation Context Builder.
