# Deterministic Behavior Engine

`DeterministicBehaviorEngine` is the first executable Behavior implementation.
It evaluates an explicit request without I/O, models, prompts, providers,
retrieval, memory, Conversation mutation, response prose, or tool execution.

## Rule precedence

Rules are evaluated in this order:

1. An explicit human-escalation requirement returns `escalation_required`.
2. Unsupported scope returns `escalation_required`.
3. Any ambiguous policy signal returns `prohibited`.
4. A side-effecting action without explicit prior authorization is prohibited.
5. Tool execution without explicit prior authorization is prohibited.
6. A supported action with unambiguous context is permitted, with mandatory
   constraints when it is declared non-side-effecting.

The first matching rule wins. Explicit escalation therefore cannot be weakened
by an otherwise authorized action. Ambiguity fails closed, and there is no
silent fallback from a negative outcome to permission.

## Decisions and failures

Permission, prohibition, and escalation are ordinary policy decisions and are
returned as data with stable rule and reason codes. Thrown or rejected errors
are reserved for genuine programming or operational failures; the current
pure implementation has no expected operational failure mode.

Behavior does not generate prose because wording belongs to Response
Generation, which must remain subordinate to the returned constraints. Tools
perform approved execution and cannot infer authority from their availability.
Composition selects this implementation but neither invokes it nor makes its
policy decisions; Application must eventually orchestrate evaluation.

## Extension and auditability

Future rules can add typed Behavior-owned signals, actions, constraints, and
reason codes. They must preserve explicit precedence, exhaustively typed
outcomes, provider independence, and stable identifiers suitable for recording
which rule decided an action. External policy storage may supply typed inputs
but cannot redefine these semantics.

## Test plan

This repository has no configured executable test framework or `test` script,
so this sprint does not add automated tests or modify `package.json`. When the
repository adopts a test runner, add focused unit cases that assert:

- a supported, non-side-effecting `respond` action is permitted with
  non-side-effect constraints;
- a side-effecting action without authorization is prohibited by
  `behavior.side_effect_authorization`;
- an authorized, supported tool action is permitted;
- unsupported scope requires escalation;
- explicit escalation wins even when authorization is present; and
- ambiguous authorization fails closed as prohibited.

Each case should compare the complete decision, including outcome, rule ID,
reason code, and mandatory constraints where present.
