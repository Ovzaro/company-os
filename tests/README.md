# Tests

## Why this directory exists

`tests/` contains cross-module, integration, contract, architecture, and end-to-end tests that verify the system from outside a single source module.

## What belongs here

Test suites, fixtures, fakes, contract harnesses, and test-only support code with clear scope belong here.

## What does not belong here

Production code, live credentials, mutable shared environments, and tests that depend on undocumented external state do not belong here.

## Generation Context Builder Test Plan

No test framework or test script is currently configured. When test support is
introduced, focused unit and orchestration tests must verify that:

- prohibited and escalation-required evaluations never invoke context
  assembly or response generation;
- a permitted evaluation invokes the builder before the generator;
- Behavior rule, reason, identities, and mandatory constraints are preserved
  exactly;
- Knowledge and Memory contributions are explicitly `not_requested`;
- at most twelve recent messages are projected in aggregate order;
- the mock generator returns its fixed greeting through the built context;
- the builder rejects malformed programming inputs; and
- building context does not mutate Conversation, Behavior decision, or intent
  inputs.
