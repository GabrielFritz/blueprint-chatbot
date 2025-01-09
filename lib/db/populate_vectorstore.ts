import { embeddings } from '@/lib/db/schema';
import { data } from '@/vectorstore/data';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  const connection = postgres(process.env.POSTGRES_URL);
  const db = drizzle(connection);

const populateVectorStore = async () => {

    await db.delete(embeddings);
    for (const [index, item] of data.entries()) {
        console.log(`Processing item ${index + 1} of ${data.length} - ${item.id}`);
        await db.insert(embeddings).values({
            id: item.id,
            content: item.content,
            embedding: item.embedding,
        });
    }
};

populateVectorStore();
