#1.필요 패키지 설치
# !pip install -q boto3
# !pip install -q requests
# !pip install -q requests-aws4auth
# !pip install -q opensearch-py
# !pip install -q tqdm
# !pip install -q boto3

#2.데이터준비
import pandas as pd
import requests

df = pd.read_csv("./data/movies.csv", low_memory=False)
df.head(5)

##데이터 스키마 확인
df.info()


#현재 사용할 임베딩모델은 Cohere Multilingual
#이 모델의 Max sequence 길이는 512
#따라서 plot 컬럼의 최대길이를 512로 Truncate
max_length = 509
def truncate_plot(plot):
    if len(plot) > max_length:
        return plot[:max_length] + "..."
    else:
        return plot

# Apply the function to the 'plot' column
df["plot"] = df["plot"].apply(truncate_plot)

#plot(줄거리)의 길이가 512가 넘는 레코드가 있는지 체크
def find_long_plot_items(df):
    long_plot_items = df[df["plot"].str.len() > 512]
    return long_plot_items

find_long_plot_items(df).count()