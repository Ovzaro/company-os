# Ports

## Purpose

`ports/` contains the inward interfaces through which Application coordinates
capabilities and shared platform services. A port states what an application
workflow may ask for while leaving all implementation choices outside the
boundary.

Ports contain contracts only. They contain no implementation, provider,
adapter, transport, persistence technology, serialization shape, framework
integration, or composition mechanism.

## Dependency direction

Dependencies point outward from Application to Ports and from Infrastructure to
Ports:

```text
Application
    |
    v
  Ports
    ^
    |
Infrastructure
```

Application depends on port interfaces. Infrastructure implements those
interfaces. Ports never import Infrastructure, and Infrastructure details never
become port inputs, outputs, or failures.

## Relationship to Application

Application owns use-case orchestration: it decides when to load a conversation,
recall memory, retrieve knowledge, evaluate behavior, generate a response, or
execute an approved tool action. Ports expose those capability operations
without prescribing their order or providing runtime wiring.

The generic parameters on capability ports are placeholders for contracts owned
by that same capability. They preserve the generic boundaries already present
in Application and avoid creating application DTOs in this directory.

## Relationship to capability boundaries

Every capability port has exactly one owner:

| Port                 | Owner               |
| -------------------- | ------------------- |
| `ConversationStore`  | Conversation        |
| `MemoryStore`        | Memory              |
| `KnowledgeRetriever` | Knowledge           |
| `BehaviorEngine`     | Behavior            |
| `ResponseGenerator`  | Response Generation |
| `ToolExecutor`       | Tools               |

`Clock` and `IdGenerator` are shared platform service ports because time
observation and identifier allocation have no more specific capability owner.
They do not define the meaning of any capability-owned timestamp or identifier.

A port must not call another capability, reinterpret another capability's
result, or expand its own ownership. Application supplies any cross-capability
context explicitly and coordinates the results.

## Relationship to Infrastructure

Infrastructure supplies implementations at a future composition boundary. An
implementation may use an external service or persistence technology, but it
must translate technology-specific inputs, outputs, and failures into the
inward contract. No vendor type or infrastructure concern may cross a port.

## Examples

- A conversation persistence adapter may implement `ConversationStore`; the
  port itself does not select or describe a database.
- An Application workflow may pass a Knowledge-owned request to
  `KnowledgeRetriever` and later pass approved evidence to
  `ResponseGenerator`; neither port invokes the other.
- A tool adapter may implement `ToolExecutor`, but it may execute only the
  approved request supplied by Application and cannot grant authorization.
- Application may use `Clock<Timestamp>` or
  `IdGenerator<ConversationId>` while the shared ports remain independent of
  Conversation's meaning and invariants.
