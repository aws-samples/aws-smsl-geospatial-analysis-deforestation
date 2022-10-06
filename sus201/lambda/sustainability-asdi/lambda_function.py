import logging
import os
import boto3
from botocore.exceptions import ClientError
import os
import json
import datetime
from sentinelhub import (
        CRS,
        BBox,
        WebFeatureService,
        DataCollection,
        SHConfig
    )

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
    if route_key == 'sendData':

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
        
        '''
        coordA = event.get('body',{}).get('data',{}).get('a')
        coordB = event.get('body',{}).get('data',{}).get('b')
        coordC = event.get('body',{}).get('data',{}).get('c')
        coordD = event.get('body',{}).get('data',{}).get('d')
        startDate = event.get('body',{}).get('data',{}).get('startDate')
        endDate = event.get('body',{}).get('data',{}).get('endDate')
        '''

   
    #coordA=data['a']
    #coordB=data['b']
    #coordC=data['c']
    #coordD=data['d']
    #startDate=data['startDate']
    #endDate=data['endDate']
    
    config = SHConfig()
    
    '''
    Instance ID from from your Sentinel Hub account 
    '''
    config.instance_id = os.environ['instance_id']

    if config.instance_id == '':
        print("Warning! To use WFS functionality, please configure the `instance_id`.")
    
    search_bbox = BBox(bbox=[coordA,coordB,coordC,coordD],crs=CRS.WGS84)
    search_time_interval = (startDate, endDate)
    
    wfs_iterator = WebFeatureService(
        search_bbox,
        search_time_interval,
        data_collection=DataCollection.SENTINEL2_L1C,
        maxcc=0.2,
        #maxcc=1.0,
        config=config
    )

    #bands = ['B04.jp2','B08.jp2']
    totalCountToReturn = 4
    tiles = []
    #s3_urls = []
    #filtered_urls = []

    uniqueKeys = []
    for tile_info in wfs_iterator:
        path = tile_info['properties']['path']
        if(path.__contains__('tiles/10/S/FJ')):
            pathEntries = path.split('/')
            key = pathEntries[len(pathEntries)-4]+'-' + pathEntries[len(pathEntries)-3]
            if(key not in uniqueKeys):
                uniqueKeys.append(key)
                tiles.append(tile_info['properties']['path'])

    sqs = boto3.client('sqs')
    s3Folder = os.environ['s3Bucket'] + '-' + coordA + '-' + coordB + '-' + coordC + '-' + coordD 
    message = {}
    
    for url in tiles:
        message["s3Location"] = s3Folder
        message["asdi_url"] = url
        sqs.send_message(QueueUrl=os.environ['sqs_url'], MessageBody=json.dumps(message))
        print("sent message to sqs" + json.dumps(message) )
       

    print("End date and time: " + str(datetime.datetime.now()))
    return {
        'statusCode': 200
    }
     
    #return {
    #    'statusCode': 200,
    #    'body': json.dumps('Complete')
    #}

#response=lambda_handler({"a": "-121.64","b": "39.68","c": "-121.68","d": "39.72","startDate": "2018-11-01T00:00:00","endDate": "2019-11-01T23:59:59"},[])
#print('response is ' + str(response))
