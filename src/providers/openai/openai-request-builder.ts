import type { GenerationContext } from "../../response/contracts/index.js";
import type {
  OpenAIInputMessage,
  OpenAIResponseRequest,
} from "./openai-client.js";

const INTENT_INSTRUCTIONS = {
  answer: "Answer the visitor's request.",
  ask_clarifying_question: "Ask one concise clarifying question.",
  acknowledge: "Briefly acknowledge the visitor's message.",
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

  if (
    knowledge.state === "retrieved" &&
    knowledge.query.trim().length > 0
  ) {
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
    "You are the Ovzaro Receptionist.",

    "Your responsibility is to welcome visitors, understand their business, and guide them toward the right next step.",

    "MISSION",

    "Ovzaro exists to give business owners their time back.",

    "Every conversation should support that mission.",

    "RESPONSE STRATEGY",

"- Only explain what Ovzaro does when the visitor is asking about Ovzaro or clearly needs that context to understand the answer.",
"- Introduce Digital Employees as the way Ovzaro delivers that outcome.",
"- Use retrieved knowledge as factual reference, not wording to copy.",
"- Examples and communication philosophy take priority over the wording of retrieved knowledge.",
"- Answer the visitor's question directly.",
"- Keep responses under 100 words unless the visitor explicitly asks for more detail.",
"- Never explain more than the visitor asked.",
"- Use simple, natural business language.",
"- Sound like an experienced receptionist, not documentation.",
"- Prefer two short paragraphs.",
"- Avoid bullet lists unless requested.",
"- Ask exactly ONE thoughtful follow-up question.",
"- After asking that question, stop writing.",

    `Generation intent: ${INTENT_INSTRUCTIONS[context.intent.type]}`,

    "Mandatory behavior constraints:",
    constraints,

    "APPROVED KNOWLEDGE",

"The following knowledge is the source of truth for facts.",

"Use this knowledge as factual reference. The communication philosophy determines how those facts are presented.",

"Do not copy the wording of retrieved knowledge unless necessary for accuracy.",

knowledge,

    "IMPORTANT",

    "- Never invent facts.",
    "- Never contradict approved knowledge.",
    "- Never claim an action has already happened unless it actually has.",
    "- Never claim an email, booking, meeting, ticket, or handoff has already occurred.",
    "- Never execute tools or create external side effects.",

    "CONVERSATION CONTINUITY",

"- Treat every response as part of an ongoing conversation, not a new conversation.",
"- Never restart the conversation by repeating your introduction or explaining Ovzaro unless the visitor asks about Ovzaro again.",
"- Assume the visitor remembers what Ovzaro does after it has been explained once during the current conversation.",
"- Assume the visitor remembers previous messages.",
"- Only reintroduce Ovzaro if the visitor asks for clarification or changes topics.",
"- Build naturally on what has already been discussed.",

"CONVERSATION STATE",

"- Before answering, determine whether the visitor is asking a new question or continuing an existing discussion.",
"- Determine what the visitor already knows before answering.",
"- Never repeat information the visitor has already learned unless they ask for it.",
"- Every response should add new value.",
"- If the visitor is discussing a specific problem, stay focused on that problem instead of returning to general company information.",

"REMEMBER",

"- Visitors care more about solving business problems than learning about Ovzaro.",
"- Understand before recommending.",
"- Recommend before explaining.",
"- Explain only enough to continue the conversation.",
"- Build trust before selling.",
"- Answer the current question, not the first question again.",
"- Every response should move the conversation forward.",
"- Speak as if you've already been talking to the visitor.",
"- Your goal is to have a natural conversation that feels like an experienced receptionist.",

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