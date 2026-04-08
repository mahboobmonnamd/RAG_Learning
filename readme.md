# RAG App Learning Project

This project is a small Retrieval-Augmented Generation (RAG) demo built with:

- ChromaDB as the vector database
- OpenAI for embeddings + answer generation
- Ollama for local embeddings + answer generation
- A PDF file as the source document

The goal is to understand the basic RAG flow:

1. Read a PDF
2. Split it into chunks
3. Convert chunks into embeddings
4. Store embeddings in ChromaDB
5. Convert a user question into an embedding
6. Retrieve similar chunks
7. Send the retrieved context to an LLM
8. Print the answer and source chunks

## Project Structure

- [sample.pdf](/Users/mahboob/Developer/Learning/rag-app/sample.pdf): source document to ingest
- [src/openai/inject.ts](/Users/mahboob/Developer/Learning/rag-app/src/openai/inject.ts): ingest PDF into Chroma using OpenAI embeddings
- [src/openai/query.ts](/Users/mahboob/Developer/Learning/rag-app/src/openai/query.ts): query Chroma and answer using OpenAI
- [src/ollama/inject.ts](/Users/mahboob/Developer/Learning/rag-app/src/ollama/inject.ts): ingest PDF into Chroma using Ollama embeddings
- [src/ollama/query.ts](/Users/mahboob/Developer/Learning/rag-app/src/ollama/query.ts): query Chroma and answer using Ollama
- [src/db.ts](/Users/mahboob/Developer/Learning/rag-app/src/db.ts): Chroma collection setup
- [src/utils.ts](/Users/mahboob/Developer/Learning/rag-app/src/utils.ts): PDF loading and chunking helpers

## Environment Variables

Create a `.env` file in the project root.

### Required for OpenAI flow

```env
OPENAI_API_KEY=your_openai_api_key
```

### Optional for Ollama flow

```env
OLLAMA_HOST=http://192.168.88.35:11434
OLLAMA_EMBED_MODEL=llama3.2:3b
OLLAMA_CHAT_MODEL=llama3.2:3b
```

Notes:

- `OLLAMA_HOST` should point to your Ollama server.
- `OLLAMA_EMBED_MODEL` is the model used to generate embeddings.
- `OLLAMA_CHAT_MODEL` is the model used to generate the final answer.
- Make sure the Ollama models you choose are already available on your Ollama server.

## Input

This project currently uses two kinds of input:

- A PDF file named `sample.pdf` at the project root
- A hardcoded question inside the query files

Examples:

- [src/openai/query.ts](/Users/mahboob/Developer/Learning/rag-app/src/openai/query.ts) asks:
  `What is this document about?`
- [src/ollama/query.ts](/Users/mahboob/Developer/Learning/rag-app/src/ollama/query.ts) asks:
  `What are the pillars?`
  `How to cook briyani?`

If you want different questions, edit the `ask("...")` lines in the query files.

## Output

The scripts print results in the terminal.

### Inject output

Successful ingestion prints:

```txt
Ingested!
```

### Query output

Successful query prints:

```txt
Answer:
<model answer>

Sources:
[
  <retrieved chunk 1>,
  <retrieved chunk 2>,
  ...
]
```

## How To Run

## 1. Install dependencies

```bash
npm install
```

## 2. Make sure supporting services are available

- Your ChromaDB connection in [src/db.ts](/Users/mahboob/Developer/Learning/rag-app/src/db.ts) must be reachable
- Your Ollama server must be running if you want to use the Ollama flow
- `sample.pdf` must exist at the project root

## 3. Build the project

```bash
npm run build
```

This compiles TypeScript from `src` into `dist`.

## 4. Run one of the ingestion flows

### OpenAI ingestion

```bash
npm run inject:openai
```

### Ollama ingestion

```bash
npm run inject:ollama
```

This reads `sample.pdf`, chunks it, creates embeddings, and stores the chunks in the `docs` Chroma collection.

## 5. Run one of the query flows

### OpenAI query

```bash
npm run query:openai
```

### Ollama query

```bash
npm run query:ollama
```

This embeds the question, retrieves similar chunks from Chroma, sends them to the model, and prints the answer.

## Typical Learning Flow

### OpenAI

```bash
npm run build
npm run inject:openai
npm run query:openai
```

### Ollama

```bash
npm run build
npm run inject:ollama
npm run query:ollama
```

## Important Notes

- Ingestion and querying should use compatible embedding models for the same collection.
- If you ingest with OpenAI embeddings, querying with Ollama embeddings may produce weak or incorrect retrieval.
- If you ingest with Ollama embeddings, querying with OpenAI embeddings may also produce poor results.
- For reliable learning experiments, use the same provider for both inject and query.
- The current query files use hardcoded questions instead of command-line input.

## Common Issues

### PDF not found

The code expects:

```txt
sample.pdf
```

at the project root:

```txt
/Users/mahboob/Developer/Learning/rag-app/sample.pdf
```

### No answer or poor answer quality

Possible reasons:

- The PDF was not ingested yet
- ChromaDB is not reachable
- The embedding model used for query does not match the one used for ingestion
- The question is unrelated to the PDF
- The selected Ollama model is not good for embeddings or chat

### Ollama connection error

Check:

- `OLLAMA_HOST` is correct
- the Ollama server is running
- the chosen models are installed on that server

## Current Scripts

From [package.json](/Users/mahboob/Developer/Learning/rag-app/package.json):

```json
{
  "build": "tsc",
  "inject:openai": "ts-node dist/openai/inject.js",
  "query:openai": "ts-node dist/openai/query.js",
  "inject:ollama": "ts-node dist/ollama/inject.js",
  "query:ollama": "ts-node dist/ollama/query.js"
}
```

These scripts assume you build first, then run the compiled files.
