# Ask-AI
Web app to ask AI questions about my college course material.  
https://ask-ai.varunbalani.com/

## Behaviour
This project performs Retrieval Augmented Generation(RAG) using embeddings generated from my course material. Embeddings were generated using OpenAI's text embedding model: `text-embedding-ada-002`.
The generated vectors are stored in a Pinecone index with different namespaces corresponding to each subject. When a user enters a query, a similarity search is performed on the stored embeddings
for the selected subjects. The top-k results are returned, and given as context to the chat completion model which uses the context to answer the user's query.

## Tech Stack
- React
- Express
- PostgreSQL with Prisma
- Pinecone as a Vector Database
- Wasp-Lang(https://wasp-lang.dev/)

![image](https://github.com/varun-balani/ask-ai/assets/25721272/3414d830-c3e7-407a-b014-a488f6e8a95a)

