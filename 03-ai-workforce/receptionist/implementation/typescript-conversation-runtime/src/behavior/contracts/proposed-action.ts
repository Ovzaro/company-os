/**
 * The closed set of receptionist actions that Behavior can evaluate in this
 * vertical slice.
 */
export type ProposedAction =
  | { readonly type: "respond" }
  | { readonly type: "ask_clarifying_question" }
  | { readonly type: "escalate" }
  | { readonly type: "execute_tool" };
