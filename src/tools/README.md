# Tools

## Purpose

Tools is the inward capability for controlled execution of approved actions
against external systems. It defines what execution is requested and what
happened without allowing an executable integration to grant itself authority.

## Responsibilities

Tools owns:

- provider-neutral descriptions of executable actions;
- validation of action inputs against an approved request;
- controlled invocation and execution-result semantics;
- side-effect, idempotency, timeout, and execution-status concepts;
- audit-relevant execution facts and external references; and
- translation boundaries for failures produced while executing an action.

## Inputs

Conceptual inputs include a specific approved action, validated parameters,
execution scope, authorization decision or grant established outside Tools, and
correlation or idempotency context. Inputs are not raw provider reasoning,
channel commands, ambient credentials, or an invitation for a Tool to decide
whether it should run.

## Outputs

Conceptual outputs include success, rejection due to invalid execution input,
partial or indeterminate execution, external references, and normalized failure
details suitable for orchestration and audit. A result reports execution; it
does not decide how Conversation should advance or what should be said.

## Ownership

Tools exclusively owns controlled execution and execution-result semantics for
approved external actions. Behavior owns whether an action is permitted, and
the Application Layer owns when to request execution. A Tool never authorizes
itself.

## Explicit exclusions

Tools does not own:

- whether an action is permitted or which authority applies;
- conversation policy, response posture, or escalation decisions;
- provider reasoning or response generation;
- authentication identity or the source of organizational authorization;
- application orchestration;
- Conversation lifecycle or persistence;
- secrets and credential ownership;
- channel commands or transport; or
- unrelated developer scripts and build tooling.

## Dependencies

Tools may depend on its own future contracts and narrowly shared primitives with
no more specific owner. Authorization decisions and approved action inputs are
supplied to it; Tools does not import Behavior or Application to obtain them.
The inward capability remains independent of vendor SDKs, external APIs,
credentials, channels, and persistence technologies.

## Future ports suggested by the boundary

This boundary suggests future inward ports for discovering available action
descriptions, validating an execution request, and executing an approved action.
Exact contracts are deferred. External-system clients and action adapters would
implement execution ports. Authentication and secret-resolution adapters may
support those implementations without transferring identity or authorization
ownership to Tools.

## Invariants

- Every execution corresponds to a specific, previously approved action.
- Tools never decide their own authorization.
- Execution inputs are validated before side effects begin.
- Authority and execution scope cannot be broadened by an adapter.
- Side-effect and idempotency semantics are explicit where relevant.
- Partial or indeterminate outcomes are not reported as success.
- Execution results preserve audit correlation without exposing secrets.
- Provider-specific function-call payloads do not become inward Tool contracts.

## Failure expectations

Tools reports validation failures, unavailable systems, denied or expired
execution grants, timeouts, partial effects, indeterminate outcomes, and
external errors explicitly in Tool vocabulary. Retrying a side effect requires
known idempotency semantics. Failure must not trigger unauthorized fallback
actions, be hidden as success, or cause the Tool to expand its own authority.

## Relationship to Conversation

Conversation may contain interaction state that leads the Application Layer to
consider an action, but Tools neither owns nor mutates the aggregate. Tool
execution and Conversation progress are separate consistency concerns. The
Application Layer coordinates any validated domain change after interpreting an
execution result.

## Relationship to the Application Layer

The Application Layer decides when an approved action is executed, supplies the
approved request, and coordinates its result with Behavior, Conversation, and
other use-case work. It handles workflow choices such as whether to retry,
escalate, persist, or request a response. It does not redefine Tool execution
facts.

## Relationship to Infrastructure

Infrastructure will implement future Tool ports with clients and adapters for
calendars, telephony, messaging, customer systems, and other external services.
It also supplies credentials through appropriate composition and security
boundaries. Adapters translate data and errors but may not decide authorization,
conceal side effects, or leak secrets and vendor types inward.

## Examples of what belongs inside the capability

- A provider-neutral action description and validated parameters.
- Execution status distinguishing success, partial effect, and unknown outcome.
- Idempotency requirements for creating an appointment.
- An audit correlation identifier and external record reference.
- Normalized execution failure semantics.

## Examples of what must remain outside the capability

- The decision that an employee may cancel an appointment.
- The authenticated human or employee identity system.
- Model reasoning that proposes using a Tool.
- The workflow deciding whether to execute, retry, or escalate.
- OAuth secrets and vendor SDK types as inward contracts.
- Conversation mutation, response generation, or channel delivery.
