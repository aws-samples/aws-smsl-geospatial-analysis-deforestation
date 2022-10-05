#import logging
import boto3
import os
#import botocore
from botocore.exceptions import ClientError

client = boto3.client('s3')

def lambda_handler(event, context):
    coordA=event['a']
    coordB=event['b']
    coordC=event['c']
    coordD=event['d']
    startDate=event['startDate']
    endDate=event['endDate']

    bucketName = os.environ['bucketName']
    destinationFolder = 'folder'

    #folderName = coordA + '-' + coordB + '-' + coordC + '-' + coordD + '-' +  startDate + endDate
    folderName = coordA + '-' + coordB + '-' + coordC + '-' + coordD
    targetFolderName = destinationFolder+'/-'+folderName+'/'

    print('foldername = ' + targetFolderName)
    files = getFiles(bucketName,targetFolderName)

    response = []
    for file in files:
        imageData = {}
        imageData['url'] = create_presigned_url(bucketName, file)
        imageData['titleId'] = file.split('/')[2]
        imageData['date'] = file.split('/')[2].split('.')[0]
        response.append(imageData)
        
    return {
        'statusCode': 200,
        'body': str(response)
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
    s3_client = boto3.client('s3',region_name="us-west-1",config=boto3.session.Config(signature_version='s3v4',))
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


