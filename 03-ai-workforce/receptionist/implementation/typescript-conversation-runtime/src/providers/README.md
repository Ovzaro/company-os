# Response Generation

## Directory naming

`providers/` is the current home for Response Generation capability
documentation because this directory already exists. The directory name does
not make external providers the owners of the capability. No directory is
renamed during this sprint.

## Purpose

Response Generation is the inward capability that converts approved
conversation context, grounded evidence, relevant memory, and Behavior
constraints into a proposed response result. It defines generation meaning
independently of any external model provider.

External model providers are outward implementations. They implement
generation-related ports but do not define this capability, its contracts, or
its semantics. The first implementation lives in `openai/`.

## Responsibilities

Response Generation owns:

- the meaning of a generation request and proposed response result;
- assembling only the approved inputs supplied for generation;
- honoring Behavior constraints and grounded-evidence boundaries;
- representing response text or other future approved response forms;
- generation-specific limitations, uncertainty, and failure semantics; and
- provider-neutral quality and result metadata when such metadata is part of
  the capability contract.

## Inputs

Conceptual inputs include approved conversational context, grounded Knowledge
evidence with provenance, relevant recalled Memory, applicable Behavior
constraints and response posture, and requested response characteristics.
Inputs are bounded, deliberate context—not unrestricted access to capability
stores, provider-specific messages, or transport payloads.

## Outputs

Conceptual outputs include a proposed response result, explicit inability to
generate safely or faithfully, and provider-neutral generation limitations or
metadata. A proposed response is not delivery, a Conversation mutation, a
Behavior decision, or proof that a factual claim is true.

## Ownership

Response Generation exclusively owns converting approved inputs into a proposed
response result. It does not own the authority, truth, retention, orchestration,
or delivery of those inputs and results. External providers perform generation
behind future inward contracts; they do not own capability policy.

## Explicit exclusions

Response Generation does not own:

- Behavior policy, authorization, escalation, or permitted actions;
- Knowledge truth, evidence retrieval, provenance creation, or ranking;
- durable Memory or recall decisions;
- live Conversation lifecycle or persistence;
- application orchestration;
- response delivery, channels, or transport;
- provider-selection policy or composition;
- vendor SDK types, credentials, retry clients, or model configuration; or
- Tool authorization or execution.

## Dependencies

Response Generation may depend on its own future contracts and narrowly shared
primitives with no more specific owner. Approved evidence, memory, conversation
context, and constraints arrive through a Response Generation-owned request;
the capability does not import or invoke other capabilities directly. It
remains independent of model vendors, transports, persistence, and composition.
Behavior constraints are authoritative over generation.

## Port implemented at the boundary

`ResponseGenerator` is the inward port for generating a proposed response from
approved inputs. External model providers, local models, or deterministic
generators may implement it as outward adapters. Provider selection belongs at
Composition, not inside the capability.

## Invariants

- Every generation request contains only context approved by the orchestrating
  use case and applicable policies.
- Behavior constraints are mandatory and cannot be relaxed by a provider.
- Claims requiring grounding remain traceable to supplied evidence.
- Absence of Knowledge never becomes invented Knowledge.
- Recalled Memory is not promoted to authoritative evidence merely through
  generation.
- Provider-specific types and prompt formats do not cross the inward boundary.
- A generated result remains a proposal until the Application Layer accepts and
  coordinates it.
- Generation does not execute Tools, persist Conversation, or deliver output.

## Failure expectations

Response Generation must explicitly report inability to satisfy constraints,
insufficient grounding, unsafe or malformed results, provider unavailability,
and other generation failures in capability vocabulary. It must prefer no
proposal or a constrained proposal over fabricated knowledge or policy
violation. Provider errors are translated at the boundary and must not leak
vendor-shaped failures inward.

## Relationship to Conversation

Conversation is the aggregate for bounded interaction state. Response
Generation may receive an approved representation of relevant interaction
context and return a proposed response, but it neither reads nor mutates the
aggregate directly. The Application Layer and future domain operations remain
responsible for validating any resulting conversational progress.

## Relationship to the Application Layer

The Application Layer decides when generation occurs, obtains and approves its
inputs, invokes the future Response Generation port, and decides how a valid
proposal participates in the use case. It also coordinates persistence and
delivery. It must enforce Behavior outcomes and preserve Knowledge and Memory
semantics rather than asking generation to invent them.

## Relationship to Infrastructure

Infrastructure will contain outward generation implementations and vendor
integrations. Adapters will translate capability-owned requests into model
prompts or SDK calls and translate results and failures back into inward
vocabulary. Infrastructure selects and configures providers at composition; no
provider may redefine Behavior, Knowledge, Memory, or Response Generation
contracts.

## Examples of what belongs inside the capability

- A provider-neutral request containing approved evidence and constraints.
- A proposed response result with grounding and limitation metadata.
- Rules requiring the result to remain within supplied Behavior constraints.
- An explicit insufficient-grounding outcome.
- Provider-neutral generation failure semantics.

## Examples of what must remain outside the capability

- The policy deciding whether a caller may receive an answer.
- Retrieval of a company policy or durable recall of a preference.
- OpenAI, Anthropic, or local-model SDK code and vendor message types.
- Provider selection, credentials, retries, and composition configuration.
- Saving a generated message to Conversation.
- Formatting and delivering a response to Slack, web chat, or another channel.
