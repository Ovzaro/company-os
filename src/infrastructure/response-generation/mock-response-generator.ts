import type { ResponseGenerator } from "../../ports/response-generator.js";
import type { GenerationContext } from "../../response/contracts/index.js";

export const MOCK_RECEPTIONIST_RESPONSE =
  "Hello. I'm the Ovzaro Receptionist. How can I help you today?";

export class MockResponseGenerator implements ResponseGenerator<
  GenerationContext,
  string
> {
  generate(request: GenerationContext): Promise<string> {
    void request;
    return Promise.resolve(MOCK_RECEPTIONIST_RESPONSE);
  }
}
