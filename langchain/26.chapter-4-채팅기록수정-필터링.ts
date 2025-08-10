import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import {configDotenv} from "dotenv";
import {Annotation, END, MemorySaver, messagesStateReducer, START, StateGraph} from "@langchain/langgraph";
import * as fs from "node:fs";
import {AIMessage, filterMessages, HumanMessage, SystemMessage, trimMessages} from "@langchain/core/messages";

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
 * 3. 메세지 병합 -
 */

const messages = [
    new SystemMessage({content:'당신은 친절한 어시스턴트입니다',id:'1'}),
    new HumanMessage({content:'예시입력',id:'2'}),
    new AIMessage({content:'예시출력',id:'3'}),
    new HumanMessage({content:'실제입력',id:'4'}),
    new AIMessage({content:'실제출력',id:'5'}),
]

const filterByHumanMessages = filterMessages(messages,{
    includeTypes:['human']
})

console.log(filterByHumanMessages)

/**
 * 이외에도 다양한조건의 내용 필터링있다.
 * - 특정이름의 메세지 제외
 * - 유형과 ID로 필터링
 */