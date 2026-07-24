import type { GeneratedResponse } from "../../response/contracts/index.js";

export function parseOpenAIResponse(response: unknown): GeneratedResponse {
  const text = responseText(response)?.trim();
  if (text === undefined || text.length === 0) {
    throw new Error("Response generation provider returned no response text.");
  }
  return { text };
}

function responseText(response: unknown): string | undefined {
  if (
    response === null ||
    typeof response !== "object" ||
    !("output" in response) ||
    !Array.isArray(response.output)
  ) {
    return undefined;
  }

  const textParts: string[] = [];
  const outputItems = response.output as readonly unknown[];
  for (const item of outputItems) {
    if (
      item === null ||
      typeof item !== "object" ||
      !("type" in item) ||
      item.type !== "message" ||
      !("content" in item) ||
      !Array.isArray(item.content)
    ) {
      continue;
    }
    const contentItems = item.content as readonly unknown[];
    for (const content of contentItems) {
      if (
        content !== null &&
        typeof content === "object" &&
        "type" in content &&
        content.type === "output_text" &&
        "text" in content &&
        typeof content.text === "string"
      ) {
        textParts.push(content.text);
      }
    }
  }
  return textParts.length === 0 ? undefined : textParts.join("");
}
