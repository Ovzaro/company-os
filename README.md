# Ovzaro Receptionist

Ovzaro Receptionist is the reusable conversational operating system for Ovzaro digital employees. It provides the architectural center for receiving interactions, coordinating behavior, managing conversational state, and integrating replaceable capabilities. It is not a chatbot, a channel bot, or a wrapper around a model provider.

## Mission

Build a durable, channel-agnostic backend foundation that lets every Ovzaro digital employee communicate consistently across websites, messaging platforms, and future interfaces. The service should preserve Ovzaro behavior and operational boundaries while allowing channels, providers, memory stores, knowledge systems, and tools to evolve independently.

## Architecture philosophy

The architecture is organized around stable responsibilities and explicit boundaries:

- Channels adapt external transports into a shared application contract. Channel-specific behavior stays in `src/channels/`.
- Application workflows coordinate domain capabilities without depending on transport or vendor details.
- Providers are replaceable adapters behind Ovzaro-owned abstractions.
- Conversations represent interaction state; memory represents durable recall. Neither owns the other.
- Knowledge retrieval is independent of both model providers and storage implementations.
- Behavior is expressed as policy and decision logic, not hidden inside provider prompts.
- Dependencies point toward abstractions. Infrastructure details remain at the edges.

These constraints favor clarity, testability, and long-term replaceability over early convenience. See [docs/architecture.md](docs/architecture.md) for dependency rules and component boundaries.

## Repository structure

```text
docs/                 Architecture, API, and roadmap documentation
scripts/              Repeatable development and operational automation
src/
  api/                Transport-neutral API boundary contracts
  application/        Use-case orchestration
  behavior/           Employee behavior policies and decisions
  channels/           Channel adapters and channel-specific concerns
  config/             Validated runtime configuration
  conversation/       Conversation lifecycle and transient state
  knowledge/          Knowledge retrieval abstractions
  memory/             Durable memory abstractions and policies
  middleware/         Cross-cutting request and interaction processing
  models/             Core domain models and value objects
  providers/          Replaceable external capability adapters
  services/           Cohesive domain and application services
  telemetry/          Observability contracts and instrumentation
  tools/              Capabilities digital employees may invoke
  types/              Shared TypeScript types with clear ownership
tests/                 Automated tests and test support
```

Every directory contains a local README defining what belongs there and, just as importantly, what does not.

## Development

Prerequisites: Node.js 22 or newer and npm 10 or newer.

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
```

Use `npm run format` to apply repository formatting.

The production composition requires both `OPENAI_API_KEY` and `OPENAI_MODEL`;
there is no default model. With the sibling `ovzaro-knowledge` repository
available, run `npm run smoke:openai` to exercise Behavior, Knowledge retrieval,
Generation Context assembly, and real response generation through the OpenAI
Responses API end to end.

## Future roadmap

The project will evolve in deliberate layers:

1. Define core contracts and domain language without selecting vendors.
2. Establish the interaction lifecycle, behavior policies, and conversation boundaries.
3. Add replaceable memory, knowledge, provider, and tool adapters.
4. Expose a versioned service API and connect the first channel adapter.
5. Harden observability, security, resilience, evaluation, and operational tooling.
6. Generalize employee profiles for Sales, Marketing, HR, Support, Payroll, and future roles.

The detailed sequencing and non-goals are maintained in [docs/roadmap.md](docs/roadmap.md).

## Place in the Ovzaro platform

This service is the conversational core used by Ovzaro digital employees. Websites, Telegram, Slack, Discord, customer-owned sites, and future clients connect through channel adapters; they do not define employee behavior. Other platform services may supply identity, organizational data, permissions, knowledge, or tools, while this service coordinates a consistent interaction lifecycle through stable contracts.

The company-wide principles governing this repository belong in `CONSTITUTION.md`. Architectural decisions must remain consistent with that constitution.
