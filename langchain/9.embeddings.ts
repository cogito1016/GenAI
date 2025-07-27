import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} from '@langchain/google-genai'
import 'dotenv/config';
import {TextLoader} from 'langchain/document_loaders/fs/text';
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {
    GoogleVertexAIMultimodalEmbeddings
} from "@langchain/community/dist/experimental/multimodal_embeddings/googlevertexai";


const model = new GoogleGenerativeAIEmbeddings({ //default : embedding-001
    apiKey : process.env.GEMINI_API_KEY
});

const embeddings = await model.embedDocuments([
    'Hi there!',
    'Oh, hello!',
    'What\'s your name?',
    'My friends call me World',
    'Hello World!'
])
console.log(embeddings)

/**
 *        -0.0871479,  0.036791507,   -0.030391797,   0.032206275,
 *     -0.0054236352,   0.08140531,   0.0064967712,  -0.032697074,
 *       0.051196992, -0.045181744,   -0.032340456,    0.04091165,
 *      -0.010830649, -0.027871309,    -0.01055386,   -0.06404949,
 *     ... 668 more items
 *   ]
 * ]
 */