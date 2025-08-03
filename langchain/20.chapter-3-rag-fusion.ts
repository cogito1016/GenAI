import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} from "@langchain/google-genai";
import {PGVectorStore} from "@langchain/community/vectorstores/pgvector";
import {configDotenv} from "dotenv";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {RunnableLambda} from "@langchain/core/runnables";

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

const perspectivePrompt = ChatPromptTemplate.fromTemplate(
    `당신은 AI언어모델 어시스턴트입니다. 주어진 사용자 질문의 다섯 가지 버전을 생성하여 벡터데이터베이스에서 관련문서를 검색하세요. 사용자 질문에 대한 다양한 관점을 생성함으로써 사용자가 거리기반 유사도 검색의 한계를 극복할수있도록 돕는것이 목표입니다. 이러한 대체 질문을 개행으로 구분하여 제공하세요. 원래질문 : {question}`
)

const queryGen = perspectivePrompt.pipe(chattingModel).pipe((message)=>{
    // @ts-ignore
    return message.content.split('\n')
})

//중복제거
const retrievalChain = queryGen
    .pipe(retriever.batch.bind(retriever))
    .pipe((results) => reciprocalRankFusion(results, 60))
    .pipe((documentLists)=>{
        const dedupedDocs = {};
        documentLists.flat().forEach((doc)=>{
            // @ts-ignore
            dedupedDocs[doc.pageContent] = doc;
        });
        return Object.values(dedupedDocs)
    })

const prompt = ChatPromptTemplate.fromTemplate(
    '다음 컨텍스트만 사용해 질문에 답변하세요. \n 컨텍스트 : {context} \n\n 질문 : {question}'
)

console.log("다중쿼리 검색 \n")

const ragFusion = RunnableLambda.from(async (input)=>{
    const docs = await retrievalChain.invoke({question:input})
    console.log("검색한 문서들")
    console.log(docs)
    const formatted = await prompt.invoke({context:docs,question:input})
    console.log('포매팅된 질문')
    console.log(formatted)
    const answer = await chattingModel.invoke((formatted))
    return answer
})
const result = await ragFusion.invoke('현존하는 LLM중 어떤모델이 코딩,창작에 제일 높은 성능을 보이나요?')

console.log('결과')
console.log(result)
// "content": "제공된 컨텍스트에 따르면:\n\n*   **코딩**에는 **Claude 4** (특히 Claude 4 Opus)가 뛰어난 코드 생성 능력으로 추천됩니다.\n*   **창의적 작업** (콘텐츠 생성, 브레인스토밍, 창작 지원)에는 **OpenAI GPT 시리즈** (GPT-4o, GPT-4.5, o3 시리즈)가 강점",

function reciprocalRankFusion(results,k=60){
    const fusedScores={};
    const documents={};
    results.forEach((docs)=>{
        docs.forEach((doc,rank)=>{
            const key = doc.pageContent
            //문서가 아직 본 적 없으면 점수를 0으로초기화, 나중에사용하기위해 저장
            if(!(key in fusedScores)){
                fusedScores[key]=0
                documents[key]=doc
            }
            //RRF공식을 사용하여 문서의 점수 업데이트
            //1/(rank+k)
            fusedScores[key] += 1 / (rank + k)
        })
    })

    console.log("스코어점수")
    console.log("스코어점수:",
        Object.values(fusedScores))
    console.log('도큐먼츠')
    console.log(documents)

    //결합된 점수에 따라 문서를 내림차순으로 정렬하여 최종 재정렬된 결과 가져오기
    // @ts-ignore
    const sorted = Object.entries(fusedScores).sort((a,b)=> b[1]-a[1]);
    //각 키에 대한 해당 문서 검색
    // @ts-ignore
    return sorted.map(([key])=>documents[key])
}