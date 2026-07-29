import { readdir, readFile } from "node:fs/promises";
import { basename, relative, resolve, sep } from "node:path";

import type {
  KnowledgeMetadataValue,
  KnowledgeRequest,
  KnowledgeResult,
  ReceptionistGuidanceProfile,
  KnowledgeSourceDocument,
  KnowledgeUnit,
  RetrievedKnowledgeUnit,
} from "../../knowledge/index.js";
import { parseMarkdownKnowledgeUnits } from "../../knowledge/index.js";
import type { KnowledgeRetriever } from "../../ports/knowledge-retriever.js";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;
const REPOSITORY = "ovzaro-knowledge";

interface GuidanceSelector {
  readonly path: string;
  readonly heading: string;
}

const GUIDANCE_UNITS: Readonly<
  Record<ReceptionistGuidanceProfile, readonly GuidanceSelector[]>
> = {
  answer: [
    { path: "employees/receptionist/role.md", heading: "Purpose" },
    {
      path: "employees/receptionist/conversation-rules.md",
      heading: "Rule 4 — Use Only Approved Knowledge",
    },
    {
      path: "employees/receptionist/personality.md",
      heading: "Communication Style",
    },
  ],
  clarify: [
    { path: "employees/receptionist/role.md", heading: "Purpose" },
    {
      path: "employees/receptionist/conversation-rules.md",
      heading: "Rule 1 — Listen Before Responding",
    },
    {
      path: "employees/receptionist/conversation-rules.md",
      heading: "Rule 2 — One Step at a Time",
    },
  ],
  acknowledge: [
    { path: "employees/receptionist/role.md", heading: "Purpose" },
    {
      path: "employees/receptionist/personality.md",
      heading: "Communication Style",
    },
  ],
  handoff: [
    { path: "employees/receptionist/role.md", heading: "Purpose" },
    {
      path: "employees/receptionist/escalation.md",
      heading: "During Escalation",
    },
    {
      path: "employees/receptionist/escalation.md",
      heading: "Future Escalation Workflow",
    },
  ],
};

interface IndexedUnit {
  readonly unit: KnowledgeUnit;
  readonly heading: string;
  readonly headingPath: readonly string[];
  readonly title: string;
  readonly filename: string;
  readonly tags: readonly string[];
  readonly metadata: readonly string[];
  readonly content: string;
}

export class FilesystemKnowledgeRetriever implements KnowledgeRetriever<
  KnowledgeRequest,
  KnowledgeResult
> {
  private indexPromise: Promise<readonly IndexedUnit[]> | undefined;

  constructor(
    private readonly repositoryPath = resolve(process.cwd(), "..", REPOSITORY),
  ) {}

  async retrieve(request: KnowledgeRequest): Promise<KnowledgeResult> {
    assertRequest(request);
    const query = request.query.trim();
    if (query.length === 0) return { query, units: [] };

    const terms = tokenize(query);
    const index = await this.getIndex();
    const factualUnits = index
      .map((entry) => scoreUnit(entry, terms))
      .filter((unit) => unit.score > 0)
      .sort(
        (left, right) =>
          right.score - left.score ||
          left.sourceDocumentPath.localeCompare(right.sourceDocumentPath) ||
          left.order - right.order,
      )
      .slice(0, request.limit ?? DEFAULT_LIMIT);
    const guidanceUnits =
      request.guidanceProfile === undefined
        ? []
        : selectGuidance(index, request.guidanceProfile);
    const units = mergeUnique(factualUnits, guidanceUnits);

    return { query, units };
  }

  private getIndex(): Promise<readonly IndexedUnit[]> {
    this.indexPromise ??= this.buildIndex();
    return this.indexPromise;
  }

  private async buildIndex(): Promise<readonly IndexedUnit[]> {
    const documents = await Promise.all(
      (await markdownPaths(this.repositoryPath)).map(async (path) =>
        parseDocument(this.repositoryPath, path, await readFile(path, "utf8")),
      ),
    );
    return documents
      .filter(
        (document): document is KnowledgeSourceDocument => document !== null,
      )
      .flatMap(parseMarkdownKnowledgeUnits)
      .map(indexUnit)
      .sort(
        (left, right) =>
          left.unit.sourceDocumentPath.localeCompare(
            right.unit.sourceDocumentPath,
          ) || left.unit.order - right.unit.order,
      );
  }
}

function selectGuidance(
  index: readonly IndexedUnit[],
  profile: ReceptionistGuidanceProfile,
): readonly RetrievedKnowledgeUnit[] {
  return GUIDANCE_UNITS[profile].flatMap((selector) => {
    const match = index.find(
      (entry) =>
        entry.unit.sourceDocumentPath === selector.path &&
        entry.unit.heading === selector.heading,
    );
    return match === undefined ? [] : [{ ...match.unit, score: 0 }];
  });
}

function mergeUnique(
  factual: readonly RetrievedKnowledgeUnit[],
  guidance: readonly RetrievedKnowledgeUnit[],
): readonly RetrievedKnowledgeUnit[] {
  const seen = new Set(factual.map((unit) => unit.id));
  return [
    ...factual,
    ...guidance.filter((unit) => {
      if (seen.has(unit.id)) return false;
      seen.add(unit.id);
      return true;
    }),
  ];
}

async function markdownPaths(directory: string): Promise<readonly string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(
    entries
      .filter((entry) => entry.name !== ".git" && entry.name !== ".gitkeep")
      .map(async (entry): Promise<readonly string[]> => {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) return markdownPaths(path);
        return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
      }),
  );
  return groups.flat().sort((left, right) => left.localeCompare(right));
}

function parseDocument(
  repositoryPath: string,
  absolutePath: string,
  markdown: string,
): KnowledgeSourceDocument | null {
  const parsed = parseFrontmatter(markdown);
  if (metadataText(parsed.metadata.status).toLowerCase() !== "approved") {
    return null;
  }

  const path = relative(repositoryPath, absolutePath).split(sep).join("/");
  const firstHeading = /^#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/mu.exec(
    parsed.body,
  )?.[1];
  const title = firstNonEmpty(
    metadataText(parsed.metadata.title),
    firstHeading?.trim(),
    basename(path, ".md"),
  );

  return {
    path,
    title,
    body: parsed.body,
    tags: metadataList(parsed.metadata.tags),
    metadata: parsed.metadata,
    source: {
      repository: REPOSITORY,
      path,
      attribution: `${REPOSITORY}/${path}`,
    },
  };
}

function parseFrontmatter(markdown: string): {
  readonly metadata: Readonly<Record<string, KnowledgeMetadataValue>>;
  readonly body: string;
} {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  if (lines[0] !== "---") return { metadata: {}, body: markdown };
  const closingIndex = lines.indexOf("---", 1);
  if (closingIndex === -1) return { metadata: {}, body: markdown };

  const metadata: Record<string, KnowledgeMetadataValue> = {};
  let listKey: string | undefined;
  for (const line of lines.slice(1, closingIndex)) {
    const property = /^([A-Za-z0-9_-]+):\s*(.*)$/u.exec(line);
    if (property !== null) {
      const key = property[1];
      const value = property[2];
      if (key === undefined || value === undefined) continue;
      metadata[key] = value;
      listKey = value.length === 0 ? key : undefined;
      continue;
    }
    const item = /^\s+-\s+(.+)$/u.exec(line)?.[1];
    if (item !== undefined && listKey !== undefined) {
      const existing = metadata[listKey];
      metadata[listKey] = [
        ...(typeof existing === "string" || existing === undefined
          ? []
          : existing),
        item,
      ];
    }
  }
  return { metadata, body: lines.slice(closingIndex + 1).join("\n") };
}

function indexUnit(unit: KnowledgeUnit): IndexedUnit {
  return {
    unit,
    heading: normalize(unit.heading),
    headingPath: unit.headingPath.map(normalize),
    title: normalize(unit.sourceDocumentTitle),
    filename: normalize(basename(unit.sourceDocumentPath, ".md")),
    tags: unit.tags.map(normalize),
    metadata: Object.entries(unit.metadata).flatMap(([key, value]) => [
      normalize(key),
      ...(typeof value === "string"
        ? [normalize(value)]
        : value.map(normalize)),
    ]),
    content: normalize(unit.content),
  };
}

function scoreUnit(
  entry: IndexedUnit,
  terms: readonly string[],
): RetrievedKnowledgeUnit {
  let score = 0;
  for (const term of terms) {
    score += hasTerm(entry.heading, term) ? 120 : 0;
    score += Math.min(fieldOccurrences(entry.headingPath, term), 2) * 80;
    score += hasTerm(entry.title, term) ? 60 : 0;
    score += hasTerm(entry.filename, term) ? 50 : 0;
    score += Math.min(fieldOccurrences(entry.tags, term), 2) * 40;
    score += Math.min(fieldOccurrences(entry.metadata, term), 2) * 15;
    score += Math.min(occurrences(entry.content, term), 3) * 10;
  }
  return { ...entry.unit, score };
}

function fieldOccurrences(fields: readonly string[], term: string): number {
  return fields.reduce((total, field) => total + occurrences(field, term), 0);
}

function tokenize(value: string): readonly string[] {
  return [
    ...new Set(
      normalize(value)
        .split(" ")
        .filter((term) => term.length > 1),
    ),
  ];
}

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function occurrences(value: string, term: string): number {
  return value.split(" ").filter((candidate) => candidate === term).length;
}

function hasTerm(value: string, term: string): boolean {
  return occurrences(value, term) > 0;
}

function metadataText(value: KnowledgeMetadataValue | undefined): string {
  if (value === undefined) return "";
  return typeof value === "string" ? value : value.join(" ");
}

function metadataList(
  value: KnowledgeMetadataValue | undefined,
): readonly string[] {
  if (value === undefined) return [];
  return typeof value === "string" ? [value] : value;
}

function firstNonEmpty(...values: readonly (string | undefined)[]): string {
  return values.find((value) => value !== undefined && value.length > 0) ?? "";
}

function assertRequest(request: unknown): asserts request is KnowledgeRequest {
  if (
    request === null ||
    typeof request !== "object" ||
    !("query" in request) ||
    typeof request.query !== "string"
  ) {
    throw new TypeError("A Knowledge query is required.");
  }
  const limit = "limit" in request ? request.limit : undefined;
  if (
    limit !== undefined &&
    (typeof limit !== "number" ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > MAX_LIMIT)
  ) {
    throw new RangeError(
      `Knowledge result limit must be an integer from 1 to ${String(MAX_LIMIT)}.`,
    );
  }
}
