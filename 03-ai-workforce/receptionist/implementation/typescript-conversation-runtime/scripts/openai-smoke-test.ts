import type {
  EmployeeId,
  PolicyScopeId,
} from "../src/behavior/contracts/index.js";
import { createReceptionistApplication } from "../src/composition/index.js";
import type {
  MessageId,
  ParticipantId,
  Timestamp,
} from "../src/conversation/index.js";

const question = "What does Ovzaro build?";
const humanId = "smoke-human" as ParticipantId;
const application = createReceptionistApplication();
const conversation = await application.startConversation(
  [{ id: humanId, kind: "human", displayName: "Smoke Test" }],
  new Date().toISOString() as Timestamp,
);
const result = await application.processConversationTurn(
  conversation,
  [
    {
      id: "smoke-message" as MessageId,
      authorId: humanId,
      content: question,
      createdAt: new Date().toISOString() as Timestamp,
    },
  ],
  {
    employeeId: "ovzaro-receptionist" as EmployeeId,
    policyScopeId: "public-information" as PolicyScopeId,
    proposedAction: { type: "respond" },
    externalSideEffects: "none",
    priorAuthorization: "absent",
    supportedScope: "supported",
    escalation: "not_required",
  },
  { type: "answer" },
);

if (result.outcome !== "permitted") {
  throw new Error(`Smoke test was not permitted: ${result.outcome}`);
}

console.log(result.generatedResponse.text);
