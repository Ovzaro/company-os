import assert from "node:assert/strict";
import test from "node:test";

import {
  formatRetrievedKnowledge,
  retrievalDebugEnabled,
} from "../scripts/retrieval-debug.js";
import type { RetrievedKnowledgeUnit } from "../src/knowledge/index.js";
import type { GenerationContext } from "../src/response/contracts/index.js";

function contextWith(
  units: readonly RetrievedKnowledgeUnit[],
): GenerationContext {
  return {
    intent: { type: "answer" },
    approvedContext: {
      conversation: {
        id: "conversation-1",
        status: "active",
        participants: [],
        recentMessages: [],
        startedAt: "2026-01-01T00:00:00.000Z",
      },
      behavior: {
        employeeId: "receptionist",
        policyScopeId: "public",
        ruleId: "allow",
        reason: "within_scope",
        mandatoryConstraints: [],
      },
      knowledge: { state: "retrieved", query: "mission", units },
      memory: { state: "not_requested" },
    },
  } as unknown as GenerationContext;
}

const unit: RetrievedKnowledgeUnit = {
  id: "mission",
  sourceDocumentPath: "company/mission.md",
  sourceDocumentTitle: "Mission",
  heading: "Mission Statement",
  headingPath: ["Mission Statement"],
  content: "Mission content",
  tags: [],
  metadata: {},
  source: {
    repository: "ovzaro-knowledge",
    path: "company/mission.md",
    attribution: "ovzaro-knowledge/company/mission.md",
  },
  order: 1,
  score: 4,
};

void test("retrieval debug mode is enabled only by its explicit controls", () => {
  assert.equal(retrievalDebugEnabled([], {}), false);
  assert.equal(retrievalDebugEnabled(["--debug"], {}), true);
  assert.equal(retrievalDebugEnabled([], { DEBUG_RETRIEVAL: "true" }), true);
  assert.equal(retrievalDebugEnabled([], { DEBUG_RETRIEVAL: "TRUE" }), false);
  assert.equal(
    retrievalDebugEnabled(["--other"], { DEBUG_RETRIEVAL: "false" }),
    false,
  );
});

void test("formats retrieved units using GenerationContext data", () => {
  const output = formatRetrievedKnowledge(
    contextWith([unit, { ...unit, id: "guidance", score: 0 }]),
  );

  assert.match(output, /Retrieved Knowledge/u);
  assert.match(output, /ovzaro-knowledge\/company\/mission\.md/u);
  assert.match(output, /Mission Statement/u);
  assert.match(output, /Score:\n4/u);
  assert.match(output, /Score:\n0 \(Guidance\)/u);
});

void test("reports when no knowledge was retrieved", () => {
  assert.match(
    formatRetrievedKnowledge(contextWith([])),
    /No Knowledge Retrieved/u,
  );
});
