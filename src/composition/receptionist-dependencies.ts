import type { BehaviorEngine } from "../ports/behavior-engine.js";
import type { Clock } from "../ports/clock.js";
import type { ConversationStore } from "../ports/conversation-store.js";
import type { GenerationContextBuilder } from "../ports/generation-context-builder.js";
import type { IdGenerator } from "../ports/id-generator.js";
import type { KnowledgeRetriever } from "../ports/knowledge-retriever.js";
import type { MemoryStore } from "../ports/memory-store.js";
import type { ResponseGenerator } from "../ports/response-generator.js";
import type { ToolExecutor } from "../ports/tool-executor.js";

/**
 * The complete inward dependency boundary for a future Receptionist
 * application assembly.
 *
 * Generic parameters remain owned by their named capabilities. This container
 * groups port contracts only; it neither creates nor locates implementations.
 */
export interface ReceptionistDependencies<
  MemoryRecallRequest,
  MemoryRecallResult,
  MemoryRecordRequest,
  MemoryRecordResult,
  MemoryLifecycleRequest,
  MemoryLifecycleResult,
  KnowledgeRequest,
  KnowledgeResult,
  BehaviorRequest,
  BehaviorDecision,
  GenerationRequest,
  GenerationResult,
  ToolExecutionRequest,
  ToolExecutionResult,
  Instant,
  Identifier,
> {
  readonly conversationStore: ConversationStore;
  readonly memoryStore: MemoryStore<
    MemoryRecallRequest,
    MemoryRecallResult,
    MemoryRecordRequest,
    MemoryRecordResult,
    MemoryLifecycleRequest,
    MemoryLifecycleResult
  >;
  readonly knowledgeRetriever: KnowledgeRetriever<
    KnowledgeRequest,
    KnowledgeResult
  >;
  readonly behaviorEngine: BehaviorEngine<BehaviorRequest, BehaviorDecision>;
  readonly generationContextBuilder: GenerationContextBuilder;
  readonly responseGenerator: ResponseGenerator<
    GenerationRequest,
    GenerationResult
  >;
  readonly toolExecutor: ToolExecutor<
    ToolExecutionRequest,
    ToolExecutionResult
  >;
  readonly clock: Clock<Instant>;
  readonly idGenerator: IdGenerator<Identifier>;
}
