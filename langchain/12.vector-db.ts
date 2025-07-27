import {GoogleGenerativeAIEmbeddings} from '@langchain/google-genai'
import 'dotenv/config';
import {TextLoader} from 'langchain/document_loaders/fs/text';
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {PGVectorStore} from "@langchain/community/vectorstores/pgvector";

const connectionString = 'postgresql://langchain:langchain@localhost:6024/langchain';
const loader = new TextLoader('./context-test.md')
const raw_docs = await loader.load()
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:1000,
    chunkOverlap:200
})

const docs = await splitter.splitDocuments(raw_docs)

const model = new GoogleGenerativeAIEmbeddings({ //default : embedding-001
    apiKey : process.env.GEMINI_API_KEY
});

const db = await PGVectorStore.fromDocuments(docs,model,{
    postgresConnectionOptions:{
        connectionString
    }
})

console.log(db)