import { embeddings } from '@/lib/db/schema';
import { data } from '@/scripts/vectorstore/data';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  const connection = postgres(process.env.POSTGRES_URL);
  const db = drizzle(connection);

const populateVectorStore = async () => {

    try {
        await db.delete(embeddings);
        for (const [index, item] of data.entries()) {
        console.log(`Processing item ${index + 1} of ${data.length} - ${item.id}`);
        await db.insert(embeddings).values({
            id: item.id,
            content: item.content,
            embedding: item.embedding,
        });
        }
        console.log('✅ Vector store populated');
    } catch (error) {
        console.error('Error populating vector store:', error);
    } finally {
        await connection.end();
        process.exit(0);
    }
};

populateVectorStore().catch(error => {
    console.error('Error populating vector store:', error);
    process.exit(1);
});