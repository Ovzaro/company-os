import type {
  KnowledgeMetadataValue,
  KnowledgeSourceDocument,
  KnowledgeUnit,
} from "../contracts.js";

const PRELUDE_HEADING = "Document Prelude";

interface HeadingEntry {
  readonly level: number;
  readonly text: string;
}

interface Section {
  readonly order: number;
  readonly heading: string;
  readonly headingPath: readonly string[];
  readonly lines: readonly string[];
}

/**
 * Splits a parsed Markdown source document into non-empty, attributable units.
 *
 * Frontmatter is excluded by the caller. Each heading owns only the body up to
 * the next heading, so parent units never duplicate descendant content.
 */
export function parseMarkdownKnowledgeUnits(
  document: KnowledgeSourceDocument,
): readonly KnowledgeUnit[] {
  const lines = normalizeNewlines(document.body).split("\n");
  const sections: Section[] = [];
  const headingStack: HeadingEntry[] = [];
  let current: Section = {
    order: 0,
    heading: PRELUDE_HEADING,
    headingPath: [],
    lines: [],
  };
  let headingOrder = 0;

  for (const line of lines) {
    const match = /^(#{1,6})[ \t]+(.+?)[ \t]*#*[ \t]*$/u.exec(line);
    if (match === null) {
      current = { ...current, lines: [...current.lines, line] };
      continue;
    }

    sections.push(current);
    const level = match[1]?.length ?? 1;
    const heading = match[2]?.trim() ?? "";
    while (
      headingStack.length > 0 &&
      (headingStack.at(-1)?.level ?? 0) >= level
    ) {
      headingStack.pop();
    }
    headingStack.push({ level, text: heading });
    headingOrder += 1;
    current = {
      order: headingOrder,
      heading,
      headingPath: headingStack.map((entry) => entry.text),
      lines: [],
    };
  }
  sections.push(current);

  return sections.flatMap((section) => {
    const content = section.lines.join("\n").trim();
    if (content.length === 0) return [];
    return [
      createUnit(
        document,
        section.order,
        section.heading,
        section.headingPath,
        content,
      ),
    ];
  });
}

function createUnit(
  document: KnowledgeSourceDocument,
  order: number,
  heading: string,
  headingPath: readonly string[],
  content: string,
): KnowledgeUnit {
  return {
    id: `${document.path}#unit-${String(order).padStart(4, "0")}-${slug(heading)}`,
    sourceDocumentPath: document.path,
    sourceDocumentTitle: document.title,
    heading,
    headingPath: [...headingPath],
    content,
    tags: [...document.tags],
    metadata: cloneMetadata(document.metadata),
    source: { ...document.source },
    order,
  };
}

function cloneMetadata(
  metadata: Readonly<Record<string, KnowledgeMetadataValue>>,
): Readonly<Record<string, KnowledgeMetadataValue>> {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [
      key,
      typeof value === "string" ? value : [...value],
    ]),
  );
}

function normalizeNewlines(value: string): string {
  return value.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
}

function slug(value: string): string {
  const normalized = value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/gu, "");
  return normalized.length > 0 ? normalized : "section";
}
