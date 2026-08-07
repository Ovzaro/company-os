const RESPONSES_URL = "https://api.openai.com/v1/responses";

export interface OpenAIInputMessage {
  readonly role: "user" | "assistant";
  readonly content: string;
}

export interface OpenAIResponseRequest {
  readonly model: string;
  readonly instructions: string;
  readonly input: readonly OpenAIInputMessage[];
}

export class OpenAIClient {
  constructor(
    private readonly apiKey: string,
    private readonly fetchImplementation: typeof fetch = fetch,
  ) {
    if (apiKey.trim().length === 0) {
      throw new Error("OPENAI_API_KEY must not be empty.");
    }
  }

  async createResponse(request: OpenAIResponseRequest): Promise<unknown> {
    let response: Response;
    try {
      response = await this.fetchImplementation(RESPONSES_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
    } catch (cause) {
      throw new Error("Response generation provider transport failed.", {
        cause,
      });
    }

    if (!response.ok) {
      throw new Error(
        `Response generation provider request failed with status ${String(response.status)}.`,
      );
    }

    try {
      return await response.json();
    } catch (cause) {
      throw new Error("Response generation provider returned invalid JSON.", {
        cause,
      });
    }
  }
}
