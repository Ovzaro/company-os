import type { ResponseGenerator } from "../../ports/response-generator.js";

export const MOCK_RECEPTIONIST_RESPONSE =
  "Hello. I'm the Ovzaro Receptionist. How can I help you today?";

export class MockResponseGenerator implements ResponseGenerator<
  unknown,
  string
> {
  generate(request: unknown): Promise<string> {
    void request;
    return Promise.resolve(MOCK_RECEPTIONIST_RESPONSE);
  }
}
