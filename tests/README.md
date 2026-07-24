# Tests

## Why this directory exists

`tests/` contains cross-module, integration, contract, architecture, and end-to-end tests that verify the system from outside a single source module.

## What belongs here

Test suites, fixtures, fakes, contract harnesses, and test-only support code with clear scope belong here.

## What does not belong here

Production code, live credentials, mutable shared environments, and tests that depend on undocumented external state do not belong here.

## Knowledge Unit and Generation Context Test Plan

No test framework or test script is currently configured. When test support is
introduced, focused unit and orchestration tests must verify that:

- one non-empty unit is produced for each heading section;
- H1-through-H6 nesting produces the expected heading paths;
- parent content excludes all descendant section content;
- repeated headings have unique deterministic IDs and preserve order;
- pre-heading content is preserved as a `Document Prelude` unit;
- a no-heading document becomes a prelude unit;
- empty sections are omitted while meaningful ancestor paths are retained;
- parser inputs and their nested metadata arrays are not mutated;
- only approved documents enter the filesystem index;
- ranking uses unit fields and returns the most relevant section;
- equal scores break ties by source path and unit order;
- each result preserves source attribution, heading path, unit ID, and score;
- requested result limits are validated and enforced;
- prohibited and escalation-required evaluations never invoke context
  assembly or response generation;
- a permitted evaluation invokes the builder before the generator;
- Behavior rule, reason, identities, and mandatory constraints are preserved
  exactly;
- retrieved Knowledge Units reach approved context unchanged and Memory remains
  explicitly `not_requested`;
- at most twelve recent messages are projected in aggregate order;
- the mock generator returns its fixed greeting through the built context;
- the builder rejects malformed programming inputs; and
- building context does not mutate Conversation, Behavior decision, or intent
  inputs.
