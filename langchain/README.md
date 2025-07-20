
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