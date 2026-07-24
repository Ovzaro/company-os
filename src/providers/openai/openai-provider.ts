import type { ResponseGenerator } from "../../ports/response-generator.js";
import type {
  GeneratedResponse,
  GenerationContext,
} from "../../response/contracts/index.js";
import { OpenAIClient } from "./openai-client.js";
import { buildOpenAIRequest } from "./openai-request-builder.js";
import { parseOpenAIResponse } from "./openai-response-parser.js";

class OpenAIProvider implements ResponseGenerator<
  GenerationContext,
  GeneratedResponse
> {
  constructor(
    private readonly client: OpenAIClient,
    private readonly model: string,
  ) {
    if (model.trim().length === 0) {
      throw new Error("The OpenAI model must not be empty.");
    }
  }

  async generate(context: GenerationContext): Promise<GeneratedResponse> {
    const request = buildOpenAIRequest(context, this.model);
    const response = await this.client.createResponse(request);
    return parseOpenAIResponse(response);
  }
}

export function createOpenAIProvider(
  apiKey: string,
  model: string,
): ResponseGenerator<GenerationContext, GeneratedResponse> {
  return new OpenAIProvider(new OpenAIClient(apiKey), model);
}
