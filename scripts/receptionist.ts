import { createInterface } from "node:readline/promises";

import {
  createReceptionistApplication,
  createReceptionistExperience,
} from "../src/composition/index.js";
import type { GenerationContext } from "../src/response/contracts/index.js";
import {
  formatRetrievedKnowledge,
  retrievalDebugEnabled,
} from "./retrieval-debug.js";

async function main(): Promise<void> {
  const debugRetrieval = retrievalDebugEnabled(
    process.argv.slice(2),
    process.env,
  );
  let generationContext: GenerationContext | undefined;
  let application;
  try {
    application = createReceptionistApplication(
      process.env,
      debugRetrieval
        ? {
            onGenerationContext: (context) => {
              generationContext = context;
            },
          }
        : {},
    );
  } catch (error) {
    reportConfigurationError(error);
    process.exitCode = 1;
    return;
  }

  const experience = createReceptionistExperience(application);
  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const state = { interrupted: false };
  terminal.on("SIGINT", () => {
    state.interrupted = true;
    terminal.close();
  });

  console.log('Ovzaro Receptionist\nType "exit" to end the conversation.\n');
  console.log(`Receptionist:\n${experience.greeting}\n`);

  try {
    let conversation = await experience.start();
    while (!state.interrupted) {
      let input: string;
      try {
        input = (await terminal.question("You:\n")).trim();
      } catch (error) {
        void error;
        break;
      }
      if (input === "") continue;
      if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
        break;
      }

      try {
        const response = await experience.respond(conversation, input);
        conversation = response.conversation;
        if (debugRetrieval && generationContext !== undefined) {
          console.log(`\n${formatRetrievedKnowledge(generationContext)}\n`);
        }
        console.log(`\nReceptionist:\n${response.text}\n`);
      } catch (error) {
        reportRuntimeError(error);
        console.log(
          "\nReceptionist:\nI’m sorry, I’m unable to respond right now. Please try again.\n",
        );
      }
    }
  } finally {
    terminal.close();
  }
}

function reportConfigurationError(error: unknown): void {
  const message = error instanceof Error ? error.message : "";
  if (
    message === "OPENAI_API_KEY is required." ||
    message === "OPENAI_MODEL is required."
  ) {
    console.error(
      `Configuration error: ${message} Add it to your local .env file or environment.`,
    );
    return;
  }
  console.error("Unable to configure the receptionist.");
}

function reportRuntimeError(error: unknown): void {
  const message = error instanceof Error ? error.message : "Unknown error";
  if (message.includes("transport failed")) {
    console.error("OpenAI transport failure.");
  } else if (
    message.includes("no response text") ||
    message.includes("invalid JSON")
  ) {
    console.error("OpenAI returned a malformed response.");
  } else {
    console.error("Unexpected receptionist runtime failure.");
  }
}

await main();
