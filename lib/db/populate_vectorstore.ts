import db from '@/lib/db/migrate';
import { embeddings } from '@/lib/db/schema';
import { data } from '@/vectorstore/data';

const populateVectorStore = async () => {

    await db.delete(embeddings);

    for (const item of data) {
        await db.insert(embeddings).values({
            id: item.id,
            content: item.content,
            embedding: item.embedding,
        });
    }
};

populateVectorStore();
