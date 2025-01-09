import { openai } from '@ai-sdk/openai';
import { embed, UserContent } from 'ai';
import { sql, cosineDistance, desc, gt } from 'drizzle-orm';
import { embeddings } from '@/lib/db/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

const connection = postgres(process.env.POSTGRES_URL);
const db = drizzle(connection);

const embeddingModel = openai.embedding('text-embedding-3-small');

export const generateEmbeddings = async (content: UserContent) => {
    const { embedding } = await embed({
        model: embeddingModel,
        value: content,
    });
    // return value as content instead of value
    return {
        content: content,
        embedding: embedding,
    };
};

export const findRelevantContent = async (content: UserContent) => {
    const userContentEmbeddings = await generateEmbeddings(content);

    const similarity = sql<number>`1-(${cosineDistance(
        embeddings.embedding,
        userContentEmbeddings.embedding
    )})`;

    const similarGuides = await db
        .select({id: embeddings.id, content: embeddings.content, similarity})
        .from(embeddings)
        .orderBy(t => desc(t.similarity))
        .limit(3);

    return similarGuides;
};