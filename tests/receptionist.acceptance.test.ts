import assert from "node:assert/strict";
import test from "node:test";

import { createConversationUseCases } from "../src/application/implementations/create-conversation-use-cases.js";
import { createEvaluateAction } from "../src/application/implementations/create-evaluate-action.js";
import { createProcessConversationTurn } from "../src/application/implementations/create-process-conversation-turn.js";
import {
  createReceptionistExperience,
  type ReceptionistExperienceApplication,
} from "../src/application/receptionist-experience.js";
import { DeterministicBehaviorEngine } from "../src/behavior/implementations/index.js";
import type { ConversationId, TurnId } from "../src/conversation/index.js";
import {
  FilesystemKnowledgeRetriever,
  InMemoryConversationStore,
} from "../src/infrastructure/index.js";
import type { IdGenerator } from "../src/ports/id-generator.js";
import type { ResponseGenerator } from "../src/ports/response-generator.js";
import type {
  GeneratedResponse,
  GenerationContext,
} from "../src/response/contracts/index.js";
import type { RetrievedKnowledgeUnit } from "../src/knowledge/index.js";
import { DeterministicGenerationContextBuilder } from "../src/response/implementations/index.js";

class AcceptanceGenerator implements ResponseGenerator<
  GenerationContext,
  GeneratedResponse
> {
  readonly contexts: GenerationContext[] = [];

  generate(context: GenerationContext): Promise<GeneratedResponse> {
    this.contexts.push(context);
    const messages = context.approvedContext.conversation.recentMessages;
    const latest = messages.at(-1)?.content.toLowerCase() ?? "";

    if (context.intent.type === "acknowledge") {
      return Promise.resolve({ text: "You’re welcome." });
    }
    if (context.intent.type === "escalate_handoff") {
      return Promise.resolve({
        text: "A human conversation is appropriate. I can help gather the details, but I haven’t initiated a handoff.",
      });
    }
    if (context.intent.type === "ask_clarifying_question") {
      const hasRoofingContext = messages.some((message) =>
        message.content.toLowerCase().includes("roofing"),
      );
      return Promise.resolve({
        text: hasRoofingContext
          ? "Which repetitive part of your roofing operation would you most like to improve?"
          : "Which part of your business would you most like to automate?",
      });
    }
    if (latest.includes("cost")) {
      return Promise.resolve({
        text: "I can’t verify pricing from the approved information. The Ovzaro team would need to discuss it with you.",
      });
    }
    if (latest.includes("salesforce")) {
      return Promise.resolve({
        text: "I can’t verify a Salesforce integration from the approved information.",
      });
    }
    if (latest.includes("weather")) {
      return Promise.resolve({
        text: "I can help with questions about Ovzaro, but I don’t have approved weather information.",
      });
    }
    return Promise.resolve({
      text: "Ovzaro builds Digital Employees that help businesses reduce repetitive operational work.",
    });
  }
}

function idGenerator<Identifier>(prefix: string): IdGenerator<Identifier> {
  let value = 0;
  return {
    generate: () =>
      Promise.resolve(`${prefix}-${String(++value)}` as Identifier),
  };
}

function createAcceptanceRuntime(): {
  readonly experience: ReturnType<typeof createReceptionistExperience>;
  readonly generator: AcceptanceGenerator;
} {
  const store = new InMemoryConversationStore();
  const turns = idGenerator<TurnId>("turn");
  const conversations = createConversationUseCases(
    store,
    idGenerator<ConversationId>("conversation"),
    turns,
  );
  const generator = new AcceptanceGenerator();
  const evaluateAction = createEvaluateAction(
    new DeterministicBehaviorEngine(),
    new FilesystemKnowledgeRetriever(),
    new DeterministicGenerationContextBuilder(),
    generator,
  );
  const processConversationTurn = createProcessConversationTurn(
    evaluateAction,
    store,
    turns,
  );
  const application: ReceptionistExperienceApplication = {
    ...conversations,
    processConversationTurn,
  };
  return {
    experience: createReceptionistExperience(application),
    generator,
  };
}

function knowledgeUnits(
  context: GenerationContext | undefined,
): readonly RetrievedKnowledgeUnit[] {
  const knowledge = context?.approvedContext.knowledge;
  return knowledge?.state === "retrieved" ? knowledge.units : [];
}

void test("A-H receptionist acceptance scenarios", async () => {
  const { experience, generator } = createAcceptanceRuntime();
  let conversation = await experience.start();

  const ask = async (message: string): Promise<string> => {
    const result = await experience.respond(conversation, message);
    conversation = result.conversation;
    return result.text;
  };

  assert.match(await ask("What does Ovzaro do?"), /Digital Employees/u);
  assert.ok(
    knowledgeUnits(generator.contexts.at(-1)).some(
      (unit) => unit.sourceDocumentPath === "company/about.md",
    ),
  );

  assert.equal(
    await ask("I need help automating my business."),
    "Which part of your business would you most like to automate?",
  );

  await ask("I own a roofing company.");
  assert.equal(
    await ask("Could Ovzaro help us?"),
    "Which repetitive part of your roofing operation would you most like to improve?",
  );

  assert.match(await ask("How much does it cost?"), /can’t verify pricing/u);
  assert.equal(
    knowledgeUnits(generator.contexts.at(-1)).some((unit) =>
      unit.content.toLowerCase().includes("salesforce"),
    ),
    false,
  );

  assert.match(
    await ask("Do you integrate with Salesforce?"),
    /can’t verify a Salesforce integration/u,
  );

  const handoff = await ask("I want to speak with someone.");
  assert.match(handoff, /human conversation is appropriate/u);
  assert.match(handoff, /haven’t initiated/u);

  assert.match(await ask("What is the weather?"), /questions about Ovzaro/u);
  assert.equal(await ask("Thanks"), "You’re welcome.");

  const messages = conversation.turns.flatMap((turn) => turn.messages);
  assert.ok(messages.some((message) => message.content.includes("roofing")));
  assert.ok(
    messages.some((message) =>
      message.content.includes("Which repetitive part"),
    ),
  );
  assert.equal(generator.contexts.at(-1)?.intent.type, "acknowledge");
});

void test("guidance is bounded by intent and preserves attribution", async () => {
  const { experience, generator } = createAcceptanceRuntime();
  const conversation = await experience.start();
  await experience.respond(conversation, "What does Ovzaro do?");

  const units = knowledgeUnits(generator.contexts.at(-1));
  const selectedHeadings = new Set([
    "Purpose",
    "Rule 4 — Use Only Approved Knowledge",
    "Communication Style",
  ]);
  const guidance = units.filter(
    (unit) =>
      unit.sourceDocumentPath.startsWith("employees/receptionist/") &&
      selectedHeadings.has(unit.heading),
  );
  assert.deepEqual(
    guidance.map((unit) => unit.sourceDocumentPath),
    [
      "employees/receptionist/role.md",
      "employees/receptionist/conversation-rules.md",
      "employees/receptionist/personality.md",
    ],
  );
  assert.ok(
    guidance.every((unit) =>
      unit.source.attribution.startsWith("ovzaro-knowledge/"),
    ),
  );
});
