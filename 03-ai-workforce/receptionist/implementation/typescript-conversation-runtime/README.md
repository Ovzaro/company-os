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

## Local terminal receptionist

The production composition requires both `OPENAI_API_KEY` and `OPENAI_MODEL`;
there is no default model. Create a local environment file and start one
interactive, in-memory conversation:

```bash
cp .env.example .env
# Add local credentials without committing the file.
npm run receptionist
```

Node loads `.env` directly when it exists. The file is ignored by Git, and the
runtime never prints the API key. Type `exit` or `quit`, or press Ctrl+C, to end
the conversation.

The terminal script is only a local channel. Every message still follows
Behavior → Knowledge Retrieval → Generation Context → ResponseGenerator →
OpenAI Responses API. It does not call OpenAI directly. Conversation state,
including visitor and receptionist messages, lasts only for the process.

Run deterministic acceptance checks without OpenAI credentials:

```bash
npm test
```

With credentials configured, `npm run smoke:openai` performs a real single-turn
check through the same core capabilities. Connecting this runtime to
ovzaro.com is the next milestone.

## Local HTTP service

With `OPENAI_API_KEY` and `OPENAI_MODEL` configured in `.env`, start the HTTP
adapter on port 4000:

```bash
npm run server
```

Check its health:

```bash
curl http://localhost:4000/health
```

Send a message with a client-generated conversation ID:

```bash
curl -X POST http://localhost:4000/chat \
  -H 'Content-Type: application/json' \
  -d '{"conversationId":"local-demo","message":"What does Ovzaro do?"}'
```

Reuse the same `conversationId` in later requests to continue that
conversation. The service stores conversation state in memory, so it is reset
when the process restarts. Press Ctrl+C to stop the server gracefully.

### Receptionist guidance retrieval

Factual Knowledge Units remain ranked from the visitor’s current wording.
Application also labels the immediate response objective with a small
Knowledge-owned receptionist guidance profile. Retrieval appends only the
approved role and conduct sections needed for that objective—for example,
grounding rules for answers, one-question rules for clarification, or
escalation language for handoffs. These units retain their source attribution
and do not consume or reorder the factual result limit. The runtime does not
retrieve every receptionist document for every message.

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
