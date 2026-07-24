# OpenAI Response Generation Provider

This package is an outward translation boundary implementing the repository's
`ResponseGenerator` port. It translates `GenerationContext` into a minimal
OpenAI Responses API request and translates its `output_text` content into a
provider-neutral `GeneratedResponse`. The Responses API replaces the original
Chat Completions transport without changing the provider boundary.

OpenAI request and response types are private to this package. The provider
receives only the projected conversation, approved Knowledge Units, mandatory
Behavior constraints, and generation intent already present in
`GenerationContext`.

The provider does not read Markdown or filesystem paths, access repositories,
retrieve Knowledge, evaluate Behavior, mutate Conversation, call Tools, or
construct business rules. It performs no streaming, tool calling, structured
output, JSON mode, embeddings, memory, or provider-specific orchestration.

Composition requires both `OPENAI_API_KEY` and `OPENAI_MODEL`. Model selection
is runtime configuration, not an architectural responsibility or a provider
fallback. Transport failures, non-success status codes, malformed JSON, and
missing response text reject with provider-neutral operational errors; vendor
response objects never cross the port.
