import { readdir, readFile } from "node:fs/promises";
import { basename, relative, resolve, sep } from "node:path";

import type {
  KnowledgeDocument,
  KnowledgeMetadataValue,
  KnowledgeRequest,
  KnowledgeResult,
  RetrievedKnowledgeDocument,
} from "../../knowledge/index.js";
import type { KnowledgeRetriever } from "../../ports/knowledge-retriever.js";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;
const REPOSITORY = "ovzaro-knowledge";

interface IndexedDocument {
  readonly document: KnowledgeDocument;
  readonly title: string;
  readonly filename: string;
  readonly headings: readonly string[];
  readonly tags: readonly string[];
  readonly metadata: readonly string[];
  readonly content: string;
}

export class FilesystemKnowledgeRetriever implements KnowledgeRetriever<
  KnowledgeRequest,
  KnowledgeResult
> {
  private indexPromise: Promise<readonly IndexedDocument[]> | undefined;

  constructor(
    private readonly repositoryPath = resolve(process.cwd(), "..", REPOSITORY),
  ) {}

  async retrieve(request: KnowledgeRequest): Promise<KnowledgeResult> {
    assertRequest(request);
    const query = request.query.trim();
    if (query.length === 0) return { query, documents: [] };

    const terms = tokenize(query);
    const documents = (await this.getIndex())
      .map((entry) => scoreDocument(entry, terms))
      .filter((document) => document.score > 0)
      .sort(
        (left, right) =>
          right.score - left.score || left.path.localeCompare(right.path),
      )
      .slice(0, request.limit ?? DEFAULT_LIMIT);

    return { query, documents };
  }

  private getIndex(): Promise<readonly IndexedDocument[]> {
    this.indexPromise ??= this.buildIndex();
    return this.indexPromise;
  }

  private async buildIndex(): Promise<readonly IndexedDocument[]> {
    const documents = await Promise.all(
      (await markdownPaths(this.repositoryPath)).map(async (path) =>
        parseDocument(this.repositoryPath, path, await readFile(path, "utf8")),
      ),
    );
    return documents
      .filter((document): document is KnowledgeDocument => document !== null)
      .map(indexDocument)
      .sort((left, right) =>
        left.document.path.localeCompare(right.document.path),
      );
  }
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
): KnowledgeDocument | null {
  const parsed = parseFrontmatter(markdown);
  if (metadataText(parsed.metadata.status).toLowerCase() !== "approved") {
    return null;
  }

  const path = relative(repositoryPath, absolutePath).split(sep).join("/");
  const headings = [...parsed.body.matchAll(/^#{1,6}\s+(.+)$/gmu)].map(
    (match) => match[1]?.trim() ?? "",
  );
  const title = firstNonEmpty(
    metadataText(parsed.metadata.title),
    headings[0],
    basename(path, ".md"),
  );

  return {
    path,
    title,
    content: parsed.body.trim(),
    headings,
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

function indexDocument(document: KnowledgeDocument): IndexedDocument {
  return {
    document,
    title: normalize(document.title),
    filename: normalize(basename(document.path, ".md")),
    headings: document.headings.map(normalize),
    tags: document.tags.map(normalize),
    metadata: Object.entries(document.metadata).flatMap(([key, value]) => [
      normalize(key),
      ...(typeof value === "string"
        ? [normalize(value)]
        : value.map(normalize)),
    ]),
    content: normalize(document.content),
  };
}

function scoreDocument(
  entry: IndexedDocument,
  terms: readonly string[],
): RetrievedKnowledgeDocument {
  let score = 0;
  for (const term of terms) {
    score += occurrences(entry.title, term) * 100;
    score += occurrences(entry.filename, term) * 80;
    score += fieldOccurrences(entry.headings, term) * 60;
    score += fieldOccurrences(entry.tags, term) * 50;
    score += fieldOccurrences(entry.metadata, term) * 20;
    score += Math.min(occurrences(entry.content, term), 10) * 10;
  }
  return { ...entry.document, score };
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
