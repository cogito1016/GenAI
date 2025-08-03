import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import 'dotenv/config';
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {ChatPromptTemplate, PromptTemplate} from "@langchain/core/prompts";
import {z} from "zod";

const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
});

const completion = await model.invoke('Hi there!')
// console.log(completion)

const completetions = await model.batch(['Hi there!', 'Bye!']);
// console.log(completetions)

for await(const token of await model.stream('Bye!')){
    console.log(token)
}

