import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import 'dotenv/config';
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {ChatPromptTemplate, PromptTemplate} from "@langchain/core/prompts";
import {z} from "zod";


const answerScheme = z.object({
    answer: z.string().describe('사용자의 질문에 대한 답변'),
    justification: z.string().describe('답변에 대한 근거')
})
    .describe(
        '사용자의 질문에 대한 답변과 그에대한 근거를 함께 제공하세요.'
    )


const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
}).withStructuredOutput(answerScheme)

const response = await model.invoke('1킬로그램의 벽돌과 1킬로그램의 깃털 중 어느쪽이 더 무겁나요>')

console.log(response)
/**
 *
 * {
 *   answer: '두 물체 모두 1킬로그램이므로 무게는 동일합니다.',
 *   justification: '질문에서 킬로그램(kg)은 질량의 단위이며, 1킬로그램의 벽돌과 1킬로그램의 깃털은 이미 질량이 같다고 명시되어 있습니다. 따라서 둘 다 동일한 무게를 가집니다.'
 * }
 */