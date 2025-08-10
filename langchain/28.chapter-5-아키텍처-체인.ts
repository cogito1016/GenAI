import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import {configDotenv} from "dotenv";
import {Annotation, END, MemorySaver, messagesStateReducer, START, StateGraph} from "@langchain/langgraph";
import * as fs from "node:fs";
import {HumanMessage, SystemMessage} from "@langchain/core/messages";

configDotenv()

const modelLowTemp = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY,
    temperature:0.1
});
const modelHighTemp = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY,
    temperature:0.7
});

const annotation = Annotation.Root({
    messages:Annotation({reducer:messagesStateReducer,default:()=>[]}),
    user_query:Annotation(),
    sql_query:Annotation(),
    sql_explanation:Annotation()
})

const generatePrompt = new SystemMessage('당신은 친절한 데이터분석가입니다. 사용자의 질문을 바탕으로 SQL쿼리를 작성하세요')

async function generateSql(state){
    const userMessage = new HumanMessage(state.user_query)
    const messages = [generatePrompt, ...state.messages,userMessage]
    const res = await modelLowTemp.invoke(messages)
    return {
        sql_query:res.content,
        messages:[userMessage,res],
    }
}

const explainPrompt = new SystemMessage('당신은 친절한 데이터분석가입니다. 사용자에게 SQL쿼리를 간단하게 설명하세요')


async function explainSql(state){
    const messages = [explainPrompt, ...state.messages]
    const res = await modelHighTemp.invoke(messages)
    return {
        sql_explanation:res.content,
        messages:res,
    }
}

const builder = new StateGraph(annotation)
    .addNode('generate_sql',generateSql)
    .addNode('explain_sql',explainSql)
    .addEdge(START,'generate_sql')
    .addEdge('generate_sql','explain_sql')
    .addEdge('explain_sql',END)

const graph = builder.compile()
console.log(await graph.invoke({'user_query':'각 품목의 판매량을 구해주세요'}))



/**
 * (선택) 랭그래프시각화
 */
// const image = await graph.getGraph().drawMermaidPng()
// const arrayBuffer = await image.arrayBuffer()
// const buffer = new Uint8Array(arrayBuffer)
// fs.writeFileSync('graph-chain.png',buffer)