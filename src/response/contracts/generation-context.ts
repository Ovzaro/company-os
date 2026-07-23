import type { BehaviorDecision } from "../../behavior/contracts/index.js";
import type { Conversation } from "../../conversation/index.js";
import type { ApprovedContext } from "./approved-context.js";
import type { GenerationIntent } from "./generation-intent.js";

export type PermittedBehaviorDecision = Extract<
  BehaviorDecision,
  { readonly outcome: "permitted" }
>;

export interface GenerationContext {
  readonly intent: GenerationIntent;
  readonly approvedContext: ApprovedContext;
}

/**
 * The minimum capability-owned input required to assemble approved context.
 *
 * The Behavior decision is narrowed to permission at the type boundary.
 */
export interface GenerationContextBuilderInput {
  readonly conversation: Conversation;
  readonly behaviorDecision: PermittedBehaviorDecision;
  readonly intent: GenerationIntent;
}
