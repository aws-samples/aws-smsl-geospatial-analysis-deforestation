import json
#import logging
import os
import boto3
import datetime
from botocore.exceptions import ClientError

client = boto3.client('s3')

def handle_message(connection_id, data_payload, apig_management_client):
    status_code = 200

    #message = f"{user_name}: {event_body['msg']}".encode('utf-8')
    message = f"{data_payload}"
    print("Message to send: " + message)
    message = json.dumps(message)
    try:
        send_response = apig_management_client.post_to_connection(
            Data=message, ConnectionId=connection_id)
        print(
            "Posted message to connection " + connection_id)
    except ClientError:
        print("Couldn't post to connection . " + connection_id)
    except apig_management_client.exceptions.GoneException:
        print("Connection  is gone, removing. " + connection_id)

    return status_code


def lambda_handler(event, context):
    print(str(event))
    route_key = event.get('requestContext', {}).get('routeKey')
    connection_id = event.get('requestContext', {}).get('connectionId')
    body = ""
    domain = ""
    stage = ""
    
    if route_key is None or connection_id is None:
        return {'statusCode': 400}

    response = {'statusCode': 200}
    if route_key == 'queryData':

        body = event.get('body')
        body = json.loads(body if body is not None else '{"msg": "error"}')    

        domain = event.get('requestContext', {}).get('domainName')
        stage = event.get('requestContext', {}).get('stage')
        coordA = body['body']['data']['a']
        coordB = body['body']['data']['b']
        coordC = body['body']['data']['c']
        coordD = body['body']['data']['d']
        startDate = body['body']['data']['startDate']
        endDate = body['body']['data']['endDate']
        
        

    bucketName = os.environ['bucketName']
    #destinationFolder = os.environ['folder']

    parsered_startDate = datetime.datetime.strptime(startDate, '%Y-%m-%dT%H:%M:%S.%f')
    parsered_endDate = datetime.datetime.strptime(endDate, '%Y-%m-%dT%H:%M:%S.%f')
    
    #folderName = coordA + '-' + coordB + '-' + coordC + '-' + coordD + '-' +  startDate + endDate
    folderName = coordA + '-' + coordB + '-' + coordC + '-' + coordD + '-' + str(parsered_startDate.date()) + '-' + str(parsered_endDate.date()) 
    #targetFolderName = destinationFolder+'/'+folderName+'/'
    targetFolderName = folderName+'/'

    print('foldername = ' + targetFolderName)
    files = getFiles(bucketName,targetFolderName)

    data_response = []
    for file in files:
        imageData = {}
        imageData['url'] = create_presigned_url(bucketName, file)
        imageData['titleId'] = file.split('/')[1].split('+')[1]
        imageData['date'] = file.split('/')[1].split('+')[1].split('.')[0]
        data_response.append(imageData)

    data_payload = {}
    data_payload["tiles"] = data_response

    print(data_payload)

    apig_management_client = boto3.client('apigatewaymanagementapi', endpoint_url=f'https://{domain}/{stage}')
    response['statusCode'] = handle_message(connection_id, data_payload, apig_management_client)    
 
    return{
       'statusCode': 200
    }


def getFiles(bucketName, prefix):
    response = client.list_objects_v2(
        Bucket=bucketName,
        Prefix=prefix)

    files = []
    for content in response.get('Contents', []):
        print(content['Key'])
        if(content['Key'] == prefix):
            print('skipping')
        else:
            files.append(content['Key'])

    return files

def create_presigned_url(bucketName, objectName, expiration=3600):
    # Choose AWS CLI profile, If not mentioned, it would take default
    #boto3.setup_default_session(profile_name='personal')
    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3',region_name="us-east-1",config=boto3.session.Config(signature_version='s3v4',))
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucketName,
                                                            'Key': objectName,
                                                            },   
                                                    ExpiresIn=expiration)
    except Exception as e:
        print(e)
        #logging.error(e)
        return "Error"
    # The response contains the presigned URL
    print(response)
    return response

