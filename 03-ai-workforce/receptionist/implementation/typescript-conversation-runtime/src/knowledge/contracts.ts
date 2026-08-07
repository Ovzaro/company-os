export type KnowledgeMetadataValue = string | readonly string[];

export interface KnowledgeSource {
  readonly repository: "ovzaro-knowledge";
  readonly path: string;
  readonly attribution: string;
}

export interface KnowledgeSourceDocument {
  readonly path: string;
  readonly title: string;
  readonly body: string;
  readonly tags: readonly string[];
  readonly metadata: Readonly<Record<string, KnowledgeMetadataValue>>;
  readonly source: KnowledgeSource;
}

export interface KnowledgeUnit {
  readonly id: string;
  readonly sourceDocumentPath: string;
  readonly sourceDocumentTitle: string;
  readonly heading: string;
  readonly headingPath: readonly string[];
  readonly content: string;
  readonly tags: readonly string[];
  readonly metadata: Readonly<Record<string, KnowledgeMetadataValue>>;
  readonly source: KnowledgeSource;
  readonly order: number;
}

export interface KnowledgeRequest {
  readonly query: string;
  readonly limit?: number;
  readonly guidanceProfile?: ReceptionistGuidanceProfile;
}

export type ReceptionistGuidanceProfile =
  "answer" | "clarify" | "acknowledge" | "handoff";

export interface RetrievedKnowledgeUnit extends KnowledgeUnit {
  readonly score: number;
}

export interface KnowledgeResult {
  readonly query: string;
  readonly units: readonly RetrievedKnowledgeUnit[];
}
