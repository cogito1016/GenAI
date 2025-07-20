import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import 'dotenv/config';
import {HumanMessage} from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
})

const prompt = [new HumanMessage('한국의 수도는 어디인가요?')]
const response = await model.invoke(prompt)

console.log(response)