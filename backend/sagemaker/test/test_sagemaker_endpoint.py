import boto3
import json
import sys

# Configuration
ENDPOINT_NAME = 'alex-embedding-endpoint'  # Change if needed
INPUT_FILE = 'vectorize_me.json'


def main():
    # Read input JSON
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        payload = f.read()

    # Create SageMaker runtime client
    client = boto3.client('sagemaker-runtime')

    # Invoke endpoint
    response = client.invoke_endpoint(
        EndpointName=ENDPOINT_NAME,
        ContentType='application/json',
        Body=payload
    )

    # Read and print result
    result = response['Body'].read().decode('utf-8')
    print('Response:')
    try:
        print(json.dumps(json.loads(result), indent=2))
    except Exception:
        print(result)


if __name__ == '__main__':
    main()
