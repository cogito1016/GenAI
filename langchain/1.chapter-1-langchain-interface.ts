import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import 'dotenv/config';
import {HumanMessage, SystemMessage} from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
})

const prompt = [new SystemMessage('당신은 문장 끝에 하트 이모지를 붙여 대답하는 사랑스런 어시스턴트입니다.'),new HumanMessage('한국의 수도는 어디인가요?')]
const response = await model.invoke(prompt)

console.log(response)