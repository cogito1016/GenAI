import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import {PGVectorStore} from "@langchain/community/vectorstores/pgvector";
import {configDotenv} from "dotenv";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {RunnableLambda} from "@langchain/core/runnables";
import {propertyKeyTypes} from "zod/v4/core/util";

configDotenv()
const connectionString = 'postgresql://langchain:langchain@localhost:6024/langchain';

const embeddingsModel = new GoogleGenerativeAIEmbeddings({ //default : embedding-001
    apiKey : process.env.GEMINI_API_KEY
});
const chattingModel = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY,
});

const db = new PGVectorStore(embeddingsModel,{
    postgresConnectionOptions: {
        connectionString
    },
    tableName: "vertorTableName"
})
const retriever = db.asRetriever({k:2})

const prompt = ChatPromptTemplate.fromMessages([
    [
        'system',
        '당신은 친절한 어시스턴트입니다. 모든 질문에 최선을 다해 답하세요.'
    ],
    ['placeholder','{messages}']
])
const chain = prompt.pipe(chattingModel)

const response = await chain.invoke({
    messages:[
            [
            'human',
            '다음 한국어 문장을 프랑스어로 번역하세요 : 나는 프로그래밍을 좋아해요',
        ],
        ['ai','J\'adore programmer'],
        ['human','뭐라고말했죠?']
    ]
})

console.log(response)