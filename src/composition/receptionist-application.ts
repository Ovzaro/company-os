import type { ContinueConversation } from "../application/continue-conversation.js";
import type { EndConversation } from "../application/end-conversation.js";
import type { EvaluateAction } from "../application/evaluate-action.js";
import type { RecallMemory } from "../application/recall-memory.js";
import type { RetrieveKnowledge } from "../application/retrieve-knowledge.js";
import type { StartConversation } from "../application/start-conversation.js";

/**
 * The transport-neutral surface of an assembled Receptionist application.
 *
 * Each member is an existing Application-owned use-case contract. This
 * contract describes the resulting application object without implementing,
 * adapting, or invoking any use case.
 */
export interface ReceptionistApplication<
  MemoryRequest,
  MemoryResult,
  KnowledgeRequest,
  KnowledgeResult,
  GenerationContext,
  GeneratedResponse,
> {
  readonly startConversation: StartConversation;
  readonly continueConversation: ContinueConversation;
  readonly endConversation: EndConversation;
  readonly recallMemory: RecallMemory<MemoryRequest, MemoryResult>;
  readonly retrieveKnowledge: RetrieveKnowledge<
    KnowledgeRequest,
    KnowledgeResult
  >;
  readonly evaluateAction: EvaluateAction<GenerationContext, GeneratedResponse>;
}
