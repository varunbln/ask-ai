import { openai } from './utils.js';
import { initPinecone } from './utils.js';
import type { TextChunk } from '@wasp/entities';
import type { SearchEmbeddings } from '@wasp/queries/types';

type QueryArgs = { inputQuery: string, resultNum: number, subject: string };

interface SubjectNameInterface {
  [subject: string]: string;
}

export const searchEmbeddings: SearchEmbeddings<QueryArgs, string> = async ({ inputQuery, resultNum, subject }, context) => {
  const pinecone = await initPinecone();

  const res = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: inputQuery.trim(),
  });

  // get the embedding of the search query
  const embedding = res.data.data[0].embedding;

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

  const subjectNames: SubjectNameInterface = {
    "Supply Chain Management": "SCM",
    "Digital Marketing": "DM",
    "Finance and Accounting": "FA",
    "Social Network Analysis": "SNA",
    "Fundamentals of Business Analytics": "FBA"
  }

  const subjectName = subjectNames[subject];


  // find the top 3 closest embeddings to the search query
  const queryRequest = {
    vector: embedding,
    topK: resultNum,
    namespace: subjectName, // this should be the same namespace that we created in generateEmbeddings.ts
    includeValues: false,
    includeMetadata: false,
  };
  const queryResponse = await index.query({ queryRequest });

  // query the db for the text chunks that match the closest embeddings and return them
  let matches: TextChunk[] = [];
  if (queryResponse.matches?.length) {
    const textChunks = await Promise.all(
      queryResponse.matches.map(async (match) => {
        return await context.entities.TextChunk.findFirst({
          where: {
            title: match.id,
          },
        });
      })
    );
    matches = textChunks.filter((textChunk) => !!textChunk) as TextChunk[];
  }

  const systemPrompt = "You are a helpful AI assistant that answers questions that users have using the context provided. Provide answers only if you're sure that they are correct. If someone asks who your creator, owner or something like that is, say it's Varun. ";
  let promptContext = "";
  matches.forEach(match => {
    promptContext += match.content
  });
  const prompt = "Given Context: " + promptContext + ". User Question: " + inputQuery;
  const promptMessages: any[] = [
    { "role": "system", "content": systemPrompt },
    { "role": "user", "content": prompt }
  ]
  const reply = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: promptMessages
  });
  return reply.data.choices[0].message?.content as string;
};
