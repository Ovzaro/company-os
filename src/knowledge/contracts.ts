export type KnowledgeMetadataValue = string | readonly string[];

export interface KnowledgeDocument {
  readonly path: string;
  readonly title: string;
  readonly content: string;
  readonly headings: readonly string[];
  readonly tags: readonly string[];
  readonly metadata: Readonly<Record<string, KnowledgeMetadataValue>>;
  readonly source: {
    readonly repository: "ovzaro-knowledge";
    readonly path: string;
    readonly attribution: string;
  };
}

export interface KnowledgeRequest {
  readonly query: string;
  readonly limit?: number;
}

export interface RetrievedKnowledgeDocument extends KnowledgeDocument {
  readonly score: number;
}

export interface KnowledgeResult {
  readonly query: string;
  readonly documents: readonly RetrievedKnowledgeDocument[];
}
