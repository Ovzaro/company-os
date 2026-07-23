# Composition Boundary

## Purpose

`composition/` defines the boundary at which the Receptionist application is
assembled. It names the inward dependencies and the transport-neutral
application surface produced by assembly.

## What Composition Owns

Composition owns the eventual selection and connection of concrete port
implementations, application use-case implementations, validated runtime
configuration, and outward runtime adapters. It will make those choices
explicit in one controlled location and expose the assembled application
surface to its callers.

Composition may translate validated bootstrap configuration into constructor or
factory arguments. It may also govern implementation lifetimes when those
implementations exist. These are assembly responsibilities, not capability
semantics.

## What Composition Does Not Own

Composition does not own:

- domain invariants or business rules;
- Application orchestration;
- capability request, result, or failure semantics;
- port definitions;
- infrastructure implementation details;
- API, HTTP, channel, transport, or serialization contracts;
- provider SDK types;
- ambient dependency lookup; or
- global mutable state.

It must not redefine a capability model merely to make wiring convenient.

## Dependency Direction

Dependencies continue to point inward:

```text
API and channel adapters  --->  ReceptionistApplication
                                      |
Composition selects and connects ----+
        |                             |
        v                             v
Infrastructure implementations ---> Ports <--- Application
```

Composition is the outermost assembly boundary. It may import inward contracts
and, in the future, concrete outward implementations. Domain, Application, and
Ports must never depend on Composition.

## Relationship to Application

Application owns use-case orchestration and decides when capabilities
participate. `ReceptionistApplication` only groups the existing Application
use-case contracts into one explicit surface. It does not implement, wrap,
sequence, or reinterpret them.

The composition root constructs use-case implementations with their required
ports. `createMockReceptionistApplication` connects the deterministic Behavior
engine, deterministic Generation Context Builder, and mock Response Generator
to `createEvaluateAction`; the Application implementation, not Composition,
remains responsible for their sequencing and context assembly.
That same `EvaluateAction`, the in-memory `ConversationStore`, and a shared turn
identifier generator are passed to `createProcessConversationTurn`.
Composition only assembles these dependencies; the new Application
implementation owns evaluation, update, and persistence order.

## Relationship to Ports

Ports define the inward contracts that implementations must satisfy.
`ReceptionistDependencies` makes every required port explicit and preserves
each port's capability ownership.

Generic parameters stand for capability-owned request and result contracts that
do not yet exist. Composition does not fill those gaps with its own DTOs,
provider models, or broad `unknown` placeholders. `Clock` and `IdGenerator`
remain owner-neutral; consuming capabilities retain the meaning of their
instant and identifier types.

## Relationship to Infrastructure

Infrastructure will supply concrete port implementations. Once they exist,
Composition will select instances and pass them explicitly to Application
factories or constructors. Infrastructure must translate vendors, storage
technologies, and operational failures at the port boundary.

There are no infrastructure implementations in this sprint, and the dependency
contract must not be mistaken for one.

## Relationship to API and Channels

API and channel adapters are outward callers of the assembled application.
They may receive a `ReceptionistApplication` and translate transport input into
Application-owned inputs. They must not be imported into the inward application
or dependency contracts.

HTTP routing, authentication, delivery acknowledgements, channel identity,
payload validation, and serialization remain outside Composition's stable
contracts. Runtime bootstrap may connect such adapters only after the inward
application has been assembled.

## Composition Is Not a Service Locator

`ReceptionistDependencies` is a static, explicit construction contract. It has
named, typed members and is supplied at assembly time. It provides no registry,
string keys, lookup function, hidden default, singleton, or mutable global
container.

Application code should receive only the dependencies it needs through explicit
constructor or factory parameters. It must not reach back into Composition to
discover dependencies at runtime.

## Vendor Selection

Provider and technology selection belongs at the future composition root
because it is an outer-layer runtime choice. It belongs there only after
implementations exist and can be selected against inward ports. A vendor name,
SDK client, environment variable, or configuration schema is not an
architecture and must not enter these contracts.

This sprint cannot honestly select providers: no concrete implementations
exist. Pretending to wire them would hide missing work and weaken the port
boundaries.

## Future Assembly Flow

A future runtime bootstrap may:

1. load and validate external configuration outside the stable contracts;
2. construct concrete infrastructure adapters;
3. construct Application use-case implementations with explicit required
   ports;
4. assemble those use cases into a `ReceptionistApplication`;
5. give that application object to API or channel adapters; and
6. start the selected runtime adapter.

Steps 1, 2, 3, 5, and 6 are future runtime work. The contracts in this directory
only describe the dependency input and assembled application output.

## Testing Strategy

Composition contract tests should use typed fakes or stubs for every port and
use case. Future assembly tests should verify that:

- each selected implementation satisfies its port;
- every use case receives its explicit dependencies;
- the returned object exposes every application contract;
- configuration failures stop assembly;
- no outward adapter is started before assembly succeeds; and
- implementation lifetimes are deliberate and isolated between tests.

Application orchestration belongs in Application tests. Port conformance belongs
in infrastructure adapter tests. Domain behavior belongs in domain tests.
Transport translation belongs in API or channel adapter tests.

## Failure Expectations

Contract declarations perform no work and therefore produce no runtime
failures. Future composition must fail explicitly during bootstrap when
configuration is invalid, a dependency cannot be constructed, or an assembly
invariant is unmet. It must not silently substitute a provider, fabricate a
dependency, weaken a capability failure, or start a partially assembled
application.

Operational failures after assembly continue to follow the relevant Application
and port contracts. Composition must not catch and reinterpret them as business
outcomes.

## Valid Future Wiring

Examples of valid future wiring include:

- constructing a `ConversationStore` adapter and passing it to conversation
  use-case factories;
- selecting one `KnowledgeRetriever` implementation from validated bootstrap
  configuration and exposing it only through its inward port;
- providing `Clock<Timestamp>` and `IdGenerator<ConversationId>` explicitly to
  the use cases that require them;
- assembling implemented use cases into a `ReceptionistApplication`; and
- passing that application object to an HTTP or channel adapter at runtime.

## Concerns That Must Remain Outside

The following do not belong in the stable composition contracts:

- HTTP request or response objects, routes, middleware, and status codes;
- channel payloads, delivery state, webhooks, and session handling;
- database clients, query shapes, migrations, and serialization formats;
- model SDKs, prompts, provider responses, and provider-specific errors;
- environment-variable reads and configuration-file loading;
- capability DTOs invented by Composition;
- authorization, behavior policy, memory retention, and knowledge ranking
  rules;
- service registries, dependency lookup by string, and global containers; and
- runtime startup, shutdown, retries, scheduling, or telemetry behavior.
