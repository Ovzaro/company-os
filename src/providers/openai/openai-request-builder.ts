import type { GenerationContext } from "../../response/contracts/index.js";
import type {
  OpenAIInputMessage,
  OpenAIResponseRequest,
} from "./openai-client.js";

const INTENT_INSTRUCTIONS = {
  answer: "Answer the user's request.",
  ask_clarifying_question: "Ask one concise clarifying question.",
  acknowledge: "Briefly acknowledge the user's message.",
  escalate_handoff: "Explain that a human handoff is required.",
} as const;

export function buildOpenAIRequest(
  context: GenerationContext,
  model: string,
): OpenAIResponseRequest {
  const { approvedContext } = context;
  const participantKinds = new Map(
    approvedContext.conversation.participants.map((participant) => [
      participant.id,
      participant.kind,
    ]),
  );

  const conversationMessages: readonly OpenAIInputMessage[] =
    approvedContext.conversation.recentMessages.map((message) => ({
      role:
        participantKinds.get(message.authorId) === "digital-employee"
          ? "assistant"
          : "user",
      content: message.content,
    }));

  return {
    model,
    instructions: buildInstructions(context),
    input:
      conversationMessages.length > 0
        ? conversationMessages
        : [{ role: "user", content: initialInput(context) }],
  };
}

function initialInput(context: GenerationContext): string {
  const { knowledge } = context.approvedContext;
  if (knowledge.state === "retrieved" && knowledge.query.trim().length > 0) {
    return knowledge.query;
  }
  return INTENT_INSTRUCTIONS[context.intent.type];
}

function buildInstructions(context: GenerationContext): string {
  const { approvedContext } = context;
  const constraints =
    approvedContext.behavior.mandatoryConstraints.length === 0
      ? "None."
      : approvedContext.behavior.mandatoryConstraints
          .map((constraint) => `- ${constraint}`)
          .join("\n");
  const knowledge = formatKnowledge(approvedContext.knowledge);

  return [
    "Generate an Ovzaro receptionist response using only the approved context below.",
    `Generation intent: ${INTENT_INSTRUCTIONS[context.intent.type]}`,
    "Mandatory behavior constraints:",
    constraints,
    "Approved knowledge:",
    knowledge,
    "Do not claim facts absent from the approved knowledge. If it is insufficient, say so.",
    "Do not execute tools or create external side effects.",
  ].join("\n\n");
}

function formatKnowledge(
  knowledge: GenerationContext["approvedContext"]["knowledge"],
): string {
  if (knowledge.state === "not_requested") {
    return "Knowledge was not requested.";
  }
  if (knowledge.units.length === 0) {
    return `No Knowledge Units were retrieved for: ${knowledge.query}`;
  }

  return [
    `Retrieval query: ${knowledge.query}`,
    ...knowledge.units.map((unit, index) =>
      [
        `[Knowledge Unit ${String(index + 1)}]`,
        `Heading: ${unit.headingPath.join(" > ")}`,
        `Attribution: ${unit.source.attribution}`,
        `Content: ${unit.content}`,
      ].join("\n"),
    ),
  ].join("\n\n");
}
