import { createConversationUseCases } from "../application/implementations/create-conversation-use-cases.js";
import { createGenerateResponse } from "../application/implementations/create-generate-response.js";
import type { ConversationId, TurnId } from "../conversation/index.js";
import {
  InMemoryConversationStore,
  MockResponseGenerator,
} from "../infrastructure/index.js";
import {
  UnsupportedBehaviorEngine,
  UnsupportedKnowledgeRetriever,
  UnsupportedMemoryStore,
  UnsupportedToolExecutor,
} from "../infrastructure/placeholders/unsupported-capabilities.js";
import type { IdGenerator } from "../ports/id-generator.js";
import type { ReceptionistApplication } from "./receptionist-application.js";

export type MockReceptionistApplication = ReceptionistApplication<
  never,
  never,
  never,
  never,
  unknown,
  string
>;

function createIdGenerator<Identifier>(
  prefix: string,
): IdGenerator<Identifier> {
  let nextId = 1;

  return {
    generate: (): Promise<Identifier> => {
      const identifier = `${prefix}-${String(nextId)}` as Identifier;
      nextId += 1;
      return Promise.resolve(identifier);
    },
  };
}

export function createMockReceptionistApplication(): MockReceptionistApplication {
  const conversationStore = new InMemoryConversationStore();
  const responseGenerator = new MockResponseGenerator();
  const behaviorEngine = new UnsupportedBehaviorEngine();
  const knowledgeRetriever = new UnsupportedKnowledgeRetriever();
  const memoryStore = new UnsupportedMemoryStore();
  const toolExecutor = new UnsupportedToolExecutor();

  // These instances make the intentionally unsupported edges explicit at the
  // composition root without introducing successful no-op capability behavior.
  void behaviorEngine;
  void toolExecutor;

  const conversationUseCases = createConversationUseCases(
    conversationStore,
    createIdGenerator<ConversationId>("conversation"),
    createIdGenerator<TurnId>("turn"),
  );

  return {
    ...conversationUseCases,
    recallMemory: (request) => memoryStore.recall(request),
    retrieveKnowledge: (request) => knowledgeRetriever.retrieve(request),
    generateResponse: createGenerateResponse(responseGenerator),
  };
}
