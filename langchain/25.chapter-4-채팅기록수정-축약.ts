import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import {configDotenv} from "dotenv";
import {Annotation, END, MemorySaver, messagesStateReducer, START, StateGraph} from "@langchain/langgraph";
import * as fs from "node:fs";
import {AIMessage, HumanMessage, SystemMessage, trimMessages} from "@langchain/core/messages";

configDotenv()

const chattingModel = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY,
});

/**
 * 채팅기록메세지가 너무많으면 좋을게없다.
 * LLM이 집중한 내용이 분산되어 환각률이 높아지고
 * 토큰수도 많이잡아먹기때문
 * 따라서 최신메세지만 활용하도록 처리해주는게 좋다.
 *
 * 또한, 채팅기록메세지는 채팅모델이 사용할만큼 좋은퀄리티는 아니므로,
 * 채팅기록을 수정해 활용하기좋게끔 처리를 해야한다.
 * 방법은 3가지
 * 1. 메세지 축약
 * 2. 내용 필터링
 * 3. 메세지 병합
 */

const messages = [
    new SystemMessage('당신은 친절한 어시스턴트입니다'),
    new HumanMessage('안녕하세요! 나는 민혁입니다.'),
    new AIMessage('안녕하세요!'),
    new HumanMessage('바닐라 아이스크림을 좋아해요'),
    new AIMessage('좋네요!'),
    new HumanMessage('2 + 2는 얼마죠?'),
    new AIMessage('4입니다')
]

const trimmer = trimMessages({
    maxTokens:65,
    strategy:'last', //최신메세지부터볼지 오래된메세지부터볼지
    tokenCounter:chattingModel, //각모델에 최적화된 토큰을 산출해냄
    includeSystem:true,// 트리머가 시스템메세지를 유지하도록
    allowPartial:false,
    startOn:'human'//응답인 AI를 제거하면 그 응답을 불러온 질문인 HumanMessage도 삭제
})

const trimmed = await trimmer.invoke(messages)
console.log(trimmed)