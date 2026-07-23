import { createConversationUseCases } from "../application/implementations/create-conversation-use-cases.js";
import { createEvaluateAction } from "../application/implementations/create-evaluate-action.js";
import { createProcessConversationTurn } from "../application/implementations/create-process-conversation-turn.js";
import { DeterministicBehaviorEngine } from "../behavior/implementations/index.js";
import type { ConversationId, TurnId } from "../conversation/index.js";
import {
  InMemoryConversationStore,
  MockResponseGenerator,
} from "../infrastructure/index.js";
import {
  UnsupportedKnowledgeRetriever,
  UnsupportedMemoryStore,
  UnsupportedToolExecutor,
} from "../infrastructure/placeholders/unsupported-capabilities.js";
import type { IdGenerator } from "../ports/id-generator.js";
import { DeterministicGenerationContextBuilder } from "../response/implementations/index.js";
import type { ReceptionistApplication } from "./receptionist-application.js";

export type MockReceptionistApplication = ReceptionistApplication<
  never,
  never,
  never,
  never,
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
  const generationContextBuilder = new DeterministicGenerationContextBuilder();
  const behaviorEngine = new DeterministicBehaviorEngine();
  const knowledgeRetriever = new UnsupportedKnowledgeRetriever();
  const memoryStore = new UnsupportedMemoryStore();
  const toolExecutor = new UnsupportedToolExecutor();
  const turnIdGenerator = createIdGenerator<TurnId>("turn");

  // Tools remain an intentionally unsupported edge in this vertical slice.
  void toolExecutor;

  const conversationUseCases = createConversationUseCases(
    conversationStore,
    createIdGenerator<ConversationId>("conversation"),
    turnIdGenerator,
  );
  const evaluateAction = createEvaluateAction(
    behaviorEngine,
    generationContextBuilder,
    responseGenerator,
  );
  const processConversationTurn = createProcessConversationTurn(
    evaluateAction,
    conversationStore,
    turnIdGenerator,
  );

  return {
    ...conversationUseCases,
    recallMemory: (request) => memoryStore.recall(request),
    retrieveKnowledge: (request) => knowledgeRetriever.retrieve(request),
    evaluateAction,
    processConversationTurn,
  };
}
