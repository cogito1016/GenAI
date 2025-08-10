import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import {configDotenv} from "dotenv";
import {Annotation, END, MemorySaver, messagesStateReducer, START, StateGraph} from "@langchain/langgraph";
import * as fs from "node:fs";
import {HumanMessage} from "@langchain/core/messages";

configDotenv()
// const connectionString = 'postgresql://langchain:langchain@localhost:6024/langchain';
//
// const embeddingsModel = new GoogleGenerativeAIEmbeddings({ //default : embedding-001
//     apiKey : process.env.GEMINI_API_KEY
// });
const chattingModel = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY,
});

// const db = new PGVectorStore(embeddingsModel,{
//     postgresConnectionOptions: {
//         connectionString
//     },
//     tableName: "vertorTableName"
// })
// const retriever = db.asRetriever({k:2})

/**
 * State는 세가지를 정의함
 * 1. 그래프 상태의 구조 (어떤 채널에 읽기쓰기가 가능한지)
 * 2. 상태 채널의 기본값
 * 3. 상태 채널의 리듀서 (리듀서는 업데이트 방법을 표현하는 함수를 뜻함) - 아래에서는 새 메세지를 메세지 배열에 추가한다.
 */
const State = {
    messages: Annotation({
        reducer : messagesStateReducer,
        default: () => []
    })
}

let builder = new StateGraph(State)

/**
 * Node 추가
 * 현재 상태를 받아 LLM을 한번 호출한다
 * LLM이 생성한 새 메세지를 포함한 상태업데이트를 반환한다.
 * 상태에 이미 저장된 메세지목록에 새 메세지를 덧붙이는 dd_messages리듀서가있다.
 *
 */
async function chatbot(state){
    const answer = await chattingModel.invoke(state.messages)
    return { messages:answer }
}

builder = builder.addNode('chatbot',chatbot)


/**
 * Edge 추가
 * 실행할때마다 그래프의 작업 시작위치를 지;정한다.
 * 그래프의 종료지점을 지정하는 역할을한다.
 * 이는 선택 사항으로 노드가 더 이상 실행되지않으면 랭그래프가 자동으로 종료된다.
 * 그래프를 컴파일해 invoke및 stream메서드를제공하는 Runnable객체로 전환한다.
 */
builder = builder
    .addEdge(START, "chatbot")
    .addEdge("chatbot",END)
let graph = builder.compile({checkpointer : new MemorySaver()});

/**
 * (선택) 랭그래프시각화
 */
// const image = await graph.getGraph().drawMermaidPng()
// const arrayBuffer = await image.arrayBuffer()
// const buffer = new Uint8Array(arrayBuffer)
// fs.writeFileSync('graph.png',buffer)

    //스레드설정
const thread1 = {
    'configurable':{'thread_id':'1'}
}

//영속성 추가 후 그래프 실행
const result_1 = await graph.invoke({
    messages: [new HumanMessage('안녕하세요, 저는 민혁입니다.')],
}, thread1)

const result_2 = await graph.invoke({
    messages: [new HumanMessage('제 이름이 뭐죠?')]
}, thread1)

// {
//     values: {
//         messages: [
//             HumanMessage {
//                 "id": "63569891-7c7c-4a95-bceb-bcd512a41689",
//                 "content": "안녕하세요, 저는 민혁입니다.",
//                 "additional_kwargs": {},
//                 "response_metadata": {}
//             },
//             AIMessage {
//                 "id": "95026a0d-b46e-4a26-8e3c-3debab9279d7",
//                 "content": "안녕하세요, 민혁님. 만나서 반갑습니다!\n저는 인공지능 챗봇입니다.\n\n무엇을 도와드릴까요?",
//                 "additional_kwargs": {
//                     "finishReason": "STOP",
//                     "index": 0
//                 },
//                 "response_metadata": {
//                     "tokenUsage": {
//                         "promptTokens": 8,
//                         "completionTokens": 29,
//                         "totalTokens": 639
//                     },
//                     "finishReason": "STOP",
//                     "index": 0
//                 },
//                 "tool_calls": [],
//                 "invalid_tool_calls": []
//             },
//             HumanMessage {
//                 "id": "7e9a929f-1ff7-4eaa-acfd-89de43e160a2",
//                 "content": "제 이름이 뭐죠?",
//                 "additional_kwargs": {},
//                 "response_metadata": {}
//             },
//             AIMessage {
//                 "id": "414c0fb7-be4e-4f0b-be55-b62051cb9693",
//                 "content": "네, 민혁님이십니다.\n\n처음에 저에게 \"안녕하세요, 저는 민혁입니다\"라고 알려주셨어요! 😊",
//                 "additional_kwargs": {
//                     "finishReason": "STOP",
//                     "index": 0
//                 },
//                 "response_metadata": {
//                     "tokenUsage": {
//                         "promptTokens": 45,
//                         "completionTokens": 28,
//                         "totalTokens": 645
//                     },
//                     "finishReason": "STOP",
//                     "index": 0
//                 },
//                 "tool_calls": [],
//                 "invalid_tool_calls": []
//             }
//         ]
//     },

console.log(await graph.getState(thread1))

//이러면 invoke한 LLM결과값은 없지만 상태에는 추가되어 나중에있을 대화 사용되게됨
await graph.updateState(thread1, {messages:[new HumanMessage('저는 LLM이 좋아요!')]})

console.log(await graph.getState(thread1))