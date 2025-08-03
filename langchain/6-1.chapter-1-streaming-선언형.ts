import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import 'dotenv/config';
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {ChatPromptTemplate, PromptTemplate} from "@langchain/core/prompts";
import {z} from "zod";
import {RunnableLambda} from "@langchain/core/runnables";

const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
});

const template = ChatPromptTemplate.fromMessages([
    [
        'system',
        '아래 작성한 컨텍스트(Context)를 기반으로 질문(Question)에 대답하세요. 제공된 정보로 대답할 수 없는 질문이라면 "모르겠어요"라고 대답하세요.'
    ],
    ['human','Context: {context}'],
    ['human','Question: {question}']
]);

const chatbot = template.pipe(model)

for await (const token of await chatbot.stream({
    context:"예쁘게말해주세여",
    question:"안녕하세용 3줄이상말해주세요."
})){
    console.log(token)
}