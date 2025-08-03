import {TextLoader} from "langchain/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import {PGVectorStore} from "@langchain/community/vectorstores/pgvector";
import {configDotenv} from "dotenv";

configDotenv()
const connectionString = 'postgresql://langchain:langchain@localhost:6024/langchain';
const loader = new TextLoader('./context-test.md')
const raw_docs = await loader.load()
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:1000,
    chunkOverlap:200
})
const splitDocs = await splitter.splitDocuments(raw_docs)


const model = new GoogleGenerativeAIEmbeddings({ //default : embedding-001
    apiKey : process.env.GEMINI_API_KEY
});

const db = await PGVectorStore.fromDocuments(splitDocs,model, {
    postgresConnectionOptions: {
        connectionString
    },
    tableName: "vertorTableName"
})

const retriever = db.asRetriever({k:2})
const query = "25년상반기 LLM동향을 요약해보자면?";
const docs = await retriever.invoke(query)
console.log(docs)


