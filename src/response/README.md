# Response Generation

Response Generation owns the contracts and mechanics needed to turn explicitly
approved context into a language proposal. Its context contract belongs here
because providers must consume Ovzaro's vocabulary rather than define it.

Application controls when context is built: Behavior must first permit the
action, and non-permitted outcomes stop before assembly or generation. The
builder records Behavior constraints unchanged, projects only bounded
Conversation data, and explicitly records that Knowledge and Memory were not
requested. This makes authorization, provenance gaps, and data exposure
auditable.

`GenerationContext` is not a provider prompt. Future provider implementations
translate it at the outer boundary and must not retrieve missing information,
reinterpret policy, or redefine the inward contract. Future Knowledge and
Memory enrichment, relevance selection, and context-window policies require
typed contracts and explicit Application orchestration.
