# Behavior

## Purpose

Behavior is the inward capability that defines how a digital employee is
permitted and expected to act. It makes policies, constraints, escalation
decisions, response posture, and employee-specific conduct explicit,
reviewable, and independent of model prompts.

## Responsibilities

Behavior owns:

- applicable policies, constraints, and guardrails;
- permitted, prohibited, and escalation-required action decisions;
- employee-specific role, posture, tone constraints, and conduct;
- disclosure, refusal, handoff, and human-oversight requirements;
- precedence and conflict semantics among behavior rules; and
- the capability vocabulary for evaluating and communicating behavior
  decisions.

## Inputs

Conceptual inputs include the intended employee, proposed conversational or tool
action, relevant organizational and interaction context, applicable authority,
and known risk signals. Inputs are not provider prompts, transport payloads,
tool SDK calls, or persistence records.

## Outputs

Conceptual outputs include explicit permissions, prohibitions, constraints,
required escalation or handoff, response posture, and reasons or policy
references suitable for audit. Behavior produces decisions and constraints, not
generated prose or executed actions.

## Ownership

Behavior exclusively owns policy interpretation, constraints, permitted-action
decisions, escalation decisions, response posture, and employee-specific
conduct. Tools and Response Generation must consume approved Behavior outcomes;
they may not reinterpret or relax them.

## Explicit exclusions

Behavior does not own:

- business facts, evidence retrieval, or knowledge truth;
- durable memory or its storage;
- model execution, prompt rendering, or generated responses;
- conversation persistence or aggregate lifecycle;
- tool execution;
- application orchestration;
- channels, transport, or delivery; or
- customer configuration storage and infrastructure technology.

## Dependencies

Behavior may depend on its own future contracts, explicit policy material
supplied through inward concepts, and narrowly shared primitives with no more
specific owner. It remains independent of provider SDKs, prompt formats, tool
adapters, storage, channels, and transport. Other capability results may be
provided as evaluated context through Behavior-owned inputs; Behavior does not
import those capabilities to obtain them.

## Future ports suggested by the boundary

This boundary suggests future inward ports for evaluating conduct, authorizing
or rejecting a proposed action, determining escalation, and resolving applicable
employee policy. Their exact contracts are deferred. Policy engines or
configuration-backed evaluators may later implement those ports without
becoming the source of Behavior semantics.

## Invariants

- Every meaningful behavior decision identifies the employee and applicable
  authority or policy scope.
- Permission is intentional and never inferred from a Tool's availability.
- Prohibitions and required escalation cannot be weakened downstream.
- Conflicting rules are resolved through explicit precedence or yield a
  constrained failure.
- Behavior decisions remain independent of prompt wording and model choice.
- Response Generation remains subordinate to Behavior constraints.
- Tools never decide their own authorization.
- Human oversight is required for irreversible business decisions.

## Failure expectations

Behavior fails closed when authority, applicable policy, or a safe conflict
resolution cannot be established. Evaluation failures, ambiguous authority,
policy conflicts, and escalation requirements must be explicit. Failure must
not default to permission, be hidden inside a generated response, or be delegated
to a Tool or external model.

## Relationship to Conversation

Conversation records bounded interaction state; it does not define employee
conduct. The Application Layer may provide relevant conversational context for
a Behavior decision and apply the result while coordinating the interaction.
Behavior neither mutates nor persists Conversation and does not place policy
concepts inside the aggregate.

## Relationship to the Application Layer

The Application Layer decides when behavior evaluation is required, supplies
the proposed action and relevant context, and enforces the resulting constraints
while orchestrating other capabilities. It consumes future Behavior-owned
contracts but does not invent permission, override escalation, or translate
uncertainty into approval.

## Relationship to Infrastructure

Infrastructure may implement future Behavior ports with policy engines,
configuration sources, or rule evaluators. It translates external
representations into Behavior-owned decisions and preserves their reasons.
Infrastructure does not define employee authority, hide policy conflicts, or
make prompts the source of truth.

## Examples of what belongs inside the capability

- A decision that appointment cancellation requires human confirmation.
- A constraint to avoid disclosing sensitive customer information.
- An escalation requirement for an irreversible business decision.
- Employee-specific tone and response-posture constraints.
- Precedence rules for conflicting policies.

## Examples of what must remain outside the capability

- The factual opening hours of a business.
- A remembered customer preference.
- Model invocation or prompt templates.
- A calendar API call or email delivery.
- Conversation storage and channel formatting.
- The use-case workflow sequencing policy evaluation and execution.
