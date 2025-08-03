import 'dotenv/config';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { InMemoryStore } from "@langchain/core/stores";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "langchain/document_loaders/fs/text";
import * as uuid from 'uuid';
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import {MultiVectorRetriever} from "langchain/retrievers/multi_vector";

const connectionString = 'postgresql://langchain:langchain@localhost:6024/langchain';
const collectionName = 'summaries'
const loader = new TextLoader('./context-test.md')
const raw_docs = await loader.load()
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:1000,
    chunkOverlap:200
})

const docs = await splitter.splitDocuments(raw_docs)

const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
});

const prompt = PromptTemplate.fromTemplate('다음문서의 요약을생성하세요: \n\n{doc}')

const chain = RunnableSequence.from([
    {doc:(doc)=>doc.pageContent},
    prompt,
    model,
    new StringOutputParser()
])

const summaries = await chain.batch(docs, {
    maxConcurrency:5,
})

const idKey = 'doc_id'
const docIds = docs.map((_)=> uuid.v4())

const summaryDocs = summaries.map((summary,i)=>{
    const summaryDoc = new Document({
        pageContent:summary,
        metadata:{
            [idKey]:docIds[i],
        }
    });
    return summaryDoc
})

//기존 청크를 저장할 바이트스토어
const byteStore = new InMemoryStore();

//요약ㅇ을 저장할 벡터저장소
const verctorStore = await PGVectorStore.fromDocuments(summaryDocs,
    new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY
    }),
    {
        postgresConnectionOptions: {
            connectionString
        },
    });

const retriever = new MultiVectorRetriever({
    vectorstore:verctorStore,
    byteStore,
    idKey
})

const keyValuePairs = docs.map((originalDoc,i)=> [docIds[i],originalDoc])

await retriever.docstore.mset(keyValuePairs)

const vectorstoreResult = await retriever.vectorstore.similaritySearch('chapter on philosophy',2)

console.log(`summary : ${vectorstoreResult[0].pageContent}`)
console.log(`summary leng : ${vectorstoreResult[0].pageContent.length}`)

