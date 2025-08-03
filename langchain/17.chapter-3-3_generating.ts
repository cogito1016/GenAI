import {TextLoader} from "langchain/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import {PGVectorStore} from "@langchain/community/vectorstores/pgvector";
import {configDotenv} from "dotenv";
import {ChatPromptTemplate} from "@langchain/core/prompts";

configDotenv()
const connectionString = 'postgresql://langchain:langchain@localhost:6024/langchain';

// RAG_1단계 : 인덱싱
const loader = new TextLoader('./context-test.md')
const raw_docs = await loader.load()
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:1000,
    chunkOverlap:200
})
const splitDocs = await splitter.splitDocuments(raw_docs)


const embeddingsModel = new GoogleGenerativeAIEmbeddings({ //default : embedding-001
    apiKey : process.env.GEMINI_API_KEY
});

const db = await PGVectorStore.fromDocuments(splitDocs,embeddingsModel, {
    postgresConnectionOptions: {
        connectionString
    },
    tableName: "vertorTableName"
})

// RAG_2단계 : 검색
const retriever = db.asRetriever({k:2})
const query = "25년상반기 LLM동향을 요약해보자면?";
const docs = await retriever.invoke(query)


// RAG_3단계 : 생성
const chattingModel = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY,
});

const promptQuery = '다음 컨텍스트만 사용해 질문에 답변하세요.\n 컨텍스트: {context}\n\n 질문 : {question}'
const prompt = ChatPromptTemplate.fromTemplate(promptQuery)

const chain = prompt.pipe(chattingModel)

const result = await chain.invoke({
    context:docs,
    question:query
})

console.log(result)