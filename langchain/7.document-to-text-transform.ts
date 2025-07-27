import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import 'dotenv/config';
import {TextLoader} from 'langchain/document_loaders/fs/text';
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";

const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
});

const loader = new TextLoader('./context-test.txt')

//문서 로드
const docs = await loader.load();

//문서 청크단위로 분활
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize:1000,
    chunkOverlap:200,
})
const splittedDocs = await splitter.splitDocuments(docs)
console.log(splittedDocs)