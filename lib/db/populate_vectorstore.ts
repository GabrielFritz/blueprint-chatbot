import db from '@/lib/db/migrate';
import { embeddings } from '@/lib/db/schema';
import { data } from '@/vectorstore/data';

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
