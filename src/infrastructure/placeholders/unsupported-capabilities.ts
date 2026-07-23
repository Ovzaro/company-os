import type { BehaviorEngine } from "../../ports/behavior-engine.js";
import type { KnowledgeRetriever } from "../../ports/knowledge-retriever.js";
import type { MemoryStore } from "../../ports/memory-store.js";
import type { ToolExecutor } from "../../ports/tool-executor.js";

const unsupported = (capability: string): Promise<never> =>
  Promise.reject(
    new Error(`${capability} is not implemented in this vertical slice.`),
  );

export class UnsupportedBehaviorEngine implements BehaviorEngine<never, never> {
  evaluate(request: never): Promise<never> {
    void request;
    return unsupported("Behavior");
  }
}

export class UnsupportedKnowledgeRetriever implements KnowledgeRetriever<
  never,
  never
> {
  retrieve(request: never): Promise<never> {
    void request;
    return unsupported("Knowledge");
  }
}

export class UnsupportedMemoryStore implements MemoryStore<
  never,
  never,
  never,
  never,
  never,
  never
> {
  recall(request: never): Promise<never> {
    void request;
    return unsupported("Memory");
  }

  record(request: never): Promise<never> {
    void request;
    return unsupported("Memory");
  }

  applyLifecycle(request: never): Promise<never> {
    void request;
    return unsupported("Memory");
  }
}

export class UnsupportedToolExecutor implements ToolExecutor<never, never> {
  execute(request: never): Promise<never> {
    void request;
    return unsupported("Tools");
  }
}
