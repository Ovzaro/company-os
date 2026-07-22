/** Identifies one conversation within the conversation bounded context. */
export type ConversationId = string & { readonly __brand: "ConversationId" };

/** Identifies one participant within a conversation. */
export type ParticipantId = string & { readonly __brand: "ParticipantId" };

/** Identifies one message within a conversation. */
export type MessageId = string & { readonly __brand: "MessageId" };

/** Identifies one turn within a conversation. */
export type TurnId = string & { readonly __brand: "TurnId" };

/** A UTC instant serialized in ISO 8601 format. */
export type Timestamp = string & { readonly __brand: "Timestamp" };

/** A readonly collection known by the domain to contain at least one item. */
export type NonEmptyReadonlyArray<T> = readonly [T, ...T[]];
