import type {
  BehaviorConstraint,
  BehaviorReasonCode,
  BehaviorRuleId,
  EmployeeId,
  PolicyScopeId,
} from "../../behavior/contracts/index.js";
import type {
  ConversationId,
  ConversationStatus,
  MessageId,
  ParticipantId,
  ParticipantKind,
  Timestamp,
} from "../../conversation/index.js";

export interface ApprovedParticipant {
  readonly id: ParticipantId;
  readonly kind: ParticipantKind;
  readonly displayName?: string;
}

export interface ApprovedMessage {
  readonly id: MessageId;
  readonly authorId: ParticipantId;
  readonly content: string;
  readonly createdAt: Timestamp;
}

export interface ApprovedConversationContext {
  readonly id: ConversationId;
  readonly status: ConversationStatus;
  readonly participants: readonly ApprovedParticipant[];
  readonly recentMessages: readonly ApprovedMessage[];
  readonly startedAt: Timestamp;
  readonly closedAt?: Timestamp;
}

export interface ApprovedBehaviorContext {
  readonly employeeId: EmployeeId;
  readonly policyScopeId: PolicyScopeId;
  readonly ruleId: BehaviorRuleId;
  readonly reason: BehaviorReasonCode;
  readonly mandatoryConstraints: readonly BehaviorConstraint[];
}

export interface KnowledgeContribution {
  readonly state: "not_requested";
}

export interface MemoryContribution {
  readonly state: "not_requested";
}

/**
 * The complete information approved for use by Response Generation today.
 *
 * Knowledge and Memory absence is data, not an invitation for a generator to
 * infer, retrieve, or fabricate either contribution.
 */
export interface ApprovedContext {
  readonly conversation: ApprovedConversationContext;
  readonly behavior: ApprovedBehaviorContext;
  readonly knowledge: KnowledgeContribution;
  readonly memory: MemoryContribution;
}
