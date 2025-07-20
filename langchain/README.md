
# 설치
- npm install langchain @langchain/google-genai @langchain/community   
   - 제미나이를 사용할것이므로 @langchain/google-genai를 사용 
- npm install @langchain/core pg

# LLM 개념
- LLM : 많이 학습한 거대언어모데 
- 지시튜닝 : LLM을 추가훈련, 다양한 질문에 대응이 가능
- 대화튜닝 : 지시튜닝된 LLM에 대화에 적합하게 추가훈련
- 파인튜닝 : 특정 도메인 특화를 위한 추가훈련

# 프롬프트 엔지니어링 방법
- 제로샷 : 단순질문
- 퓨샷 : 예시 드림
- CoT(사고의연쇄) : 단계적으로 생각하라
- 툴제공 : ex.계산할땐 A 함수를 이용하라
- RAG(검색증강생성) : 프롬프트에 첨부할 컨텍스트 제공

# 랭체인
얘는 아래를 수월히 하게해주는 라이브러리
- 다양한 모델 쉽게 적용/변경
- 여러 프롬프트 엔지니어링 방법 통합

# 랭체인 템플릿
- template는 날것의 템플릿
- ChatProptTemplate는 랭체인 대화 인터페이스(역할)를 조합할수있는 템플릿

# 랭체인 명령형/선언형
- 컴포넌트가 반복출력을 짇원하지않아 모든 출력을 하나로 모아 구성하는 경우에 구성방식엔 명령형/선언형이 있다.
- 명령형 : 직접 model.invoke를 호출
- 선언형 : 랭체인 표현언어(LCEL)를 사용
  네, 자바스크립트로 LangChain의 명령형과 선언형 프로그래밍 방식을 예시로 보여드리겠습니다.

## 명령형
**단계별 실행 순서를 명시적으로 기술하는 방식:**

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

// 명령형 방식
async function processQueryImperative(question) {
    try {
        // 1. 프롬프트 템플릿 생성
        const template = PromptTemplate.fromTemplate(
            "질문: {question}\n답변:"
        );
        
        // 2. LLM 초기화
        const llm = new ChatOpenAI({ 
            temperature: 0,
            modelName: "gpt-3.5-turbo"
        });
        
        // 3. 프롬프트 포매팅
        const formattedPrompt = await template.format({ 
            question: question 
        });
        
        // 4. LLM 호출
        const response = await llm.invoke(formattedPrompt);
        
        // 5. 결과 처리
        const result = response.content;
        
        // 6. 추가 처리 (필요시)
        console.log("처리 완료:", result);
        
        return result;
        
    } catch (error) {
        console.error("처리 중 오류:", error);
        throw error;
    }
}

// 사용 예시
const answer = await processQueryImperative("LangChain이란 무엇인가요?");
```

## 선언형 프로그래밍
**원하는 결과를 체인으로 선언하는 방식:**

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// 선언형 방식 (LCEL)
const promptTemplate = PromptTemplate.fromTemplate(
    "질문: {question}\n답변:"
);

const llm = new ChatOpenAI({ 
    temperature: 0,
    modelName: "gpt-3.5-turbo"
});

const outputParser = new StringOutputParser();

// 체인 구성 - 파이프라인 방식
const chain = promptTemplate
    .pipe(llm)
    .pipe(outputParser);

// 사용 예시
const result = await chain.invoke({ 
    question: "LangChain이란 무엇인가요?" 
});
```

## 더 복잡한 예시 비교

### 명령형 방식 - 다단계 처리

```javascript
async function complexProcessImperative(userInput) {
    // 1. 입력 검증
    if (!userInput || userInput.trim() === "") {
        throw new Error("입력값이 없습니다.");
    }
    
    // 2. 첫 번째 체인 - 질문 분석
    const analysisTemplate = PromptTemplate.fromTemplate(
        "다음 질문을 분석해주세요: {input}\n분석결과:"
    );
    const analysisLLM = new ChatOpenAI({ temperature: 0.3 });
    const analysisPrompt = await analysisTemplate.format({ input: userInput });
    const analysisResult = await analysisLLM.invoke(analysisPrompt);
    
    // 3. 두 번째 체인 - 답변 생성
    const answerTemplate = PromptTemplate.fromTemplate(
        "분석결과: {analysis}\n이를 바탕으로 상세한 답변을 제공해주세요:"
    );
    const answerLLM = new ChatOpenAI({ temperature: 0.1 });
    const answerPrompt = await answerTemplate.format({ 
        analysis: analysisResult.content 
    });
    const finalResult = await answerLLM.invoke(answerPrompt);
    
    // 4. 결과 후처리
    const processedResult = {
        original: userInput,
        analysis: analysisResult.content,
        answer: finalResult.content,
        timestamp: new Date().toISOString()
    };
    
    return processedResult;
}
```

### 선언형 방식 - 체인 조합

```javascript
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";

// 분석 체인
const analysisChain = PromptTemplate.fromTemplate(
    "다음 질문을 분석해주세요: {input}\n분석결과:"
).pipe(new ChatOpenAI({ temperature: 0.3 }));

// 답변 체인
const answerChain = PromptTemplate.fromTemplate(
    "분석결과: {analysis}\n이를 바탕으로 상세한 답변을 제공해주세요:"
).pipe(new ChatOpenAI({ temperature: 0.1 }));

// 전체 체인 조합
const complexChain = RunnableSequence.from([
    {
        input: new RunnablePassthrough(),
        analysis: analysisChain
    },
    answerChain,
    new StringOutputParser()
]);

// 사용
const result = await complexChain.invoke({ 
    input: "LangChain의 장단점은 무엇인가요?" 
});
```

## 스트리밍 예시

### 명령형 스트리밍

```javascript
async function streamResponseImperative(question) {
    const template = PromptTemplate.fromTemplate("질문: {question}\n답변:");
    const llm = new ChatOpenAI({ temperature: 0, streaming: true });
    
    const prompt = await template.format({ question });
    const stream = await llm.stream(prompt);
    
    let fullResponse = "";
    for await (const chunk of stream) {
        process.stdout.write(chunk.content);
        fullResponse += chunk.content;
    }
    
    return fullResponse;
}
```

### 선언형 스트리밍

```javascript
const streamingChain = PromptTemplate.fromTemplate("질문: {question}\n답변:")
    .pipe(new ChatOpenAI({ temperature: 0, streaming: true }))
    .pipe(new StringOutputParser());

// 스트리밍 실행
const stream = await streamingChain.stream({ 
    question: "LangChain의 활용 사례는?" 
});

for await (const chunk of stream) {
    process.stdout.write(chunk);
}
```

- 선언형 방식의 핵심은 `.pipe()` 메서드를 통한 체인 연결이다
- 이는 함수형 프로그래밍의 파이프라인 패턴을 구현한 것    
- 각 단계가 명확히 분리되어 있어 가독성이 좋고 테스트와 디버깅이 용이하다는 장점이 있음