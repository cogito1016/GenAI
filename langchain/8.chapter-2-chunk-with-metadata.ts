import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import 'dotenv/config';
import {TextLoader} from 'langchain/document_loaders/fs/text';
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";

const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
});

const loader = new TextLoader('./context-test.md')

//문서 로드
const docs = await loader.load();
// console.log(docs)

//문서 청크단위로 분활
const splitter = RecursiveCharacterTextSplitter.fromLanguage('markdown',{
    chunkSize:1000,
    chunkOverlap:200,
})

const mdDOcs = await splitter.createDocuments(
    [docs[0].pageContent],
)

console.log(mdDOcs)