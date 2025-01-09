import { openai } from '@ai-sdk/openai';
import { embed, UserContent, EmbeddingModel } from 'ai';

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
