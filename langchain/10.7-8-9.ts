import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} from '@langchain/google-genai'
import 'dotenv/config';
import {TextLoader} from 'langchain/document_loaders/fs/text';
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {
    GoogleVertexAIMultimodalEmbeddings
} from "@langchain/community/dist/experimental/multimodal_embeddings/googlevertexai";

//임베딩 모델 세팅
const model = new GoogleGenerativeAIEmbeddings({ //default : embedding-001
    apiKey : process.env.GEMINI_API_KEY
});

//1.문서 로더
const loader = new TextLoader('./context-test.md')
const docs = await loader.load()

//문서형식에 맞게 청킹세팅
const spliiter = RecursiveCharacterTextSplitter.fromLanguage('markdown',{
    chunkSize:1000,
    chunkOverlap:200
})

//2.문서 청킹
const mdDocs = await spliiter.createDocuments(
    [docs[0].pageContent]
)

//3.임베딩
const embeddings = await model.embedDocuments(mdDocs.map((c)=>c.pageContent))
console.log(embeddings)