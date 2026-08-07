import type { ResponseGenerator } from "../../ports/response-generator.js";
import type { GenerateResponse } from "../generate-response.js";

export function createGenerateResponse<GenerationContext, GeneratedResponse>(
  responseGenerator: ResponseGenerator<GenerationContext, GeneratedResponse>,
): GenerateResponse<GenerationContext, GeneratedResponse> {
  return async (_conversation, context): Promise<GeneratedResponse> =>
    responseGenerator.generate(context);
}
