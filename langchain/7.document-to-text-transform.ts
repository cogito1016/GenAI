import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import 'dotenv/config';
import {TextLoader} from 'langchain/document_loaders/fs/text';

const model = new ChatGoogleGenerativeAI({
    model : 'gemini-2.5-flash',
    apiKey : process.env.GEMINI_API_KEY
});

const loader = new TextLoader('./context-test.txt')
const docs = await loader.load();
console.log(docs)