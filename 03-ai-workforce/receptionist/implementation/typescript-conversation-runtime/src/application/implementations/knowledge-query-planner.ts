import type { Conversation } from "../../conversation/index.js";

export function buildKnowledgeQuery(
  conversation: Conversation,
): string {
  const participants = new Map(
    conversation.participants.map((participant) => [
      participant.id,
      participant.kind,
    ]),
  );

  const lastHumanMessage = conversation.turns
    .flatMap((turn) => turn.messages)
    .reverse()
    .find(
      (message) => participants.get(message.authorId) === "human",
    );

  return lastHumanMessage?.content ?? "";
}