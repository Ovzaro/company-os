import { createConversationUseCases } from "../application/implementations/create-conversation-use-cases.js";
import { createEvaluateAction } from "../application/implementations/create-evaluate-action.js";
import { createProcessConversationTurn } from "../application/implementations/create-process-conversation-turn.js";
import { DeterministicBehaviorEngine } from "../behavior/implementations/index.js";
import type { ConversationId, TurnId } from "../conversation/index.js";
import {
  FilesystemKnowledgeRetriever,
  InMemoryConversationStore,
} from "../infrastructure/index.js";
import {
  UnsupportedMemoryStore,
  UnsupportedToolExecutor,
} from "../infrastructure/placeholders/unsupported-capabilities.js";
import type { KnowledgeRequest, KnowledgeResult } from "../knowledge/index.js";
import type { IdGenerator } from "../ports/id-generator.js";
import { createOpenAIProvider } from "../providers/openai/index.js";
import type { GeneratedResponse } from "../response/contracts/index.js";
import { DeterministicGenerationContextBuilder } from "../response/implementations/index.js";
import type { ReceptionistApplication } from "./receptionist-application.js";

export type OpenAIReceptionistApplication = ReceptionistApplication<
  never,
  never,
  KnowledgeRequest,
  KnowledgeResult,
  GeneratedResponse
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

export function createReceptionistApplication(
  environment: NodeJS.ProcessEnv = process.env,
): OpenAIReceptionistApplication {
  const apiKey = requiredEnvironmentVariable(environment, "OPENAI_API_KEY");
  const model = requiredEnvironmentVariable(environment, "OPENAI_MODEL");
  const conversationStore = new InMemoryConversationStore();
  const responseGenerator = createOpenAIProvider(apiKey, model);
  const generationContextBuilder = new DeterministicGenerationContextBuilder();
  const behaviorEngine = new DeterministicBehaviorEngine();
  const knowledgeRetriever = new FilesystemKnowledgeRetriever();
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
    knowledgeRetriever,
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

function requiredEnvironmentVariable(
  environment: NodeJS.ProcessEnv,
  name: string,
): string {
  const value = environment[name]?.trim();
  if (value === undefined || value.length === 0) {
    throw new Error(`${name} is required.`);
  }
  return value;
}
