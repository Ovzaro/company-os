# Knowledge

## Purpose

Knowledge is the inward capability for finding trustworthy, source-grounded
information. It makes evidence, provenance, ranking, and uncertainty explicit
so absence of knowledge cannot silently become invented knowledge.

## Responsibilities

Knowledge owns:

- the meaning of a knowledge request and retrieved evidence;
- source identity, provenance, citation, and freshness semantics;
- trustworthiness, relevance, and ranking rules for evidence;
- source and scope constraints applied during retrieval;
- distinctions among supported, conflicting, stale, and absent evidence; and
- the capability vocabulary for source-grounded retrieval.

## Inputs

Conceptual inputs include an information need, retrieval scope, source
constraints, freshness requirements, and context necessary to judge relevance.
Inputs are not model prompts, vendor search payloads, complete Conversation
aggregates, or storage queries.

## Outputs

Conceptual outputs include ranked evidence with provenance, trust and freshness
signals, conflicts or uncertainty, and an explicit no-evidence result. Knowledge
returns grounded information for use by an application workflow; it does not
compose the receptionist's response.

## Ownership

Knowledge exclusively owns evidence retrieval semantics, provenance,
trustworthiness, ranking, and source-grounded information. A source or retrieval
adapter may supply data, but it does not define what qualifies as evidence or
how evidence quality is communicated.

## Documents and Knowledge Units

A Markdown document is the governed, reviewable source of truth in the
knowledge repository. A `KnowledgeUnit` is the bounded retrieval boundary
derived from that document. Retrieval operates on units so Generation Context
receives only the directly relevant section instead of unrelated sections from
the same file.

Every unit inherits the source document title, tags, typed frontmatter metadata,
and explicit repository attribution. Its `headingPath` records the active
H1-through-H6 hierarchy, so a section remains understandable and attributable
after retrieval.

The pure Markdown parser applies these deterministic rules:

- text before the first heading becomes a `Document Prelude` unit with an empty
  heading path;
- a document with no headings uses that same prelude rule;
- each heading unit contains only its direct body up to the next heading;
- descendant content is not copied into a parent unit;
- empty sections are omitted because later non-empty units retain the meaningful
  ancestor headings in their heading paths;
- skipped heading levels still extend the nearest active ancestor path; and
- repeated headings remain separate and retain source order.

Unit IDs have the form
`<source-path>#unit-<zero-padded-heading-ordinal>-<heading-slug>`. The prelude
uses ordinal zero. Heading ordinals count all headings, including omitted empty
sections, making repeated names unique and preserving deterministic document
order without random or provider-specific identity.

The parser accepts already parsed document identity, metadata, and body. It
performs no I/O, retrieval scoring, provider work, or input mutation.

## Explicit exclusions

Knowledge does not own:

- durable personal or organizational memory;
- live conversation state;
- behavior policy, authorization, or permitted actions;
- response generation or prompt construction;
- model or generation-provider integrations;
- application orchestration;
- databases, search engines, crawlers, or vendor SDKs; or
- channel presentation and transport.

## Dependencies

Knowledge may depend on its own future contracts and narrowly shared primitives
with no more specific owner. It remains independent of Memory, Conversation,
Behavior, Response Generation, Tools, provider vendors, retrieval products, and
transports. Context needed for retrieval is supplied through a Knowledge-owned
request rather than by importing another capability's model.

## Future ports suggested by the boundary

This boundary suggests future inward ports for retrieving and ranking evidence,
resolving source metadata, and assessing evidence freshness or trustworthiness.
Their exact contracts are deferred. Search engines, document stores, APIs, and
other outward adapters would implement those ports without defining Knowledge
semantics.

## Invariants

- Every evidence item identifies its source and preserves provenance.
- Every retrieved unit preserves its source document and heading path.
- Source document boundaries do not define retrieval boundaries.
- Parent units do not duplicate content owned by descendant units.
- Ranking and trust signals remain distinguishable; relevance alone does not
  make a source authoritative.
- Scope and access constraints are honored during retrieval.
- Conflicting, stale, or uncertain evidence is represented explicitly.
- Absence of evidence is an ordinary, explicit result.
- Absence of knowledge must never be converted into a fabricated fact.
- Provider prompts and vendor result shapes never become Knowledge contracts.

## Failure expectations

Knowledge failures are explicit and expressed in Knowledge vocabulary.
Unavailable sources, invalid scope, access restrictions, stale results,
conflicting evidence, and no evidence must remain distinguishable when relevant.
Partial retrieval must identify its limitations. A retrieval failure must not
produce unsupported claims or be concealed by Response Generation.

## Relationship to Conversation

Conversation supplies bounded interaction state, not authoritative knowledge.
The Application Layer may derive an information need from a Conversation and
later use evidence while advancing it, but Knowledge neither owns nor mutates
the aggregate. A statement in a Conversation is not trusted evidence merely
because it was said.

## Relationship to the Application Layer

The Application Layer decides when a use case needs evidence and coordinates
the Knowledge result with Behavior, Memory, and Response Generation. It consumes
future Knowledge-owned contracts. It must preserve explicit absence,
uncertainty, conflict, and provenance rather than weakening those outcomes.

## Relationship to Infrastructure

Infrastructure will implement future Knowledge ports with search services,
document stores, databases, crawlers, or external APIs. Adapters translate
vendor responses into Knowledge-owned evidence and error semantics. They do not
decide organizational truth, erase provenance, or expose vendor types inward.

## Examples of what belongs inside the capability

- A retrieval request constrained to approved policy documents.
- Evidence with a source identifier, citation, timestamp, and relevance.
- Rules for ranking authoritative sources above less trusted sources.
- An explicit result indicating conflicting or missing evidence.
- Freshness and trustworthiness semantics.

## Examples of what must remain outside the capability

- A remembered caller preference.
- Conversation turns or messages.
- A policy deciding whether the employee may disclose evidence.
- A prompt that asks a model to answer from documents.
- A Pinecone, Elasticsearch, web-search, or model-provider integration.
- The final response wording or channel delivery.
