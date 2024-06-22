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

#3.오픈서치 도메인에 연결
def get_cfn_outputs(stackname, cfn):
    outputs = {}
    for output in cfn.describe_stacks(StackName=stackname)["Stacks"][0]["Outputs"]:
        outputs[output["OutputKey"]] = output["OutputValue"]
    return outputs

import boto3, json


region_name = "us-east-1"

cfn = boto3.client("cloudformation", region_name)
kms = boto3.client("secretsmanager", region_name)

stackname = "opensearch-workshop"
cfn_outputs = get_cfn_outputs(stackname, cfn)

aos_credentials = json.loads(
    kms.get_secret_value(SecretId=cfn_outputs["OpenSearchSecret"])["SecretString"]
)

aos_host = cfn_outputs["OpenSearchDomainEndpoint"]
aos_host

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
aos_host

from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth

auth = (aos_credentials["username"], aos_credentials["password"])

aos_client = OpenSearch(
    hosts=[{"host": aos_host, "port": 443}],
    http_auth=auth,
    use_ssl=True,
    verify_certs=True,
    connection_class=RequestsHttpConnection,
)