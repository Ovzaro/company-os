# Roadmap

The roadmap prioritizes stable boundaries before integrations. Dates and vendors are intentionally excluded at this stage.

## Phase 0 — Foundation

- Establish repository structure and ownership boundaries.
- Define formatting, linting, and strict typechecking.
- Record architectural principles and explicit non-goals.

## Phase 1 — Core contracts

- Define the interaction lifecycle and core domain language.
- Define application ports for behavior, conversation, memory, knowledge, tools, and providers.
- Establish error, identity, tenant, correlation, and cancellation semantics.
- Add architecture and contract tests where static boundaries need enforcement.

## Phase 2 — Runtime composition

- Select a minimal backend runtime and composition strategy.
- Add validated configuration and graceful lifecycle management.
- Introduce structured telemetry contracts and operational health signals.
- Define the first versioned, channel-neutral API.

## Phase 3 — Replaceable adapters

- Add one provider adapter behind a repository-owned interface.
- Add independent conversation, memory, and knowledge implementations.
- Add a safe tool execution boundary with authorization and audit semantics.
- Validate replacement through contract suites, not implementation-specific tests.

## Phase 4 — Channel clients

- Connect a website client through the shared service API.
- Add channel adapters incrementally without changing application behavior.
- Verify identity mapping, delivery guarantees, retries, ordering, and presentation constraints per channel.

## Phase 5 — Platform scale

- Support distinct digital employee profiles and policies across Ovzaro functions.
- Harden multi-tenancy, privacy, retention, security, resilience, and cost controls.
- Add evaluation, audit, and operational feedback loops.
- Evolve contracts through documented, backward-compatible decisions.

## Current non-goals

- API routes or deployed runtime behavior
- Provider or model selection
- Channel integrations
- Database or persistence selection
- Business workflows
- Prompt design
