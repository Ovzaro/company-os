import type { GenerationContext } from "../src/response/contracts/index.js";

const BOUNDARY = "=".repeat(49);
const SEPARATOR = "-".repeat(49);

export function retrievalDebugEnabled(
  arguments_: readonly string[],
  environment: NodeJS.ProcessEnv,
): boolean {
  return (
    arguments_.includes("--debug") || environment.DEBUG_RETRIEVAL === "true"
  );
}

export function formatRetrievedKnowledge(context: GenerationContext): string {
  const knowledge = context.approvedContext.knowledge;
  const units = knowledge.state === "retrieved" ? knowledge.units : [];

  if (units.length === 0) {
    return `${BOUNDARY}\nRetrieved Knowledge\n${BOUNDARY}\n\nNo Knowledge Retrieved\n\n${BOUNDARY}`;
  }

  const entries = units.map((unit, index) => {
    const score = unit.score === 0 ? "0 (Guidance)" : String(unit.score);
    return `${String(index + 1)}.\nSource:\n${unit.source.attribution}\n\nHeading:\n${unit.heading}\n\nScore:\n${score}\n\n${SEPARATOR}`;
  });

  return `${BOUNDARY}\nRetrieved Knowledge\n${BOUNDARY}\n\n${entries.join("\n\n")}\n\n${BOUNDARY}`;
}
