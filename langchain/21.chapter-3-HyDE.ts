import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import {PGVectorStore} from "@langchain/community/vectorstores/pgvector";
import {configDotenv} from "dotenv";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {RunnableLambda} from "@langchain/core/runnables";
import {propertyKeyTypes} from "zod/v4/core/util";

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

const hydePrompt = ChatPromptTemplate.fromTemplate('질문에 답할 구절을 영문으로 작성해 주세요.\n 질문: {question} \n 구절 :')
const generatedDoc = hydePrompt.pipe(chattingModel).pipe((msg)=>{ console.log(msg.content); return msg.content})
const retrievalChain = generatedDoc.pipe(retriever)


const prompt = ChatPromptTemplate.fromTemplate(
    '다음 컨텍스트만 사용해 질문에 답변하세요.\n 컨텍스트:{context} \n\n 질문 : {question}'
)
const hydeQa = RunnableLambda.from(async(input)=>{
    const docs = await retrievalChain.invoke({question:input})
    console.log(docs)
    const formatted = await prompt.invoke({context:docs, question:input})
    return await chattingModel.invoke(formatted)
})

const result = await hydeQa.invoke('현존하는 LLM중 어떤모델이 코딩,창작,글쓰기에 제일 높은 성능을 보이나요?')
console.log(result)