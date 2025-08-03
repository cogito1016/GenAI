import {TextLoader} from "langchain/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import {PGVectorStore} from "@langchain/community/vectorstores/pgvector";
import {configDotenv} from "dotenv";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {RunnableLambda} from "@langchain/core/runnables";
import * as querystring from "node:querystring";

configDotenv()
const connectionString = 'postgresql://langchain:langchain@localhost:6024/langchain';

const embeddingsModel = new GoogleGenerativeAIEmbeddings({ //default : embedding-001
    apiKey : process.env.GEMINI_API_KEY
});
const chattingModel = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY,
});

const db = new PGVectorStore(embeddingsModel,{
    postgresConnectionOptions: {
        connectionString
    },
    tableName: "vertorTableName"
})
const retriever = db.asRetriever({k:2})

const rewritePrompt = ChatPromptTemplate.fromTemplate("웹 검색 엔진이 주어ㅏ진 질문에 답할수있도록 더 나은 영문 검색어를 제공하세요. 쿼리는 '**'로 끝내세요. \n\n 질문 : {question} 답변 : ")

const rewriter = rewritePrompt.pipe(chattingModel).pipe((message)=>{
    // @ts-ignore
    return message.content.replaceAll('"','').replaceAll('**');
})

const rewriterQA = RunnableLambda.from(async (input)=>{
    const newQuery = await rewriter.invoke({question:input})
    console.log(`newQuery : ${newQuery}`)
    const docs = await retriever.invoke(newQuery)
    const formatted = await rewritePrompt.invoke({context:docs,question:input})
    const answer = await chattingModel.invoke(formatted)
    return answer
})

const query = "그리스철학자의 대표적인사람들은 무엇밥을먹는가"
const finalResult = await rewriterQA.invoke(query)
console.log(finalResult)