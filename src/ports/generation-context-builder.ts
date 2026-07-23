import type {
  GenerationContext,
  GenerationContextBuilderInput,
} from "../response/contracts/index.js";

/**
 * Response Generation's inward boundary for deterministic context assembly.
 *
 * Implementations assemble only supplied, approved inputs. They do not
 * evaluate policy, retrieve Knowledge, recall Memory, generate language,
 * execute tools, mutate Conversation, or consult runtime configuration.
 */
export interface GenerationContextBuilder {
  build(input: GenerationContextBuilderInput): Promise<GenerationContext>;
}
