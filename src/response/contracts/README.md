# Response Generation Contracts

Response Generation owns `GenerationIntent`, `ApprovedContext`, and
`GenerationContext` because these types define the information from which
language may be proposed. They remain independent of providers, prompts,
transports, and infrastructure.

`GenerationIntent` is a closed description of the immediate response objective.
`ApprovedContext` deliberately projects Conversation data, records the
permitted Behavior decision, and makes the current absence of Knowledge and
Memory contributions explicit. A generator must not treat that absence as
permission to retrieve or invent context.

`GenerationContext` is not a prompt. A future provider adapter must translate
it at the outer boundary. Behavior constraints are carried unchanged so the
translation remains auditable and cannot silently broaden permission.

The conversation projection contains identity, lifecycle state, participant
snapshots, and a bounded recent-message window. It excludes Turn structure and
unbounded history because generation should receive only the data it needs.
Future relevance and context-window policies may replace the temporary fixed
bound through an explicit architectural change.
