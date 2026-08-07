import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";

import type { ReceptionistExperience } from "../../application/receptionist-experience.js";
import type { Conversation } from "../../conversation/index.js";

const MAX_REQUEST_BODY_BYTES = 1_000_000;

interface ChatRequest {
  readonly conversationId: string;
  readonly message: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function createReceptionistHttpServer(
  experience: ReceptionistExperience,
): Server {
  const conversations = new Map<string, Conversation>();
  const pendingTurns = new Map<string, Promise<void>>();

  return createServer((request, response) => {
    void handleRequest().catch((error: unknown) => {
      console.error("Unable to handle HTTP request.", error);
      writeJson(response, 500, { error: "Internal server error." });
    });

    async function handleRequest(): Promise<void> {
      if (request.method === "OPTIONS") {
        response.writeHead(204, CORS_HEADERS);
        response.end();
        return;
      }

      if (request.method === "GET" && request.url === "/health") {
        writeJson(response, 200, { status: "ok" });
        return;
      }

      if (request.method === "POST" && request.url === "/chat") {
        let chatRequest: ChatRequest;

        try {
          chatRequest = parseChatRequest(await readRequestBody(request));
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Invalid request body.";

          writeJson(response, 400, { error: message });
          return;
        }

        const previousTurn =
          pendingTurns.get(chatRequest.conversationId) ?? Promise.resolve();

        let responseText = "";

        const currentTurn = previousTurn
          .catch(() => undefined)
          .then(async () => {
            const conversation =
              conversations.get(chatRequest.conversationId) ??
              (await experience.start());

            const result = await experience.respond(
              conversation,
              chatRequest.message,
            );

            conversations.set(chatRequest.conversationId, result.conversation);
            responseText = result.text;
          });

        pendingTurns.set(chatRequest.conversationId, currentTurn);

        try {
          await currentTurn;
        } finally {
          if (pendingTurns.get(chatRequest.conversationId) === currentTurn) {
            pendingTurns.delete(chatRequest.conversationId);
          }
        }

        writeJson(response, 200, { message: responseText });
        return;
      }

      writeJson(response, 404, { error: "Not found." });
    }
  });
}

function readRequestBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let length = 0;

    request.on("data", (chunk: Buffer) => {
      length += chunk.length;

      if (length > MAX_REQUEST_BODY_BYTES) {
        reject(new Error("Request body is too large."));
        request.destroy();
        return;
      }

      chunks.push(chunk);
    });

    request.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", reject);
  });
}

function parseChatRequest(body: string): ChatRequest {
  let value: unknown;

  try {
    value = JSON.parse(body);
  } catch {
    throw new Error("Request body must be valid JSON.");
  }

  if (
    typeof value !== "object" ||
    value === null ||
    !("conversationId" in value) ||
    typeof value.conversationId !== "string" ||
    value.conversationId.trim() === "" ||
    !("message" in value) ||
    typeof value.message !== "string" ||
    value.message.trim() === ""
  ) {
    throw new Error("conversationId and message must be non-empty strings.");
  }

  return {
    conversationId: value.conversationId,
    message: value.message,
  };
}

function writeJson(
  response: ServerResponse,
  statusCode: number,
  body: Readonly<Record<string, string>>,
): void {
  if (response.headersSent) return;

  response.writeHead(statusCode, {
    "content-type": "application/json",
    ...CORS_HEADERS,
  });

  response.end(JSON.stringify(body));
}