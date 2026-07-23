# Behavior Contracts

These contracts are the provider- and transport-neutral vocabulary used to ask
Behavior whether a proposed receptionist action is allowed.

`ProposedAction` is deliberately closed to the four actions supported by this
slice. `BehaviorRequest` contains only evaluated policy signals: side-effect
requirements, prior authorization, supported scope, and human-escalation
requirements, together with branded employee and policy-scope identifiers. It
does not copy Conversation or accept an unstructured metadata bag.

`BehaviorDecision` is an explicit union of `permitted`, `prohibited`, and
`escalation_required`. Negative policy outcomes are values rather than
exceptions. Every outcome names a stable rule and reason code for audit.
Every decision repeats the evaluated employee and policy scope. Permitted
outcomes also carry mandatory downstream constraints.

Ambiguous policy signals are representable so the engine can fail closed.
Nothing is authorized by omission, Tool availability, or a default boolean.
Tools consume authorization established by Behavior; they cannot authorize
themselves.
