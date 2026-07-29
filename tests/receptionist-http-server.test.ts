import assert from "node:assert/strict";
import test from "node:test";

import type { ReceptionistExperience } from "../src/application/receptionist-experience.js";
import type { Conversation } from "../src/conversation/index.js";
import { createReceptionistHttpServer } from "../src/channels/http/receptionist-http-server.js";

function conversation(turnCount: number): Conversation {
  return {
    id: "internal-conversation" as Conversation["id"],
    status: "active",
    participants: [
      {
        id: "visitor" as Conversation["participants"][number]["id"],
        kind: "human",
        displayName: "Visitor",
      },
    ],
    turns: Array.from({ length: turnCount }, (_, index) => ({
      id: `turn-${String(index + 1)}` as Conversation["turns"][number]["id"],
      sequence: index + 1,
      messages: [
        {
          id: `message-${String(index + 1)}` as Conversation["turns"][number]["messages"][number]["id"],
          authorId: "visitor" as Conversation["participants"][number]["id"],
          content: "message",
          createdAt: new Date().toISOString() as Conversation["startedAt"],
        },
      ],
    })),
    startedAt: new Date().toISOString() as Conversation["startedAt"],
  };
}

void test("HTTP adapter exposes health and preserves conversation continuity", async () => {
  const seenTurnCounts: number[] = [];
  const experience: ReceptionistExperience = {
    greeting: "Hello",
    start: () => Promise.resolve(conversation(0)),
    respond: (current) => {
      seenTurnCounts.push(current.turns.length);
      return Promise.resolve({
        conversation: conversation(current.turns.length + 1),
        text: `response-${String(current.turns.length + 1)}`,
      });
    },
  };
  const server = createReceptionistHttpServer(experience);
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address !== null && typeof address !== "string");
  const baseUrl = `http://127.0.0.1:${String(address.port)}`;

  try {
    const health = await fetch(`${baseUrl}/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: "ok" });

    for (const expected of ["response-1", "response-2"]) {
      const response = await fetch(`${baseUrl}/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          conversationId: "browser-conversation",
          message: "Hello",
        }),
      });
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { message: expected });
    }

    assert.deepEqual(seenTurnCounts, [0, 1]);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error !== undefined) reject(error);
        else resolve();
      });
    });
  }
});

void test("HTTP adapter rejects invalid chat requests", async () => {
  const experience: ReceptionistExperience = {
    greeting: "Hello",
    start: () => Promise.resolve(conversation(0)),
    respond: () => {
      throw new Error("respond should not be called");
    },
  };
  const server = createReceptionistHttpServer(experience);
  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address !== null && typeof address !== "string");

  try {
    const response = await fetch(
      `http://127.0.0.1:${String(address.port)}/chat`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ conversationId: "", message: "Hello" }),
      },
    );
    assert.equal(response.status, 400);
  } finally {
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  }
});
