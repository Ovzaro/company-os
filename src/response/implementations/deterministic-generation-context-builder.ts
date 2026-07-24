import type { Message } from "../../conversation/index.js";
import type { GenerationContextBuilder } from "../../ports/generation-context-builder.js";
import type {
  GenerationContext,
  GenerationContextBuilderInput,
} from "../contracts/index.js";

/**
 * Temporary deterministic data-minimization policy.
 *
 * The builder includes at most the twelve most recent messages, preserving
 * their aggregate order. This is a count bound, not a provider token budget.
 */
export const RECENT_MESSAGE_LIMIT = 12;

export class DeterministicGenerationContextBuilder implements GenerationContextBuilder {
  build(input: GenerationContextBuilderInput): Promise<GenerationContext> {
    assertValidInput(input);

    const messages = input.conversation.turns.flatMap((turn) => turn.messages);
    const recentMessages = messages.slice(-RECENT_MESSAGE_LIMIT);

    return Promise.resolve({
      intent: input.intent,
      approvedContext: {
        conversation: {
          id: input.conversation.id,
          status: input.conversation.status,
          participants: input.conversation.participants.map((participant) => ({
            id: participant.id,
            kind: participant.kind,
            ...(participant.displayName === undefined
              ? {}
              : { displayName: participant.displayName }),
          })),
          recentMessages: recentMessages.map(projectMessage),
          startedAt: input.conversation.startedAt,
          ...(input.conversation.closedAt === undefined
            ? {}
            : { closedAt: input.conversation.closedAt }),
        },
        behavior: {
          employeeId: input.behaviorDecision.employeeId,
          policyScopeId: input.behaviorDecision.policyScopeId,
          ruleId: input.behaviorDecision.ruleId,
          reason: input.behaviorDecision.reason,
          mandatoryConstraints: input.behaviorDecision.mandatoryConstraints,
        },
        knowledge: {
          state: "retrieved",
          query: input.knowledge.query,
          documents: input.knowledge.documents,
        },
        memory: { state: "not_requested" },
      },
    });
  }
}

function projectMessage(message: Message): Message {
  return {
    id: message.id,
    authorId: message.authorId,
    content: message.content,
    createdAt: message.createdAt,
  };
}

function assertValidInput(
  input: unknown,
): asserts input is GenerationContextBuilderInput {
  if (!isObject(input)) {
    throw new TypeError("Generation context builder input is required.");
  }

  if (
    !("conversation" in input) ||
    !isObject(input.conversation) ||
    !hasString(input.conversation, "id") ||
    !hasString(input.conversation, "status") ||
    (Reflect.get(input.conversation, "status") !== "active" &&
      Reflect.get(input.conversation, "status") !== "closed") ||
    !hasString(input.conversation, "startedAt") ||
    ("closedAt" in input.conversation &&
      input.conversation.closedAt !== undefined &&
      typeof input.conversation.closedAt !== "string") ||
    !("participants" in input.conversation) ||
    !Array.isArray(input.conversation.participants) ||
    input.conversation.participants.length === 0 ||
    input.conversation.participants.some(
      (participant) =>
        !isObject(participant) ||
        !hasString(participant, "id") ||
        !hasString(participant, "kind") ||
        (Reflect.get(participant, "kind") !== "human" &&
          Reflect.get(participant, "kind") !== "digital-employee") ||
        ("displayName" in participant &&
          participant.displayName !== undefined &&
          typeof participant.displayName !== "string"),
    ) ||
    !("turns" in input.conversation) ||
    !Array.isArray(input.conversation.turns)
  ) {
    throw new TypeError("A well-formed Conversation is required.");
  }

  if (
    input.conversation.turns.some(
      (turn) =>
        !isObject(turn) ||
        !("messages" in turn) ||
        !Array.isArray(turn.messages) ||
        turn.messages.length === 0 ||
        turn.messages.some(
          (message) =>
            !isObject(message) ||
            !hasString(message, "id") ||
            !hasString(message, "authorId") ||
            !hasString(message, "content") ||
            !hasString(message, "createdAt"),
        ),
    )
  ) {
    throw new TypeError("Every Conversation turn must contain messages.");
  }

  if (
    !("behaviorDecision" in input) ||
    !isObject(input.behaviorDecision) ||
    !("outcome" in input.behaviorDecision) ||
    input.behaviorDecision.outcome !== "permitted" ||
    !hasString(input.behaviorDecision, "employeeId") ||
    !hasString(input.behaviorDecision, "policyScopeId") ||
    !hasString(input.behaviorDecision, "ruleId") ||
    !hasString(input.behaviorDecision, "reason") ||
    !("mandatoryConstraints" in input.behaviorDecision) ||
    !Array.isArray(input.behaviorDecision.mandatoryConstraints) ||
    input.behaviorDecision.mandatoryConstraints.some(
      (constraint) =>
        constraint !== "do_not_execute_tools" &&
        constraint !== "do_not_create_external_side_effects",
    )
  ) {
    throw new TypeError("A permitted Behavior decision is required.");
  }

  if (
    !("intent" in input) ||
    !isObject(input.intent) ||
    !("type" in input.intent) ||
    !isGenerationIntent(input.intent.type)
  ) {
    throw new TypeError("A supported Generation intent is required.");
  }

  if (
    !("knowledge" in input) ||
    !isObject(input.knowledge) ||
    !hasString(input.knowledge, "query") ||
    !("documents" in input.knowledge) ||
    !Array.isArray(input.knowledge.documents)
  ) {
    throw new TypeError("A Knowledge retrieval result is required.");
  }
}

function isObject(value: unknown): value is object {
  return value !== null && typeof value === "object";
}

function hasString(value: object, property: string): boolean {
  return property in value && typeof Reflect.get(value, property) === "string";
}

function isGenerationIntent(
  value: unknown,
): value is GenerationContextBuilderInput["intent"]["type"] {
  return (
    value === "answer" ||
    value === "ask_clarifying_question" ||
    value === "acknowledge" ||
    value === "escalate_handoff"
  );
}
