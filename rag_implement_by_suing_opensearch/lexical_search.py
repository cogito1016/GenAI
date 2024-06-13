# 필요 패키지 다운로드
# !pip install -q boto3
# !pip install -q requests
# !pip install -q requests-aws4auth
# !pip install -q opensearch-py
# !pip install -q tqdm
# !pip install -q boto3
# !pip install pandas

######################################################

# 사용할 데이터 파일을 읽어 판다스 데이터프레임으로 저장
import pandas as pd
import requests
df = pd.read_csv("./data/movies.csv", low_memory=False)
df.head(5)
#데이터 스키마와 레코드 수를 확인
df.info()

######################################################

#OpenSearch 도메인에 연결
#utils 디렉토리에 있는 공용모듈을 사용하기 위한 준비
#이 코드로 OpenSarch 도메인에 연결하는데 필요한 자격증명과 엔드포인트 주소를 가져올 수 있다.
#이 정보를 사용하여 OpenSarch 클라이언트를 초기화하고 인덱싱,검색등의 작업을 수행할 수 있다.
def get_cfn_outputs(stackname, cfn):
    outputs = {}
    for output in cfn.describe_stacks(StackName=stackname)["Stacks"][0]["Outputs"]:
        outputs[output["OutputKey"]] = output["OutputValue"]
    return outputs

import boto3, json
region_name = "us-west-2"

cfn = boto3.client("cloudformation", region_name)
kms = boto3.client("secretsmanager", region_name)

stackname = "opensearch-workshop"
cfn_outputs = get_cfn_outputs(stackname, cfn)

aos_credentials = json.loads(
    kms.get_secret_value(SecretId=cfn_outputs["OpenSearchSecret"])["SecretString"]
)

aos_host = cfn_outputs["OpenSearchDomainEndpoint"]

#이 코드로부터 가져온 호스트 URL과 인증정보를 통해 OpenSarch 도메인에 연결한다.
from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth

auth = (aos_credentials["username"], aos_credentials["password"])

aos_client = OpenSearch(
    hosts=[{"host": aos_host, "port": 443}],
    http_auth=auth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
)

#잘 연결되어있는지 테스트, analyze엔드포인트를 사용하여 nori 분석기로 간단한 테스트를 진행
request_body = {"analyzer": "nori", "text": "OpenSearch 워크샵에 오신 고객 여러분 환영합니다."}
# Send the request to the _analyze endpoint
response = aos_client.indices.analyze(body=request_body)
# Print the response
print(json.dumps(response, indent=4, ensure_ascii=False))

# 인덱스를 생성, 인덱스이름과 매핑정보를 지정한다.
index_name = "movie_lexical"

movie_lexical = {
    "settings": {
        "number_of_replicas": 0,
        "number_of_shards": 1,
        "max_result_window": 15000,
        "analysis": {"analyzer": {"analysis-nori": {"type": "nori", "stopwords": "_korean_"}}},
    },
    "mappings": {
        "properties": {
            "date": {
                "type": "float",
            },
            "genre": {
                "type": "text",
            },
            "main_act": {
                "type": "text",
                "fields": {"keyword": {"type": "keyword", "ignore_above": 256}},
            },
            "plot": {
                "type": "text",
            },
            "rating": {"type": "float"},
            "supp_act": {
                "type": "text",
                "fields": {"keyword": {"type": "keyword", "ignore_above": 256}},
            },
            "title": {
                "type": "text",
                "fields": {"keyword": {"type": "keyword", "ignore_above": 256}},
            },
            "vote_count": {"type": "long"},
            "year": {"type": "long"},
        }
    },
}
aos_client.indices.create(index=index_name, body=movie_lexical)
aos_client.indices.get(index=index_name)

#데이터 인제스트
#Opensearchpy패키지에서 제공하는 parallel_bulk를 사용하 빠르게 데이터 인제스트
from opensearchpy import helpers

# Pandas DataFrame을 JSON 형식의 문자열로 변환
json_data = df.to_json(orient="records", lines=True)
# JSON 문자열을 개별 JSON 객체로 분할하고, 마지막 빈 줄을 제거
docs = json_data.split("\n")[:-1]  # To remove the last empty line


# JSON 객체를 OpenSearch에 업로드할 수 있는 형식으로 변환
def _generate_data():
    for doc in docs:
        yield {"_index": index_name, "_source": doc}


succeeded = []
failed = []
# 병렬로 벌크 업로드를 수행
for success, item in helpers.parallel_bulk(
    aos_client, actions=_generate_data(), chunk_size=20, thread_count=4, queue_size=4
):
    if success:
        succeeded.append(item)
    else:
        failed.append(item)

# 데이터가 바로 반영되도록 인덱스를 Refresh하고, 인제스트가 잘 되었는지 확인하기 위해 도큐먼트의 총 합을 Count로 확인
aos_client.indices.refresh(index=index_name)
count = aos_client.count(index=index_name)
print(count)
# {'count': 11713, '_shards': {'total': 1, 'successful': 1, 'skipped': 0, 'failed': 0}}

######################################################

#키워드 검색 결과 확인하기(렉시컬 탐색)
def keyword_search(query_text):
    query = {
        "size": 10,
        "query": {
            "multi_match": {
                "query": query_text,
                "fields": ["plot"],
            }
        },
    }

    res = aos_client.search(index=index_name, body=query)

    query_result = []
    for hit in res["hits"]["hits"]:
        row = [
            hit["_score"],
            hit["_source"]["title"],
            hit["_source"]["plot"],
            hit["_source"]["genre"],
            hit["_source"]["rating"],
            hit["_source"]["main_act"],
        ]
        query_result.append(row)

    query_result_df = pd.DataFrame(
        data=query_result,
        columns=["_score", "title", "plot", "genre", "rating", "main_act"],
    )
    display(query_result_df)


def keyword_search(query_text):
    query = {
        "size": 10,
        "query": {
            "multi_match": {
                "query": query_text,
                "fields": ["plot"],
            }
        },
    }

    res = aos_client.search(index=index_name, body=query)

    query_result = []
    for hit in res["hits"]["hits"]:
        row = [
            hit["_score"],
            hit["_source"]["title"],
            hit["_source"]["plot"],
            hit["_source"]["genre"],
            hit["_source"]["rating"],
            hit["_source"]["main_act"],
        ]
        query_result.append(row)

    query_result_df = pd.DataFrame(
        data=query_result,
        columns=["_score", "title", "plot", "genre", "rating", "main_act"],
    )
    display(query_result_df)

#상위 10개 검색결과 확인
keyword_search("지구의 영웅들이 힘을 합쳐 우주의 악당을 물리친다")
