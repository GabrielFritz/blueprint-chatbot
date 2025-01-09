CREATE TABLE IF NOT EXISTS "Embeddings" (
	"id" varchar PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "Embeddings" USING hnsw ("embedding" vector_cosine_ops);