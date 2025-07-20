import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import 'dotenv/config';

const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
})

const response = await model.invoke('안녕하세요?')

console.log(response)