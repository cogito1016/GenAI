import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import 'dotenv/config';
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {PromptTemplate} from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
})

const template =
    PromptTemplate.fromTemplate('아래 작성한 컨텍스트(Context)를 기반으로 질문(Question)에 대답하세요. 제공된 정보로 대답할 수 없는 질문이라면 "모르겠어요"라고 대답하세요.' +
        'Context:{context}' +
        'Question:{question}' +
        'Answer: ');

const prompt = await template.invoke({
    context:'거대언어모델은 자연어처리분야의 최신발전을 이끌고있습니다. 거대언어모델은 더 작은모델보다 우수한 성능을 보이며' +
        'NLP기능을 갖춘 애플리케이션을 개발하는 개발자들에게 매우 중요한 도구가 되었습니다.' +
        '개발자들은 Hugging Face의 transformers라이브러리를 활용하거나' +
        'openai및 gemini라이브러리를 통해 서비스를 이용하여 거대언어모델을 활용할수있습니다',
    question:'거대언어모델은 어디서 제공하나요?'
    });

const response = await model.invoke(prompt)

console.log(response)