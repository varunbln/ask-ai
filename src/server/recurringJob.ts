import { generateEmbeddings } from './generateEmbeddings.js';
import { initPinecone } from './utils.js';

export const pingPinecone = async () => {
    const pinecone = await initPinecone();
    const indexes = await pinecone.listIndexes();
    if (!indexes.includes('embeds')) {
        await pinecone.createIndex({
            createRequest: {
                name: 'embeds',
                dimension: 1536,
            },
        });
    }
    const index = pinecone.Index('embeds');
    console.log(await index.fetch({ ids: ["1"] }))
}