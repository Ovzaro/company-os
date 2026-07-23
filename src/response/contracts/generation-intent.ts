/**
 * The immediate, provider-neutral objective for one generated response.
 *
 * The closed union describes what Application is asking Response Generation
 * to accomplish without prescribing wording, prompts, models, or transports.
 */
export type GenerationIntent =
  | { readonly type: "answer" }
  | { readonly type: "ask_clarifying_question" }
  | { readonly type: "acknowledge" }
  | { readonly type: "escalate_handoff" };
