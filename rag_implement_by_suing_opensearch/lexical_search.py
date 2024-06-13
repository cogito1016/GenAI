# 필요 패키지 다운로드
# !pip install -q boto3
# !pip install -q requests
# !pip install -q requests-aws4auth
# !pip install -q opensearch-py
# !pip install -q tqdm
# !pip install -q boto3
# !pip install pandas

# 사용할 데이터 파일을 읽어 판다스 데이터프레임으로 저장
import pandas as pd
import requests
df = pd.read_csv("./data/movies.csv", low_memory=False)
df.head(5)
#데이터 스키마와 레코드 수를 확인
df.info()