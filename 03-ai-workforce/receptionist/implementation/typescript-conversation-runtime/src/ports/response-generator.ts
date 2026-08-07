/**
 * Purpose:
 * Provide the inward boundary for converting approved context and constraints
 * into a proposed response.
 *
 * Ownership and capability mapping:
 * Owned exclusively by Response Generation. `GenerationRequest` and
 * `GenerationResult` are Response Generation-owned contracts, not model,
 * prompt, transport, or provider representations.
 *
 * Responsibilities:
 * Generate a provider-neutral proposal from only the approved inputs supplied
 * by Application while honoring Behavior and grounding constraints.
 *
 * Inputs:
 * `generate` receives a Response Generation-owned request containing deliberate
 * approved context, evidence, memory, constraints, and response
 * characteristics.
 *
 * Outputs:
 * `generate` resolves to a Response Generation-owned result representing a
 * proposal, limitations, uncertainty, or explicit inability to generate.
 *
 * Failure expectations:
 * Insufficient grounding, unsafe or malformed output, and inability to satisfy
 * constraints remain explicit capability outcomes. Operational failure rejects
 * the promise and vendor-shaped failures must not leak inward.
 *
 * Invariants:
 * Behavior constraints are mandatory, grounded claims remain traceable,
 * remembered context is not promoted to evidence, and a result remains a
 * proposal until Application coordinates it.
 *
 * Explicit exclusions:
 * Behavior decisions, evidence retrieval, Memory recall, Conversation
 * mutation, tool execution, delivery, provider selection, model configuration,
 * prompts, and application orchestration are excluded.
 *
 * Dependency direction:
 * Application depends on this interface; Infrastructure implements it. The
 * interface never depends on Infrastructure or invokes another capability.
 */
export interface ResponseGenerator<GenerationRequest, GenerationResult> {
  generate(request: GenerationRequest): Promise<GenerationResult>;
}
