import type {
  BehaviorDecision,
  BehaviorRequest,
} from "../behavior/contracts/index.js";
import type {
  Conversation,
  Message,
  NonEmptyReadonlyArray,
} from "../conversation/index.js";

type DecisionWithOutcome<Outcome extends BehaviorDecision["outcome"]> = Extract<
  BehaviorDecision,
  { readonly outcome: Outcome }
>;

export type ProcessConversationTurnResult<GeneratedResponse> =
  | {
      readonly outcome: "prohibited";
      readonly behaviorDecision: DecisionWithOutcome<"prohibited">;
    }
  | {
      readonly outcome: "escalation_required";
      readonly behaviorDecision: DecisionWithOutcome<"escalation_required">;
    }
  | {
      readonly outcome: "permitted";
      readonly behaviorDecision: DecisionWithOutcome<"permitted">;
      readonly conversation: Conversation;
      readonly generatedResponse: GeneratedResponse;
    };

/**
 * Processes one behavior-gated conversational turn.
 *
 * Expected policy outcomes are returned as values. A prohibited or
 * escalation-required outcome leaves the supplied Conversation untouched and
 * performs neither generation nor persistence. A permitted outcome appends the
 * incoming messages as one Turn, persists the resulting aggregate, and returns
 * it alongside the generated response and Behavior decision.
 *
 * Generated language remains separate from Conversation-owned Message values.
 * A future response-to-message boundary can add generated messages when the
 * Response capability defines the metadata needed to form them.
 */
export type ProcessConversationTurn<GenerationContext, GeneratedResponse> = (
  conversation: Conversation,
  incomingMessages: NonEmptyReadonlyArray<Message>,
  behaviorRequest: BehaviorRequest,
  generationContext: GenerationContext,
) => Promise<ProcessConversationTurnResult<GeneratedResponse>>;
